import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service";
import { NextResponse } from "next/server";
await connectMongoDB();

export async function POST(request) {
    try {
        const { name, description, location, photo, pricePerDay, provider } = await request.json();
        const service = await Service.create({ name, description, location, photo, pricePerDay, provider });
        return NextResponse.json({ message: "Service Created", id: service._id }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const services = await Service.find();
        return NextResponse.json({ services }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
