import { NextResponse } from "next/server";
import jwt_decode from "jwt-decode";

export async function GET(request) {
    const { cookies } = request;
    const tokenCookie = cookies?._parsed?.get("token");

    if (!tokenCookie) {
        return NextResponse.json({ message: "Invalid Token" });
    }

    const jwt = tokenCookie.value;
    const decodedToken = jwt_decode(jwt);

    return NextResponse.json({ decodedToken });
}