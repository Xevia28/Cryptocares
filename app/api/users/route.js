import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { name, email, password, wallet_addr } = await request.json();
        connectMongoDB();
        await User.create({ name, email, password, wallet_addr });
        return NextResponse.json({ message: "User Created" }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        connectMongoDB();
        const users = await User.find();
        return NextResponse.json({ users }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
