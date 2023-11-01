import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
await connectMongoDB();

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) return NextResponse.json({ error: "Please provide email and password" }, { status: 500 });
        const user = await User.findOne({ email }).select("+password")
        if (!user) return NextResponse.json({ error: "Email not registered!" }, { status: 400 })
        if (!user.is_active) return NextResponse.json({ error: "User is not active. Please contact the administrator for assistance." }, { status: 403 });
        const validPassword = await bcryptjs.compare(password, user.password)
        if (!validPassword) return NextResponse.json({ error: "Invalid password" }, { status: 400 })
        const data = { id: user._id, username: user.username, email: user.email, role: user.role, wallet: user.wallet_addr }
        const token = await jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "4h" })
        const response = NextResponse.json({ message: "Login Successful", role: user.role, success: true }, { status: 200 })
        response.headers.append(
            "Set-Cookie",
            cookie.serialize("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: 60 * 60 * 3,
                sameSite: "strict",
                path: "/"
            })
        )
        // response.cookies.set("token", token, { httpOnly: true, sameSite: "lax", secure: false })
        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
