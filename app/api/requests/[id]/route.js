import connectMongoDB from "@/libs/mongodb";
import Request from "@/models/request";
import { NextResponse } from "next/server";
await connectMongoDB();

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { service, project, status, amount, location, escrow } = await request.json();
        await Request.findByIdAndUpdate(id, { service, project, status, amount, location, escrow }, { runValidators: true });
        return NextResponse.json({ message: "Request updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const request = await Request.findOne({ _id: id });
        return NextResponse.json({ request }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await Request.findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Request deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}