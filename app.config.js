import 'dotenv/config'

export default {
  expo: {
    name: "Hostel Finder",
    slug: "hostelFinder",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo-small.png",
    scheme: "hostelfinder",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/logo-small.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.sarvad.hostelFinder",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.sarvad.hostelFinder",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "3eafaa73-030a-4d6a-8f93-b1023dbe2f51",
      },
      endpoint: process.env.APPWRITE_ENDPOINT,
      platform: process.env.APPWRITE_PLATFORM,
      projectId: process.env.APPWRITE_PROJECT_ID,
      databaseId: process.env.APPWRITE_DATABASE_ID,
      userCollectionId: process.env.APPWRITE_USER_COLLECTION_ID,
      hostelCollectionId: process.env.APPWRITE_HOSTEL_COLLECTION_ID,
      storageId: process.env.APPWRITE_STORAGE_ID,
      savedHostelCollectionId: process.env.APPWRITE_SAVED_HOSTEL_COLLECTION_ID,
    },
  },
};
