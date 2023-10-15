import connectMongoDB from "@/libs/mongodb";
import Project from "@/models/project";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { name, description, wallet_addr, targetAmount, photo, location, end_date, beneficiary, amountRaised, status, donors } = await request.json();
        connectMongoDB();
        await Project.findByIdAndUpdate(id, { name, description, wallet_addr, targetAmount, photo, location, end_date, beneficiary, amountRaised, status, donors }, { runValidators: true });
        return NextResponse.json({ message: "Project updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        connectMongoDB();
        const project = await Project.findOne({ _id: id });
        return NextResponse.json({ project }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        connectMongoDB();
        await Project.findOneAndDelete({ _id: id });
        return NextResponse.json({ message: "Project deleted" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}