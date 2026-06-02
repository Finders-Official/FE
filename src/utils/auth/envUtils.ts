export const isNativeApp = () => {
  // User-Agent에 특정 앱 이름이나 식별자가 있는지 확인
  return /FindersApp/i.test(navigator.userAgent); // 식별자는 변경 예정
};
