"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
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

const Services = () => {
    const router = useRouter();
    const [services, setServices] = useState("");
    const [Loading, setLoading] = useState(true);

    async function handleGetServices() {
        try {
            const token = await axios.get("/api/users/token");
            const user_id = token.data.decodedToken.id;
            const user = await axios.get("/api/users/" + user_id);
            let services = []
            await Promise.all(
                user.data.user.services.map(async (service) => {
                    const response = await axios.get(`/api/services/${service}`);
                    services.push(response.data.service);
                })
            );
            setServices(services)
            setLoading(false);
        } catch (err) {
            console.log(err)
            toast.error(err, toastOption)
        }
    }

    useEffect(() => {
        handleGetServices()
    }, [])

    return (
        <>
            <ToastContainer />
            <div className="min-h-screen mx-36 py-6">
                <h1 className="text-2xl font-semibold mt-6">My Services</h1>
                <div className="my-6 flex flex-wrap gap-10">
                    {!Loading ? (
                        services.length === 0 ? (
                            <div>
                                <h1 className="text-xl font-medium">No Services Available</h1>
                            </div>
                        ) : (
                            services.map((service, index) => (
                                <div key={index} className="flex flex-col gap-2 w-96 bg-whitish text-dark rounded">
                                    <div key={index} className="flex flex-col gap-2 w-96 bg-whitish text-dark rounded">
                                        <div className="flex gap-3 mt-2 px-6 items-center">
                                            <div>
                                                <h3 className="font-bold text-sm">{service.name}</h3>
                                                <h5 className="font-medium text-xs text-gray-500">{service.status === "approved" ? "In progress" : service.status === "completed" ? "Completed" : "Pending Approval"}</h5>
                                            </div>
                                        </div>
                                        <Image className="w-full h-96 object-cover" src={service.photo} width={1200} height={1200} alt="Loading Image..." />
                                        <div className="pt-2 pb-6 px-6 flex flex-col gap-3">
                                            <p className="text-sm">{service.description.slice(0, 125)}...</p>
                                            <button className="p-3 bg-darkGreenish rounded text-whitish" onClick={() => router.push(`/provider/myservices/${service._id}`)}>View</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    ) :
                        <div className="flex justify-center items-center h-96 w-full">
                            <div className="loader"></div>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default Services;
