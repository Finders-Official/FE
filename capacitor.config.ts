import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.finders.app",
  appName: "Finders",
  webDir: "dist",
  appendUserAgent: "FindersApp",
  ios: {
    packageManager: "cocoapods",
  },
};

export default config;
