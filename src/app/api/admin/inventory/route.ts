import { NextResponse } from "next/server";
// import dbConnect from "@/";
import Inventory from "@/models/inventoryModel";
import { connect } from "@/dbConfig/dbConfig";

// GET: Fetch all inventory
export async function GET() {
  try {
    await connect();
    const stock = await Inventory.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: stock }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// POST: Add new blood unit
export async function POST(request: Request) {
  try {
    await connect();
    const body = await request.json();
    const newEntry = await Inventory.create(body);
    return NextResponse.json(
      { success: true, data: newEntry },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE: Remove a unit (Handled via a dynamic route /api/admin/inventory/[id])
