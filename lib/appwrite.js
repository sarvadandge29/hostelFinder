import {
  endpoint,
  projectId,
  platform,
  databaseId,
  userCollectionId,
  hostelCollectionId,
  storageId
} from "../env";

import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

const client = new Client();

client
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setPlatform(platform);

const avatars = new Avatars(client);
const account = new Account(client);
const databases = new Databases(client);

// Create a new user and sign in
export const createUser = async (email, password, name, phonenumber) => {
  try {
    // Create the account
    const newAccount = await account.create(ID.unique(), email, password, name);
    console.log("New account created:", newAccount);

    if (!newAccount) throw new Error("Account creation failed");

    // Generate avatar URL
    const avatarUrl = avatars.getInitials(name || "Anonymous");
    console.log("Avatar URL:", avatarUrl);

    // Sign in the user
    const session = await signIn(email, password);
    console.log("User signed in successfully:", session);

    // Create user document in the database
    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        name,
        PhoneNumber: phonenumber || "",
        avatar: avatarUrl,
      }
    );
    console.log("New user document created:", newUser);

    return newUser;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw new Error(error.message);
  }
};

// Sign in an existing user
export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Session created:", session);
    return session;
  } catch (error) {
    console.error("Error in signIn:", error);
    throw new Error(error.message);
  }
};

// Sign out the current user
export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    console.log("Session deleted:", session);
    return session;
  } catch (error) {
    console.error("Error in signOut:", error);
    throw new Error(error.message);
  }
};

// Get the current authenticated user's details
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    console.log("Current account:", currentAccount);

    if (!currentAccount) throw new Error("No current account found.");

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    console.log("Current user documents:", currentUser);

    if (!currentUser || !currentUser.documents || currentUser.documents.length === 0) {
      throw new Error("No user documents found.");
    }

    return currentUser.documents[0];
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    throw new Error(error.message || "Failed to retrieve current user.");
  }
};

// Search for hostels based on a query
export async function searchHostel(query) {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      hostelCollectionId,
      [Query.search("title", query)]
    );

    if (!posts || !posts.documents || posts.documents.length === 0) {
      throw new Error("No documents found");
    }

    return posts.documents;
  } catch (error) {
    console.error("Error fetching hostels:", error);
    throw new Error(error.message || "An error occurred while fetching hostels");
  }
}

// Get all hostels
export async function getAllHostels() {
  try {
    const hostel = await databases.listDocuments(
      databaseId,
      hostelCollectionId
    );

    return hostel.documents;
  } catch (error) {
    console.error("Error in getAllHostels:", error);
    throw new Error(error.message || "Failed to get all hostels.");
  }
}