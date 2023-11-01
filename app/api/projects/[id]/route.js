import connectMongoDB from "@/libs/mongodb";
import Project from "@/models/project";
import { NextResponse } from "next/server";
await connectMongoDB();

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { name, description, wallet_addr, seed, targetAmount, photo, location, end_date, beneficiary, amountRaised, status, donors, serviceRequests } = await request.json();
        await Project.findByIdAndUpdate(id, { name, description, wallet_addr, seed, targetAmount, photo, location, end_date, beneficiary, amountRaised, status, donors, serviceRequests }, { runValidators: true });
        return NextResponse.json({ message: "Project updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const project = await Project.findOne({ _id: id });
        return NextResponse.json({ project }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await Project.findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Project deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}