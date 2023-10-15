import connectMongoDB from "@/libs/mongodb";
import Donation from "@/models/donation";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { transaction_hash, amount, donor, project } = await request.json();
        connectMongoDB();
        await Donation.findByIdAndUpdate(id, { transaction_hash, amount, donor, project }, { runValidators: true });
        return NextResponse.json({ message: "Donation updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        connectMongoDB();
        const donation = await Donation.findOne({ _id: id });
        return NextResponse.json({ donation }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        connectMongoDB();
        await Donation.findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Donation deleted" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}