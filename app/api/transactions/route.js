import connectMongoDB from "@/libs/mongodb";
import Transaction from "@/models/transaction";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { transaction_hash, amount, from, to } = await request.json();
        connectMongoDB();
        await Transaction.create({ transaction_hash, amount, from, to });
        return NextResponse.json({ message: "Transaction Recorded" }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        connectMongoDB();
        const transactions = await Transaction.find();
        return NextResponse.json({ transactions }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
