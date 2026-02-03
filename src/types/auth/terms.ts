export type Section = {
  id: "service" | "privacy" | "notify" | "location";
  title: string;
  badge: "필수" | "선택";
  body: string;
};
