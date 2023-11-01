import connectMongoDB from "@/libs/mongodb";
import Proof from "@/models/proof";
import { NextResponse } from "next/server";
await connectMongoDB();

export async function POST(request) {
    try {
        const { photo, user_id, proj_id, service_id } = await request.json();
        await Proof.create({ photo, user_id, proj_id, service_id });
        return NextResponse.json({ message: "Proof Created" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const proofs = await Proof.find();
        return NextResponse.json({ proofs }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
