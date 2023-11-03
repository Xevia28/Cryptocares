// Side Navigation of Admins Pages

"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// customized options to style the toast
const toastOption = {
    position: "top-right",
    autoClose: 8000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "colored"
};

const SideNav = () => {
    const router = useRouter();
    async function handleLogout() {
        try {
            toast.info("Logging out", toastOption);
            const logout = await axios.post("/api/users/logout");
            if (logout.status === 200) {
                toast.success("Logout successful", toastOption);
                setTimeout(() => { router.push("/admlogin") }, 1000)
                return;
            }
        } catch (err) {
            toast.error(err.message, toastOption);
            console.log(err);
        }
    }

    async function handleUserDetails() {
        try {
            const token = await axios.get("/api/users/token"); // getting the decoded token details from the cookies
            const user_id = token.data.decodedToken.id;
            console.log(user_id)
        } catch (err) {
            console.log(err)
            toast.error("You have to log in again!", {
                position: "top-right",
                autoClose: 10000,
                hideProgressBar: false,
                newestOnTop: true,
                closeOnClick: true,
                rtl: false,
                pauseOnFocusLoss: true,
                draggable: true,
                pauseOnHover: true,
                theme: "colored"
            })
        }
    }

    useEffect(() => {
        handleUserDetails();
    }, [])

    return (
        <div>
            <ToastContainer />
            <div className="h-[100vh] w-[250px] bg-adminsideNavColor flex flex-col items-center  gap-y-6">
                <Image src={'/logo-white.png'} alt="logo" width={100} height={100} className="relative top-0 left-0 h-[150px] w-[150px] object-contain bg-no-repeat" />
                <div className="h-[2px] bg-[#4F4F4F] w-[200px] mx-10"></div>
                <Link href={"/admin"} className="w-full">
                    <div className="w-full hover:bg-whitish hover:text-veryDarkGreenish px-10 py-2 rounded ">
                        Dashboard
                    </div>
                </Link>
                <Link href={"/admin/campaigns"} className="w-full">
                    <div className="w-full hover:bg-whitish hover:text-veryDarkGreenish px-10 py-2 rounded ">
                        Campaigns
                    </div>
                </Link>
                <Link href={"/admin/users"} className="w-full">
                    <div className="w-full hover:bg-whitish hover:text-veryDarkGreenish px-10 py-2 rounded ">
                        Users
                    </div>
                </Link>
                <div onClick={() => handleLogout()} className="w-full hover:bg-whitish hover:text-veryDarkGreenish hover:cursor-pointer px-10 py-2 rounded ">
                    Logout
                </div>
            </div>
        </div>
    );
};

export default SideNav;
