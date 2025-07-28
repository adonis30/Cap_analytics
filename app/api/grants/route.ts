import { NextResponse } from "next/server";
import { getAllGrants } from "@/lib/actions/grants.actions";
import { connectToDatabase } from "@/lib/database";

export async function GET() {
  try {
    await connectToDatabase();
    const grants = await getAllGrants();
    console.log("grants", grants)
    return NextResponse.json(grants || []);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to fetch grants" }, { status: 500 });
  }
}
