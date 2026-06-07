package com.finders.app.billing;

import androidx.annotation.Nullable;

import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.Collections;
import java.util.List;

/**
 * Google Play Billing(v8) 얇은 브릿지.
 * 검증·consume·충전은 서버(POST /payments/google/verify)가 처리하므로
 * 여기서는 결제 시트 호출과 토큰 반환까지만 담당한다. (클라에서 consume/acknowledge 하지 않음)
 */
@CapacitorPlugin(name = "FindersBilling")
public class FindersBillingPlugin extends Plugin implements PurchasesUpdatedListener {

    private BillingClient billingClient;
    // 진행 중인 결제 1건의 PluginCall. onPurchasesUpdated에서 resolve/reject 한다.
    @Nullable
    private PluginCall pendingPurchaseCall;

    @Override
    public void load() {
        super.load();
        billingClient = BillingClient.newBuilder(getContext())
                .setListener(this)
                .enablePendingPurchases(
                        PendingPurchasesParams.newBuilder()
                                .enableOneTimeProducts()
                                .build())
                .enableAutoServiceReconnection()
                .build();
        ensureReady(null, null);
    }

    @PluginMethod
    public void queryProducts(PluginCall call) {
        JSArray ids = call.getArray("productIds");
        if (ids == null) {
            call.reject("productIds is required");
            return;
        }

        List<QueryProductDetailsParams.Product> products = new java.util.ArrayList<>();
        try {
            for (int i = 0; i < ids.length(); i++) {
                products.add(
                        QueryProductDetailsParams.Product.newBuilder()
                                .setProductId(ids.getString(i))
                                .setProductType(BillingClient.ProductType.INAPP)
                                .build());
            }
        } catch (Exception e) {
            call.reject("Invalid productIds");
            return;
        }

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(products)
                .build();

        ensureReady(call, () ->
                billingClient.queryProductDetailsAsync(params, (billingResult, result) -> {
                    if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                        call.reject(
                                "QUERY_FAILED: " + billingResult.getDebugMessage(),
                                String.valueOf(billingResult.getResponseCode()));
                        return;
                    }
                    JSArray arr = new JSArray();
                    for (ProductDetails pd : result.getProductDetailsList()) {
                        arr.put(toProductJS(pd));
                    }
                    JSObject ret = new JSObject();
                    ret.put("products", arr);
                    call.resolve(ret);
                }));
    }

    @PluginMethod
    public void purchase(PluginCall call) {
        String productId = call.getString("productId");
        if (productId == null) {
            call.reject("productId is required");
            return;
        }
        if (pendingPurchaseCall != null) {
            call.reject("PURCHASE_IN_PROGRESS");
            return;
        }

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(Collections.singletonList(
                        QueryProductDetailsParams.Product.newBuilder()
                                .setProductId(productId)
                                .setProductType(BillingClient.ProductType.INAPP)
                                .build()))
                .build();

        ensureReady(call, () ->
                billingClient.queryProductDetailsAsync(params, (billingResult, result) -> {
                    List<ProductDetails> list = result.getProductDetailsList();
                    if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK
                            || list.isEmpty()) {
                        call.reject("PRODUCT_NOT_FOUND: " + productId);
                        return;
                    }

                    BillingFlowParams flowParams = BillingFlowParams.newBuilder()
                            .setProductDetailsParamsList(Collections.singletonList(
                                    BillingFlowParams.ProductDetailsParams.newBuilder()
                                            .setProductDetails(list.get(0))
                                            .build()))
                            .build();

                    pendingPurchaseCall = call;
                    getActivity().runOnUiThread(() -> {
                        BillingResult launch =
                                billingClient.launchBillingFlow(getActivity(), flowParams);
                        if (launch.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                            pendingPurchaseCall = null;
                            call.reject(
                                    "LAUNCH_FAILED: " + launch.getDebugMessage(),
                                    String.valueOf(launch.getResponseCode()));
                        }
                    });
                }));
    }

    @PluginMethod
    public void getOwnedPurchases(PluginCall call) {
        QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.INAPP)
                .build();

        ensureReady(call, () ->
                billingClient.queryPurchasesAsync(params, (billingResult, purchases) -> {
                    if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                        call.reject(
                                "QUERY_FAILED: " + billingResult.getDebugMessage(),
                                String.valueOf(billingResult.getResponseCode()));
                        return;
                    }
                    JSArray arr = new JSArray();
                    for (Purchase purchase : purchases) {
                        if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                            arr.put(toPurchaseJS(purchase));
                        }
                    }
                    JSObject ret = new JSObject();
                    ret.put("purchases", arr);
                    call.resolve(ret);
                }));
    }

    @Override
    public void onPurchasesUpdated(BillingResult billingResult, @Nullable List<Purchase> purchases) {
        PluginCall call = pendingPurchaseCall;
        pendingPurchaseCall = null;
        if (call == null) {
            return;
        }

        int code = billingResult.getResponseCode();
        if (code == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (Purchase purchase : purchases) {
                if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                    call.resolve(toPurchaseJS(purchase));
                    return;
                }
            }
            // 결제는 됐지만 아직 PENDING(가상계좌 등) 상태
            call.reject("PENDING");
        } else if (code == BillingClient.BillingResponseCode.USER_CANCELED) {
            call.reject("USER_CANCELED");
        } else {
            call.reject(
                    "PURCHASE_FAILED: " + billingResult.getDebugMessage(),
                    String.valueOf(code));
        }
    }

    /** BillingClient 연결을 보장한 뒤 action 실행. 실패 시 call이 있으면 reject. */
    private void ensureReady(@Nullable PluginCall call, @Nullable Runnable action) {
        if (billingClient.isReady()) {
            if (action != null) {
                action.run();
            }
            return;
        }
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(BillingResult result) {
                if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    if (action != null) {
                        action.run();
                    }
                } else if (call != null) {
                    call.reject(
                            "BILLING_UNAVAILABLE: " + result.getDebugMessage(),
                            String.valueOf(result.getResponseCode()));
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                // enableAutoServiceReconnection()이 재연결을 처리한다.
            }
        });
    }

    private JSObject toProductJS(ProductDetails pd) {
        JSObject obj = new JSObject();
        obj.put("productId", pd.getProductId());
        obj.put("title", pd.getTitle());
        obj.put("description", pd.getDescription());
        ProductDetails.OneTimePurchaseOfferDetails offer = pd.getOneTimePurchaseOfferDetails();
        if (offer != null) {
            obj.put("formattedPrice", offer.getFormattedPrice());
            obj.put("priceAmountMicros", String.valueOf(offer.getPriceAmountMicros()));
            obj.put("currency", offer.getPriceCurrencyCode());
        }
        return obj;
    }

    private JSObject toPurchaseJS(Purchase purchase) {
        JSObject obj = new JSObject();
        List<String> ids = purchase.getProducts();
        obj.put("productId", ids.isEmpty() ? null : ids.get(0));
        obj.put("purchaseToken", purchase.getPurchaseToken());
        obj.put("orderId", purchase.getOrderId());
        return obj;
    }
}
