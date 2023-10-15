import connectMongoDB from "@/libs/mongodb";
import Escrow from "@/models/escrows";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { account, destination, amount, sequence, transactionType, condition, fulfillment } = await request.json();
        connectMongoDB();
        await Escrow.findByIdAndUpdate(id, { account, destination, amount, sequence, transactionType, condition, fulfillment }, { runValidators: true });
        return NextResponse.json({ message: "Escrow updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        connectMongoDB();
        const escrow = await Escrow.findOne({ _id: id });
        return NextResponse.json({ escrow }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        connectMongoDB();
        await Escrow.findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Escrow deleted" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}