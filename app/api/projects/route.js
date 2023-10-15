import connectMongoDB from "@/libs/mongodb";
import Project from "@/models/project";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { name, description, wallet_addr, targetAmount, photo, location, end_date, beneficiary } = await request.json();
        connectMongoDB();
        await Project.create({ name, description, wallet_addr, targetAmount, photo, location, end_date, beneficiary });
        return NextResponse.json({ message: "Project Created" }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        connectMongoDB();
        const projects = await Project.find();
        return NextResponse.json({ projects }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
