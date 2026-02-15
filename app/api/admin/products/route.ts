import { NextResponse } from "next/server";
import { saveProductToFirestore, getProductsFromFirestore } from "@/lib/firestore";
import { authenticateAdmin } from "@/lib/firebaseAdmin";

/**
 * Handle POST request to create or update a product.
 * Requires admin authentication via Firebase token or admin password.
 */
export async function POST(request: Request) {
    try {
        // Authenticate the request
        const authResult = await authenticateAdmin(request);
        if (!authResult.authenticated) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const product = await request.json();

        if (!product.id || !product.name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await saveProductToFirestore(product);
        return NextResponse.json(
            { message: "Product saved successfully", product, authMethod: authResult.method },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error in POST /api/admin/products:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * Handle GET request to fetch all products.
 * Requires admin authentication via Firebase token or admin password.
 */
export async function GET(request: Request) {
    try {
        // Authenticate the request
        const authResult = await authenticateAdmin(request);
        if (!authResult.authenticated) {
            return NextResponse.json(
                { error: authResult.error },
                { status: authResult.status }
            );
        }

        const products = await getProductsFromFirestore();
        return NextResponse.json(products);
    } catch (error: any) {
        console.error("Error in GET /api/admin/products:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
