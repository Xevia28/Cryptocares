import connectMongoDB from "@/libs/mongodb";
import { NextResponse } from "next/server";
import cookie from "cookie";
await connectMongoDB();

export async function POST(request) {
    try {
        const response = NextResponse.json({ message: "Logout Successful", success: true }, { status: 200 })
        response.headers.append(
            "Set-Cookie",
            cookie.serialize("token", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                expires: new Date(0),
                sameSite: "strict",
                path: "/"
            })
        )
        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
