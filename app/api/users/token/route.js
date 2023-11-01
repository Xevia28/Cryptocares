import { NextResponse } from "next/server";
import jwt_decode from "jwt-decode";

export async function GET(request) {
    const { cookies } = request;
    const jwt = cookies._parsed.get("token").value;
    // console.log(cookies._parsed.get("token").value)
    if (!jwt) {
        return NextResponse.json({ message: "Invalid Token" })
    }
    const decodedToken = jwt_decode(jwt);
    return NextResponse.json({ decodedToken })

}