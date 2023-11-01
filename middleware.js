import { NextResponse } from "next/server";
import jwt_decode from "jwt-decode";
export default function middleware(request) {
    const url = request.nextUrl.pathname;

    let donorVerify = false;
    let beneVerify = false;
    let provVerify = false;
    let adminVerify = false;

    if (request.cookies.get("token")) {
        if (url === "/logout") {
            return NextResponse.next();
        }
        const token = request.cookies.get("token").value;
        const decodedToken = jwt_decode(token);
        (decodedToken.role === "donor" ? donorVerify = true : (decodedToken.role === "beneficiary" ? beneVerify = true : (decodedToken.role === "provider" ? provVerify = true : adminVerify = true)))
    } else {
        if (url === "/logout") {
            return NextResponse.redirect("http://localhost:3000/restricted");
        }
    }


    const donorReg = /\/donor/i;
    const beneReg = /\/beneficiary/i;
    const provReg = /\/provider/i;
    const adminReg = /\/admin/i;


    if (url === "/signup/beneficiary" || url === "/signup/provider") {
        return NextResponse.next();
    }

    if (donorVerify === false && donorReg.test(url)) {
        return NextResponse.redirect("http://localhost:3000/restricted");
    }
    if (donorVerify === true && donorReg.test(url)) {
        return NextResponse.next();
    }

    if (beneVerify === false && beneReg.test(url)) {
        return NextResponse.redirect("http://localhost:3000/restricted");
    }
    if (beneVerify === true && beneReg.test(url)) {
        return NextResponse.next();
    }

    if (provVerify === false && provReg.test(url)) {
        return NextResponse.redirect("http://localhost:3000/restricted");
    }
    if (provVerify === true && provReg.test(url)) {
        return NextResponse.next();
    }

    if (adminVerify === false && adminReg.test(url)) {
        return NextResponse.redirect("http://localhost:3000/restricted");
    }
    if (adminVerify === true && adminReg.test(url)) {
        return NextResponse.next();
    }

    const nonUserRoutes = ["/", "/explore", "/about", "/login", "/signup"];
    if (donorVerify === true || beneVerify === true || provVerify === true) {
        if (nonUserRoutes.includes(url)) {
            return NextResponse.redirect("http://localhost:3000/restricted");
        }
    }

    return NextResponse.next();
}
