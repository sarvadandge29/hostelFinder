import Constants from "expo-constants";

import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const endpoint = Constants.expoConfig.extra.endpoint
export const projectId = Constants.expoConfig.extra.projectId
export const platform = Constants.expoConfig.extra.platform
export const databaseId = Constants.expoConfig.extra.databaseId
export const userCollectionId = Constants.expoConfig.extra.userCollectionId
export const hostelCollectionId = Constants.expoConfig.extra.hostelCollectionId
export const storageId = Constants.expoConfig.extra.storageId
export const savedHostelCollectionId = Constants.expoConfig.extra.savedHostelCollectionId


const client = new Client();

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const avatars = new Avatars(client);
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Create a new user and sign in
export const createUser = async (email, password, name, phonenumber) => {
  try {
    // Create the account
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw new Error("Account creation failed");

    // Generate avatar URL
    const avatarUrl = avatars.getInitials(name || "Anonymous");

    // Sign in the user
    const session = await signIn(email, password);

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
        isAdmin: false,
      }
    );

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
    return session;
  } catch (error) {
    console.error("Error in signOut:", error);
    throw new Error(error.message);
  }
};

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    return null;
  }
}

//Get all user
export async function getAllUsers() {
  try {
    const user = await databases.listDocuments(
      databaseId,
      userCollectionId
    );

    return user.documents;
  } catch (error) {
    throw new Error(error.message || "Failed to get all user.");
  }
}
//updateuser 
export const updateUser = async (userId, userData) => {
  try {
    // Assuming userCollectionId is the ID of your user collection
    const response = await databases.updateDocument(
      databaseId,
      userCollectionId,
      userId,
      userData
    );
    return response;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user: " + error.message);
  }
};

//delete user
export const deleteUserById = async (name) => {
  try {
    const response = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("name", name)] // Adjust this to your query as needed
    );

    if (response.documents.length === 0) {
      throw new Error("No user found with the provided name.");
    }

    const user = response.documents[0];
    const userId = user.$id;

    await databases.deleteDocument(databaseId, userCollectionId, userId);

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user: " + error.message);
  }
};

// Search for hostels based on a query
export async function searchUser(query) {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.search("name", query)]
    );

    return posts.documents;
  } catch (error) {
    console.error("Error fetching hostels:", error);
    throw new Error(
      error.message || "An error occurred while fetching hostels"
    );
  }
}

