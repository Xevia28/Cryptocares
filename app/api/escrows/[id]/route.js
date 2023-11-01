import connectMongoDB from "@/libs/mongodb";
import Escrow from "@/models/escrow";
import { NextResponse } from "next/server";

await connectMongoDB();

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { account, destination, amount, sequence, condition, fulfillment, cancelAfter, status, escrowTx } = await request.json();
        await Escrow.findByIdAndUpdate(id, { account, destination, amount, sequence, condition, fulfillment, cancelAfter, status, escrowTx }, { runValidators: true });
        return NextResponse.json({ message: "Escrow updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const escrow = await Escrow.findOne({ _id: id });
        return NextResponse.json({ escrow }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await Escrow.findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Escrow deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}