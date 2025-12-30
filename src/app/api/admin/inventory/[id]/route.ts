import { NextResponse } from "next/server";
import Inventory from "@/models/inventoryModel";
import { connect } from "@/dbConfig/dbConfig";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Change to Promise
) {
  try {
    await connect();
    const body = await request.json();
    const { id } = await params; // 2. Await the params

    const updatedUnit = await Inventory.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedUnit) {
      return NextResponse.json(
        { success: false, message: "Unit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedUnit },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// 2. DELETE: Remove unit from vault
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;

    const deletedItem = await Inventory.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json(
        { success: false, message: "Record already removed" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Stock purged successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
