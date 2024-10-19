import {
  endpoint,
  projectId,
  platform,
  databaseId,
  userCollectionId,
  hostelCollectionId,
  storageId,
  savedHostelCollectionId,
} from "../env";

import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

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

export async function getSavedHostels (userId) {
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
};

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
    const [imageUrl1, imageUrl2, imageUrl3, imageUrl4, videoUrl] = await Promise.all([
      uploadFile(form.image1, "image"),
      uploadFile(form.image2, "image"),
      uploadFile(form.image3, "image"),
      uploadFile(form.image4, "image"),
      uploadFile(form.video, "video"),
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
        video: videoUrl,
        hostelId: ID.unique(),
      }
    );

    return newHostel;
  } catch (error) {
    throw new Error(error);
  }
}

export const deleteHostel = async (title) => {
  try {
    const response = await databases.listDocuments(databaseId, hostelCollectionId, [
      Query.equal('title', title)
    ]);

    if (response.documents.length === 0) {
      console.error(`No hostel found with title: ${title}`);
      throw new Error("No hostel found with the provided title.");
    }

    const hostelId = response.documents[0].$id;

    await databases.deleteDocument(databaseId, hostelCollectionId, hostelId);
    console.log(`Hostel with title "${title}" has been deleted successfully.`);

    return true;
  } catch (error) {
    console.error("Error deleting hostel:", error.message);
    throw new Error("Failed to delete hostel: " + error.message);
  }
};
