"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

const User = () => {
    const router = useRouter();
    const [state, setState] = useState(0);
    const [donors, setDonors] = useState("");
    const [beneficiaries, setBeneficiaries] = useState("");
    const [providers, setProviders] = useState("");
    const [loading, setLoading] = useState(true);

    async function handleData() {
        const users = await axios.get("/api/users");
        let arrDonors = []
        let arrBene = []
        let arrProv = []
        for (const user of users.data.users) {
            if (user.role === "donor") {
                arrDonors.push(user)
            } else if (user.role === "beneficiary") {
                arrBene.push(user)
            } else if (user.role === "provider") {
                arrProv.push(user)
            } else { }
        }
        setDonors(arrDonors)
        setBeneficiaries(arrBene)
        setProviders(arrProv)
        setLoading(false)
    }
    useEffect(() => {
        handleData()
    }, [state])

    async function activate(id) {
        try {
            toast.info("Processing. Please be patient...", toastOption)
            const res = await axios.put(`/api/users/${id}`, { is_active: true });
            if (res.status === 200) {
                toast.info("User activated. Sending Mail to User. Do not click anywhere", toastOption)
                const user = await axios.get(`/api/users/${id}`);
                const mailRes = await axios.post("/api/sendMail", {
                    to: user.data.user.email,
                    subject: "Account Status Update: Your Account Has Been Activated",
                    message: "We are pleased to inform you that your account has been activated."
                })
                if (mailRes.status === 200) {
                    toast.success("Success", toastOption)
                    setState(state + 1);
                }
            }
        } catch (err) {
            console.log(err)
            toast.error("User activation failed", toastOption)
        }
    }

    async function deactivate(id) {
        try {
            toast.info("Processing. Please be patient...", toastOption)
            const res = await axios.put(`/api/users/${id}`, { is_active: false });
            if (res.status === 200) {
                toast.info("User deactivated. Sending Mail to User. Do not click anywhere", toastOption)
                const user = await axios.get(`/api/users/${id}`);
                const mailRes = await axios.post("/api/sendMail", {
                    to: user.data.user.email,
                    subject: "Account Status Update: Your Account Has Been Deactivated",
                    message: "Your account has been deactivated been by the admins."
                })
                if (mailRes.status === 200) {
                    toast.success("Success", toastOption)
                    setState(state + 1);
                }
            }
        } catch (err) {
            console.log(err)
            toast.error("User deactivation failed", toastOption)
        }
    }

    return (
        <div className="h-[100vh] w-full bg-whitish overflow-y-auto">
            <ToastContainer />
            {loading ?
                <div className="flex justify-center items-center h-full w-full">
                    <div className="loader"></div>
                </div> :
                <>
                    <div className="w-full p-10 px-6 text-veryDarkGreenish flex sm:flex-row flex-wrap gap-x-6" >
                        <div className="w-full bg-adminsideNavColor rounded-sm h-[70px] border-b-4 border-orangeish text-whitish flex items-center px-[17px] text-xl font-bold">
                            Donors
                        </div>
                        <div className="w-full bg-adminsideNavColor text-whitish">
                            <table className="w-full table font-light">
                                <thead className="font-medium border-separate border-spacing-4 border border-white-500">
                                    <tr>
                                        <td className="p-4">Name</td>
                                        <td className="p-4">Email</td>
                                        <td className="p-4">Status</td>
                                        <td className="p-4">Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donors.length === 0 ? <tr className="p-4"><td className="p-4">No donors available</td></tr> : donors.map((donor, index) => (
                                        <tr key={index} className="p-4">
                                            <td className="p-4 opacity-75">{donor.name}</td>
                                            <td className="p-4 opacity-75">{donor.email}</td>
                                            <td className="p-4 opacity-75">{donor.is_active ? "Active" : "Not active"}</td>
                                            <td className="p-4">
                                                {donor.is_active ?
                                                    <button className="py-2 px-4 bg-darkGreenish font-medium rounded" onClick={() => deactivate(donor._id)}>Deactivate User</button> :
                                                    <button className="py-2 px-4 bg-darkGreenish font-medium rounded" onClick={() => activate(donor._id)}>Activate User</button>
                                                }

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="w-full p-10 px-6 text-veryDarkGreenish flex sm:flex-row flex-wrap gap-x-6" >
                        <div className="w-full bg-adminsideNavColor rounded-sm h-[70px] border-b-4 border-orangeish text-whitish flex items-center px-[17px] text-xl font-bold">
                            Beneficiaries
                        </div>
                        <div className="w-full bg-adminsideNavColor text-whitish">
                            <table className="w-full table font-light">
                                <thead className="font-medium border-separate border-spacing-4 border border-white-500">
                                    <tr>
                                        <td className="p-4">Name</td>
                                        <td className="p-4">Email</td>
                                        <td className="p-4">Status</td>
                                        <td className="p-4">Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {beneficiaries.length === 0 ? <tr className="p-4"><td className="p-4">No beneficiaries available</td></tr> : beneficiaries.map((beneficiary, index) => (
                                        <tr key={index} className="p-4">
                                            <td className="p-4 opacity-75">{beneficiary.name}</td>
                                            <td className="p-4 opacity-75">{beneficiary.email}</td>
                                            <td className="p-4 opacity-75">{beneficiary.is_active ? "Active" : "Not active"}</td>
                                            <td className="p-4">
                                                {beneficiary.is_active ?
                                                    <button className="py-2 px-5 bg-darkGreenish font-medium rounded" onClick={() => deactivate(beneficiary._id)}>Deactivate User</button> :
                                                    <button className="py-2 px-5 bg-darkGreenish font-medium rounded" onClick={() => router.push(`/admin/users/${beneficiary._id}`)}>View</button>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="w-full p-10 px-6 text-veryDarkGreenish flex sm:flex-row flex-wrap gap-x-6" >
                        <div className="w-full bg-adminsideNavColor rounded-sm h-[70px] border-b-4 border-orangeish text-whitish flex items-center px-[17px] text-xl font-bold">
                            Providers
                        </div>
                        <div className="w-full bg-adminsideNavColor text-whitish">
                            <table className="w-full table font-light">
                                <thead className="font-medium border-separate border-spacing-4 border border-white-500">
                                    <tr>
                                        <td className="p-4">Name</td>
                                        <td className="p-4">Email</td>
                                        <td className="p-4">Status</td>
                                        <td className="p-4">Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {providers.length === 0 ? <tr className="p-4"><td className="p-4">No providers available</td></tr> : providers.map((provider, index) => (
                                        <tr key={index} className="p-4">
                                            <td className="p-4 opacity-75">{provider.name}</td>
                                            <td className="p-4 opacity-75">{provider.email}</td>
                                            <td className="p-4 opacity-75">{provider.is_active ? "Active" : "Not active"}</td>
                                            <td className="p-4">
                                                {provider.is_active ?
                                                    <button className="py-2 px-5 bg-darkGreenish font-medium rounded" onClick={() => deactivate(provider._id)}>Deactivate User</button> :
                                                    <button className="py-2 px-5 bg-darkGreenish font-medium rounded" onClick={() => router.push(`/admin/users/${provider._id}`)}>View</button>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default User;
