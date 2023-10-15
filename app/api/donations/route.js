import connectMongoDB from "@/libs/mongodb";
import Donation from "@/models/donation";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { transaction_hash, amount, donor, project } = await request.json();
        connectMongoDB();
        await Donation.create({ transaction_hash, amount, donor, project });
        return NextResponse.json({ message: "Donation Created" }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        connectMongoDB();
        const donations = await Donation.find();
        return NextResponse.json({ donations }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
