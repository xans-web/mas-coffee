import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { MainSiteProduct } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    console.log("Fetching main_site_products...");
    const products = await MainSiteProduct.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Products GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    console.log("Creating main_site_product:", body);
    
    const priceOk = typeof body.price === "number" && !Number.isNaN(body.price);
    if (!body.name || !body.category || !priceOk || !body.image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await MainSiteProduct.create(body);
    console.log("Product created successfully:", product._id);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Products POST Error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { _id, ...updateData } = body;
    console.log("Updating main_site_product:", _id, updateData);
    
    if (!_id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const product = await MainSiteProduct.findByIdAndUpdate(_id, updateData, { new: true });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    
    console.log("Product updated successfully:", _id);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Products PUT Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    console.log("Deleting main_site_product:", id);
    
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const result = await MainSiteProduct.findByIdAndDelete(id);
    if (!result) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    
    console.log("Product deleted successfully:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Products DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
