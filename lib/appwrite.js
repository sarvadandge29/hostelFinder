import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.sarvad.hostelFinder",
  projectId: "670aa46e0033db9b8723",
  databaseId: "670aa4c70011b6fd70d2", // Correcting the typo
  userCollectionId: "670aa4cd00271b545344",
  hostelCollectionId: "670aa684002aadaea9be",
  storageId: "670aa77200163d39e7b6",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const avatars = new Avatars(client);
const account = new Account(client);
const databases = new Databases(client);

export const createUser = async (email, password, name, phonenumber) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw new Error("Account creation failed");

    const avatarUrl = avatars.getInitials(name);

    await signIn(email, password);

    // Create a new user document in the database, including phone number
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        name,
        PhoneNumber: phonenumber, // Add the phone number here
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    throw new Error(error);
  }
};

export async function searchHostel(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.hostelCollectionId,
      [Query.search("title", query)]
    );

    // Check if posts exist and has documents
    if (!posts || !posts.documents || posts.documents.length === 0) {
      throw new Error("No documents found");
    }

    return posts.documents; // Return the array of documents
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching hostels:", error);
    throw new Error(error.message || "An error occurred while fetching hostels");
  }
}


export async function getAllHostels() {
  try {
    const hostel = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.hostelCollectionId
    );

    return hostel.documents;
  } catch (error) {
    throw new Error(error);
  }
}