// Search for hostels based on a query
export async function searchHostel(query) {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      hostelCollectionId,
      [Query.search("title", query)]
    );

    return posts.documents;
  } catch (error) {
    console.error("Error fetching hostels:", error);
    throw new Error(
      error.message || "An error occurred while fetching hostels"
    );
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

export const saveHostel = async (userId, hostelId) => {
  try {
    const savedHostel = await databases.createDocument(
      databaseId,
      savedHostelCollectionId,
      ID.unique(),
      {
        userId,
        hostelId,
      }
    );

    return savedHostel;
  } catch (error) {
    console.error("Error in saving hostel:", error);
    throw new Error(error.message || "Failed to save the hostel.");
  }
};

export const unsaveHostel = async (userId, hostelId) => {
  try {
    // First, find the saved document for the given user and hostel
    const savedHostel = await databases.listDocuments(
      databaseId,
      savedHostelCollectionId,
      [Query.equal("userId", userId), Query.equal("hostelId", hostelId)]
    );

    if (savedHostel.total > 0) {
      // Delete the saved document if found
      const documentId = savedHostel.documents[0].$id;
      await databases.deleteDocument(
        databaseId,
        savedHostelCollectionId,
        documentId
      );
      return true;
    } else {
      throw new Error("Hostel not found in saved list.");
    }
  } catch (error) {
    console.error("Error in unsaving hostel:", error);
    throw new Error(error.message || "Failed to unsave the hostel.");
  }
};

export const isHostelSaved = async (userId, hostelId) => {
  try {
    const result = await databases.listDocuments(
      databaseId,
      savedHostelCollectionId,
      [Query.equal("userId", userId), Query.equal("hostelId", hostelId)]
    );

    return result.total > 0; // Return true if the hostel is saved
  } catch (error) {
    console.error("Error in checking if hostel is saved:", error);
    throw new Error(error.message || "Failed to check if hostel is saved.");
  }
};

export async function getSavedHostels(userId) {
  try {
    const result = await databases.listDocuments(
      databaseId,
      savedHostelCollectionId,
      [Query.equal("userId", userId)]
    );
    return result.documents;
  } catch (error) {
    console.error("Error in getting saved hostel:", error);
    throw new Error(error.message || "Failed to get saved hostel.");
  }
}

// Get File Preview and format the URL
export async function getFilePreview(fileId, type) {
  const bucketId = storageId; // Use your actual bucket ID
  let fileUrl;

  try {
    if (type === "video" || type === "image") {
      fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}&mode=admin`;
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw new Error("File URL is empty");

    return fileUrl;
  } catch (error) {
    console.error("Error generating file preview URL:", error);
    throw new Error(error.message || "Failed to generate file preview URL");
  }
}

//Upload Image
export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Function to add hostel information to the database
export async function addHostel(form) {
  try {
    const [imageUrl1, imageUrl2, imageUrl3, imageUrl4] =
      await Promise.all([
        uploadFile(form.image1, "image"),
        uploadFile(form.image2, "image"),
        uploadFile(form.image3, "image"),
        uploadFile(form.image4, "image"),
      ]);

    const newHostel = await databases.createDocument(
      databaseId,
      hostelCollectionId,
      ID.unique(),
      {
        title: form.title,
        amenities: form.amenities,
        thumbnail: imageUrl1,
        fees: form.fees,
        ownerNumber: form.ownerNumber,
        description: form.description,
        image1: imageUrl1,
        image2: imageUrl2,
        image3: imageUrl3,
        image4: imageUrl4,
        mapLink: form.mapLink,
        hostelId: ID.unique(),
      }
    );

    return newHostel;
  } catch (error) {
    throw new Error(error);
  }
}

// Function to delete images and video of the hostel
export const deleteImagesAndVideoOfHostel = async (hostel) => {
  const { image1, image2, image3, image4, video } = hostel;

  try {
    const deletePromises = [];

    if (image1) deletePromises.push(deleteFileFromBucket(image1));
    if (image2) deletePromises.push(deleteFileFromBucket(image2));
    if (image3) deletePromises.push(deleteFileFromBucket(image3));
    if (image4) deletePromises.push(deleteFileFromBucket(image4));
    if (video) deletePromises.push(deleteFileFromBucket(video));

    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Failed to delete files from bucket:", error);
    throw new Error("Error deleting hostel images or video");
  }
};

// Function to delete a file from the bucket given its URL
export const deleteFileFromBucket = async (fileUrl) => {
  try {
    const fileId = extractFileIdFromUrl(fileUrl);

    if (fileId) {
      await storage.deleteFile(storageId, fileId);
    } else {
      throw new Error("Failed to extract file ID from URL");
    }
  } catch (error) {
    console.error("Failed to delete file:", error);
    throw new Error("Error deleting file from Appwrite storage");
  }
};

const extractFileIdFromUrl = (url) => {
  const match = url.match(/files\/([^\/]+)\/view/);
  return match ? match[1] : null;
};

// Find and delete the hostel document from the database
export const deleteHostel = async (title) => {
  try {
    const response = await databases.listDocuments(
      databaseId,
      hostelCollectionId,
      [Query.equal("title", title)]
    );

    if (response.documents.length === 0) {
      throw new Error("No hostel found with the provided title.");
    }

    const hostel = response.documents[0];
    const hostelId = hostel.$id;

    await deleteImagesAndVideoOfHostel(hostel);

    await databases.deleteDocument(databaseId, hostelCollectionId, hostelId);

    return true;
  } catch (error) {
    console.error("Error deleting hostel:", error);
    throw new Error("Failed to delete hostel: " + error.message);
  }
};