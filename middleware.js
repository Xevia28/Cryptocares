import { NextResponse } from "next/server";
import jwt_decode from "jwt-decode";

export default function middleware(request) {
    const url = request.nextUrl.pathname;

    // these variables are for checking which user (donor, beneficiary, provider, admin) is logged in
    let donorVerify = false;
    let beneVerify = false;
    let provVerify = false;
    let adminVerify = false;

    if (request.cookies.get("token")) { // if there is a user logged in
        if (url === "/logout") {
            return NextResponse.next();
        }
        const token = request.cookies.get("token").value; // getting token value from cookies
        const decodedToken = jwt_decode(token); // decoding the token value
        // and accordingly setting which user has logged in
        (decodedToken.role === "donor" ? donorVerify = true : (decodedToken.role === "beneficiary" ? beneVerify = true : (decodedToken.role === "provider" ? provVerify = true : adminVerify = true)))
    } else {
        if (url === "/logout") {
            return NextResponse.redirect("http://localhost:3000/restricted");
        }
    }

    // conditions for checking whose routes are being accesssed
    const donorReg = /\/donor/i;
    const beneReg = /\/beneficiary/i;
    const provReg = /\/provider/i;
    const adminReg = /\/admin/i;


    if (url === "/signup/beneficiary" || url === "/signup/provider") { // if it's signup route, do not restrict the route 
        return NextResponse.next();
    }

    if (donorVerify === false && donorReg.test(url)) { // if user isn't donor but they try to access a donor route
        return NextResponse.redirect("http://localhost:3000/restricted"); // automatically redirect to the restricted page
    }
    if (donorVerify === true && donorReg.test(url)) {
        return NextResponse.next();
    }

    if (beneVerify === false && beneReg.test(url)) { // if user isn't beneficiary but they try to access a beneficiary route
        return NextResponse.redirect("http://localhost:3000/restricted"); // automatically redirect to the restricted page
    }
    if (beneVerify === true && beneReg.test(url)) {
        return NextResponse.next();
    }

    if (provVerify === false && provReg.test(url)) { // if user isn't provider but they try to access a provider route
        return NextResponse.redirect("http://localhost:3000/restricted"); // automatically redirect to the restricted page
    }
    if (provVerify === true && provReg.test(url)) {
        return NextResponse.next();
    }

    if (adminVerify === false && adminReg.test(url)) { // if user isn't admin but they try to access a admin route
        return NextResponse.redirect("http://localhost:3000/restricted"); // automatically redirect to the restricted page
    }
    if (adminVerify === true && adminReg.test(url)) {
        return NextResponse.next();
    }

    // blocking the non-user routes if user logs in
    const nonUserRoutes = ["/", "/explore", "/about", "/login", "/signup"];
    if (donorVerify === true || beneVerify === true || provVerify === true) {
        if (nonUserRoutes.includes(url)) {
            return NextResponse.redirect("http://localhost:3000/restricted");
        }
    }

    return NextResponse.next();
}
