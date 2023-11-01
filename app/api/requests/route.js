import connectMongoDB from "@/libs/mongodb";
import Request from "@/models/request";
import { NextResponse } from "next/server";
await connectMongoDB();

export async function POST(request) {
    try {
        const { service, project, amount, location, escrow } = await request.json();
        const req = await Request.create({ service, project, amount, location, escrow });
        return NextResponse.json({ message: "Request Created", id: req._id }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const requests = await Request.find();
        return NextResponse.json({ requests }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
