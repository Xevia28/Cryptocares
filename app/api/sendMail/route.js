import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
    try {
        const { subject, message, to } = await request.json();
        const transporter = nodemailer.createTransport({
            service: "zoho",
            host: "smtpro.zoho.in",
            port: 465,
            secure: true,
            auth: {
                user: "xeviabcd28@zohomail.com",
                pass: `QP3PyUn$=5bi"DN`
            }
        })
        const details = {
            from: "xeviabcd28@zohomail.com",
            to: to,
            subject: subject,
            text: message
        }
        await transporter.sendMail(details)
        return NextResponse.json({ message: "Email sent successfully" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
