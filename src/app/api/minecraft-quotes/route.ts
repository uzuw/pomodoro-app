import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://minecraft-api.vercel.app/api/items");

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "No items found" }, { status: 500 });
    }

    const randomItem = data[Math.floor(Math.random() * data.length)];

    return NextResponse.json({
      name: randomItem.name,
      description: randomItem.description,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
