import connectMongoDB from "@/libs/mongodb";
import Escrow from "@/models/escrow";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { account, destination, amount, sequence, transactionType, condition, fulfillment } = await request.json();
        connectMongoDB();
        await Escrow.create({ account, destination, amount, sequence, transactionType, condition, fulfillment });
        return NextResponse.json({ message: "Escrow Created" }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        connectMongoDB();
        const escrows = await Escrow.find();
        return NextResponse.json({ escrows }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
