import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin SDK (server-side)
let adminApp: App;

if (!getApps().length) {
    adminApp = initializeApp({
        projectId: "pickle-business-b1b0e",
    });
} else {
    adminApp = getApps()[0];
}

const adminAuth = getAuth(adminApp);

// List of admin emails from environment variable
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

// Admin password from environment variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

/**
 * Verify a Firebase ID token and return the decoded token.
 */
export async function verifyIdToken(token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        return null;
    }
}

/**
 * Check if an email is in the admin allowlist.
 */
export function isAdminEmail(email: string | undefined): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Check if the provided password matches the admin password.
 */
export function isValidAdminPassword(password: string | undefined): boolean {
    if (!password || !ADMIN_PASSWORD) return false;
    return password === ADMIN_PASSWORD;
}

/**
 * Authenticate an admin request.
 * Supports two methods:
 * 1. Firebase Auth token in "Authorization: Bearer <token>" header
 * 2. Admin password in "x-admin-password" header
 * 
 * Returns { authenticated: true, method: string } or { authenticated: false, error: string, status: number }
 */
export async function authenticateAdmin(request: Request): Promise<
    | { authenticated: true; method: string; email?: string }
    | { authenticated: false; error: string; status: number }
> {
    // Method 1: Check for admin password header
    const adminPassword = request.headers.get("x-admin-password");
    if (adminPassword) {
        if (isValidAdminPassword(adminPassword)) {
            return { authenticated: true, method: "password" };
        }
        return { authenticated: false, error: "Invalid admin password", status: 401 };
    }

    // Method 2: Check for Firebase Auth token
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
            authenticated: false,
            error: "Missing authentication. Provide either 'Authorization: Bearer <token>' or 'x-admin-password' header.",
            status: 401,
        };
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await verifyIdToken(token);

    if (!decodedToken) {
        return { authenticated: false, error: "Invalid or expired token", status: 401 };
    }

    if (!isAdminEmail(decodedToken.email)) {
        return {
            authenticated: false,
            error: `User ${decodedToken.email} is not authorized as admin`,
            status: 403,
        };
    }

    return { authenticated: true, method: "firebase-token", email: decodedToken.email };
}
