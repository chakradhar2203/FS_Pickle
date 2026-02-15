import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Uploads a file to Firebase Storage and returns its download URL.
 * @param file The file to upload.
 * @param path The path in storage where the file should be saved.
 * @returns A promise that resolves to the download URL.
 */
export const uploadProductImage = async (file: File, path: string = "products/"): Promise<string> => {
    const storageRef = ref(storage, `${path}${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
};
