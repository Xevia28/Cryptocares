import connectMongoDB from "@/libs/mongodb";
import Request from "@/models/request";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { service, project, amount } = await request.json();
        connectMongoDB();
        await Request.create({ service, project, amount });
        return NextResponse.json({ message: "Request Created" }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        connectMongoDB();
        const requests = await Request.find();
        return NextResponse.json({ requests }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
