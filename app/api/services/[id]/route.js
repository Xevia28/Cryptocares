import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service";
import { NextResponse } from "next/server";
await connectMongoDB();

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { name, description, location, photo, pricePerDay, provider, status, projects } = await request.json();
        await Service.findByIdAndUpdate(id, { name, description, location, photo, pricePerDay, provider, status, projects }, { runValidators: true });
        return NextResponse.json({ message: "Service updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const service = await Service.findOne({ _id: id });
        return NextResponse.json({ service }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await Service.findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Service deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}