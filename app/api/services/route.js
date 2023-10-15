import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { name, description, location, photo, pricePerDay, provider } = await request.json();
        connectMongoDB();
        await Service.create({ name, description, location, photo, pricePerDay, provider });
        return NextResponse.json({ message: "Service Created" }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        connectMongoDB();
        const services = await Service.find();
        return NextResponse.json({ services }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
