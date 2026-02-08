import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile,
    User,
    UserCredential
} from "firebase/auth";
import { auth } from "./firebase";

// Sign up with email and password
export const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string
): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update user profile with display name
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });

        // Send email verification
        await sendEmailVerification(userCredential.user);
    }

    return userCredential;
};

// Sign in with email and password
export const signInWithEmail = async (
    email: string,
    password: string
): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email, password);
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
};

// Sign out
export const logOut = async (): Promise<void> => {
    return await signOut(auth);
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
    return await sendPasswordResetEmail(auth, email);
};

// Resend verification email
export const resendVerificationEmail = async (): Promise<void> => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
        await sendEmailVerification(user);
    } else if (!user) {
        throw new Error("No user is currently logged in");
    } else {
        throw new Error("Email is already verified");
    }
};

// Get current user
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};
