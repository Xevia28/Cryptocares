// This page is to view the proof of eligibility of beneficiaries and provider. The admin will review the proof and decide whether or not
// to approve the user to use the platform

"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
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

const UserDetail = ({ params }) => {
    const userID = params.id;
    const router = useRouter();
    const [user, setUser] = useState("");
    const [proof, setProof] = useState("");
    const [loading, setLoading] = useState(true);

    async function getUserDetails() {
        try {
            const user = await axios.get(`/api/users/${userID}`);
            const proofs = await axios.get("/api/proofs");
            const yourProof = proofs.data.proofs.find((proof) => proof.user_id === userID);
            setProof(yourProof)
            setUser(user.data.user)
            setLoading(false)
        } catch (err) {
            console.log(err)
            toast.error("Error fetching data", toastOption)
        }
    }

    useEffect(() => {
        getUserDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function activate(id) {
        try {
            toast.info("Processing. Please be patient...", toastOption)
            const res = await axios.put(`/api/users/${id}`, { is_active: true });
            if (res.status === 200) {
                toast.info("User activated. Sending mail to user", toastOption)
                const user = await axios.get(`/api/users/${id}`);
                const mailRes = await axios.post("/api/sendMail", {
                    to: user.data.user.email,
                    subject: "Account Status Update: Your Account Has Been Activated",
                    message: "We are pleased to inform you that your account has been activated."
                })
                if (mailRes.status === 200) {
                    toast.success("Success.", toastOption)
                    setTimeout(() => {
                        router.push("/admin/users")
                    }, 1000)
                }
            }
        } catch (err) {
            console.log(err)
            toast.error("User activation failed", toastOption)
        }
    }

    return (
        <div className="h-[100vh] w-full bg-whitish overflow-y-auto">
            <ToastContainer />
            {!loading ?
                <div className="w-full p-10 px-6 text-veryDarkGreenish flex sm:flex-row flex-wrap gap-x-6 " >
                    <div className="w-full bg-adminsideNavColor rounded-sm h-[70px] border-b-4 border-orangeish text-whitish flex items-center px-[17px] text-1xl font-bold">
                        Beneficiaries
                    </div>
                    <div className="w-full bg-adminsideNavColor text-whitish">
                        <table className="w-full table ">
                            <thead className="border-separate border-spacing-4 font-bold">
                                <tr>
                                    <td className="p-4">Name</td>
                                    <td className="p-4">Email</td>
                                    <td className="p-4">Status</td>
                                </tr>
                            </thead>
                            <tbody className="font-light">
                                <tr className="p-4 ">
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">{user.is_active ? "Active" : "Not Active"}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div className="bg-adminsideNavColor text-whitish  pt-4 w-full">
                        <div className="px-[17px]">
                            <h1 className="font-bold mb-4">Proof of eligibility:</h1>
                            <Image src={proof.photo} alt="logo" width={1000} height={1000} className="relative top-0 left-0 h-[350px] w-[250px] object-cover" />
                        </div>
                        <div className="px-[17px] flex gap-2 gap-x-12 text-md my-6">
                            <button className="p-2 bg-darkGreenish rounded w-[100px]" onClick={() => activate(userID)}>Approve</button>
                        </div>
                    </div>
                </div> :
                <div className="flex justify-center items-center h-full w-full">
                    <div className="loader"></div>
                </div>
            }

        </div >);
};

export default UserDetail;
