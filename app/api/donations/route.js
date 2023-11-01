import connectMongoDB from "@/libs/mongodb";
import Donation from "@/models/donation";
import { NextResponse } from "next/server";

await connectMongoDB();

export async function POST(request) {
    try {
        const { transaction_hash, amount, donor, project } = await request.json();
        await Donation.create({ transaction_hash, amount, donor, project });
        return NextResponse.json({ message: "Donation Created" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const donations = await Donation.find();
        return NextResponse.json({ donations }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
