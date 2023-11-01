import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

await connectMongoDB();
export async function POST(request) {
    try {
        const { name, email, password, wallet_addr, role, is_active } = await request.json();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }
        const user = await User.create({ name, email, password, wallet_addr, role, is_active });
        return NextResponse.json({ message: "User Created", id: user._id }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const users = await User.find();
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
