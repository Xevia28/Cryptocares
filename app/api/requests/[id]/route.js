import connectMongoDB from "@/libs/mongodb";
import Request from "@/models/request";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { service, project, status, amount } = await request.json();
        connectMongoDB();
        await Request.findByIdAndUpdate(id, { service, project, status, amount }, { runValidators: true });
        return NextResponse.json({ message: "Request updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        connectMongoDB();
        const request = await Request.findOne({ _id: id });
        return NextResponse.json({ request }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        connectMongoDB();
        await Request.findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Request deleted" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}