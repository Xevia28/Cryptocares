import connectMongoDB from "@/libs/mongodb";
import Transaction from "@/models/transaction";
import { NextResponse } from "next/server";
await connectMongoDB();

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { transaction_hash, amount, from, to } = await request.json();
        await Transaction.findByIdAndUpdate(id, { transaction_hash, amount, from, to }, { runValidators: true });
        return NextResponse.json({ message: "Transaction updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const transaction = await Transaction.findOne({ _id: id });
        return NextResponse.json({ transaction }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await Transaction.findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Transaction deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}