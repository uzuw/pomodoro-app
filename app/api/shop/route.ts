// app/api/shop/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose"; // Adjust path based on your structure
import ShopItem from "@/server/src/models/ShopItem";

export async function GET() {
  try {
    await connectDB();
    const items = await ShopItem.find();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("[SHOP_GET]", error);
    return NextResponse.json({ success: false, message: "Failed to fetch items." }, { status: 500 });
  }
}
