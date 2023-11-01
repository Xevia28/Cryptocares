import connectMongoDB from "@/libs/mongodb";
import Project from "@/models/project";
import { NextResponse } from "next/server";

await connectMongoDB();

export async function POST(request) {
    try {
        const { name, description, wallet_addr, seed, targetAmount, photo, location, end_date, beneficiary } = await request.json();
        const project = await Project.create({ name, description, wallet_addr, seed, targetAmount, photo, location, end_date, beneficiary });
        return NextResponse.json({ message: "Project Created", id: project._id }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const projects = await Project.find();
        return NextResponse.json({ projects }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
