import connectMongoDB from "@/libs/mongodb";
import Escrow from "@/models/escrow";
import { NextResponse } from "next/server";

await connectMongoDB();

export async function POST(request) {
    try {
        const { account, destination, amount, sequence, condition, fulfillment, cancelAfter, status, escrowTx } = await request.json();
        const escrow = await Escrow.create({ account, destination, amount, sequence, condition, fulfillment, cancelAfter, status, escrowTx });
        return NextResponse.json({ message: "Escrow Created", id: escrow._id }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const escrows = await Escrow.find();
        return NextResponse.json({ escrows }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
