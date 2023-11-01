import connectMongoDB from "@/libs/mongodb";
import Transaction from "@/models/transaction";
import { NextResponse } from "next/server";
await connectMongoDB();

export async function POST(request) {
    try {
        const { transaction_hash, amount, from, to } = await request.json();
        await Transaction.create({ transaction_hash, amount, from, to });
        return NextResponse.json({ message: "Transaction Recorded" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const transactions = await Transaction.find();
        return NextResponse.json({ transactions }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
