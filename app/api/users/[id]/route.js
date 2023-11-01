import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
await connectMongoDB();

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { name, email, password, wallet_addr, role, is_active, photo, projects, services } = await request.json();
        await User.findByIdAndUpdate(id, { name, email, password, wallet_addr, role, is_active, photo, projects, services }, { runValidators: true });
        return NextResponse.json({ message: "User updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const user = await User.findOne({ _id: id });
        return NextResponse.json({ user }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await connectMongoDB();
        await User.findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "User deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}