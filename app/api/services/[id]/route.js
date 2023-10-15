import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { name, description, location, photo, pricePerDay, provider, status, projects } = await request.json();
        connectMongoDB();
        await Service.findByIdAndUpdate(id, { name, description, location, photo, pricePerDay, provider, status, projects }, { runValidators: true });
        return NextResponse.json({ message: "Service updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        connectMongoDB();
        const service = await Service.findOne({ _id: id });
        return NextResponse.json({ service }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        connectMongoDB();
        await Service.findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Service deleted" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}