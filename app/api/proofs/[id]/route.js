import connectMongoDB from "@/libs/mongodb";
import Proof from "@/models/proof";
import { NextResponse } from "next/server";

await connectMongoDB();

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { photo, user_id, proj_id, service_id } = await request.json();
        await Proof.findByIdAndUpdate(id, { photo, user_id, proj_id, service_id }, { runValidators: true });
        return NextResponse.json({ message: "Proof updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const proof = await Proof.findOne({ _id: id });
        return NextResponse.json({ proof }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await Proof.findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Proof deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}