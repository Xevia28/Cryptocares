// This is where the admin reviews over the details and proof of projects and services, and decide whether or not to confirm the creation request.

"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";

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

const CampaingDetail = ({ params }) => {
    const id = params.id;
    const router = useRouter();
    const [project, setProject] = useState("")
    const [service, setService] = useState("")
    const [proof, setProof] = useState("");
    const [loading, setLoading] = useState(true)

    async function getData() {
        const proofs = await axios.get("/api/proofs");
        const ls = id.split("%20")
        let prj;
        let service;
        let yourProof;
        if (ls[0] === "p") {
            prj = await axios.get(`/api/projects/${ls[1]}`)
            yourProof = proofs.data.proofs.find((proof) => proof.proj_id === ls[1]);
            setProject(prj.data.project)
        } else {
            service = await axios.get(`/api/services/${ls[1]}`)
            yourProof = proofs.data.proofs.find((proof) => proof.service_id === ls[1]);
            setService(service.data.service)
        }
        setProof(yourProof)
        setLoading(false)
    }

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function getDate(dateString) {
        let date = new Date(dateString);
        let day = date.getDate();
        let month = date.toLocaleString('default', { month: 'long' });
        let year = date.getFullYear();
        let formattedDate = `${day} ${month} ${year}`;
        return (formattedDate);
    }

    async function activatePrj(id) {
        try {
            toast.info("Processing. Please be patient...", toastOption)
            const res = await axios.put(`/api/projects/${id}`, { status: "approved" });
            if (res.status === 200) {
                toast.info("Project activated. Sending Mail to User. Do not click anywhere", toastOption)
                const project = await axios.get(`/api/projects/${id}`);
                const user = await axios.get(`/api/users/${project.data.project.beneficiary}`);
                const mailRes = await axios.post("/api/sendMail", {
                    to: user.data.user.email,
                    subject: "Your Project Has Been Approved",
                    message: "We are excited to inform you that your project request has been approved! Your initiative has been recognized, and you are now ready to begin receiving the necessary support and funds to bring your project to life."
                })
                if (mailRes.status === 200) {
                    toast.success("Success", toastOption)
                    setTimeout(() => {
                        router.push("/admin/campaigns")
                    }, 1000)
                }
            }
        } catch (err) {
            console.log(err)
            toast.error("Project activation failed", toastOption)
        }
    }

    async function activateService(id) {
        try {
            toast.info("Processing. Please be patient...", toastOption)
            const res = await axios.put(`/api/services/${id}`, { status: "approved" });
            if (res.status === 200) {
                toast.info("Service activated. Sending Mail to User. Do not click anywhere", toastOption)
                const service = await axios.get(`/api/services/${id}`);
                const user = await axios.get(`/api/users/${service.data.service.provider}`);
                const mailRes = await axios.post("/api/sendMail", {
                    to: user.data.user.email,
                    subject: "Your Service Request Has Been Approved",
                    message: "We are delighted to share the news that your service request has been approved! Your commitment to providing support to our beneficiaries is both appreciated and commendable. Your services will make a meaningful difference in the lives of those we serve."
                })
                if (mailRes.status === 200) {
                    toast.success("Success", toastOption)
                    setTimeout(() => {
                        router.push("/admin/campaigns")
                    }, 1000)
                }
            }
        } catch (err) {
            console.log(err)
            toast.error("Service activation failed", toastOption)
        }
    }

    return (
        <div className="h-[100vh] w-full bg-whitish overflow-y-auto">
            <ToastContainer />
            {loading ? <div className="flex justify-center items-center h-full w-full">
                <div className="loader"></div>
            </div> :
                project ? <div className="w-full p-10 px-6 text-veryDarkGreenish flex sm:flex-row flex-wrap gap-x-6" >
                    <div className="w-full bg-adminsideNavColor rounded-sm h-[70px] border-b-4 border-orangeish text-whitish flex items-center px-[17px] text-xl font-bold">
                        Project
                    </div>
                    <div className="w-full bg-adminsideNavColor text-whitish">
                        <table className="w-full table ">
                            <thead className="border-separate border-spacing-4 font-bold">
                                <tr>
                                    <td className="p-4">Project Name</td>
                                    <td className="p-4">Target Amount</td>
                                </tr>
                            </thead>
                            <tbody className="font-light">
                                <tr className="p-4 ">
                                    <td className="p-4">{project.name}</td>
                                    <td className="p-4">{project.targetAmount} XRP</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div className="bg-adminsideNavColor text-whitish  pt-4 w-full">
                        <div className="text-1xl font-semibold my-2 px-[17px]">
                            Project Details
                        </div>
                        <div className="text-md">
                            <table className="w-full table ">
                                <thead className="border-separate border-spacing-4 text-md">
                                    <tr>
                                        <td className="p-4">Start Date: {getDate(project.start_date)}</td>
                                        <td className="p-4">End Date: {getDate(project.end_date)}</td>
                                        <td className="p-4">Location: {project.location}</td>
                                    </tr>
                                </thead>
                            </table>
                            <h5 className="px-[17px] font-semibold my-4">Project Description:</h5>
                            {project.description.split('\n').map((paragraphText, index) => (
                                <p key={index} className="px-[17px] text-justify my-3">
                                    {paragraphText}
                                </p>
                            ))}

                            <div className="px-[17px] mb-2">
                                <Image src={proof.photo} alt="logo" width={1000} height={1000} className="relative top-0 left-0 h-[350px] w-[250px] object-cover" />
                            </div>

                            {project.status === "pending" &&
                                <div className="px-[17px] flex gap-2 gap-x-12 text-md my-6">
                                    <button className="p-2 bg-darkGreenish rounded w-[100px]" onClick={() => activatePrj(project._id)}>Approve</button>
                                </div>
                            }
                        </div>
                    </div>
                </div> : service && <div className="w-full p-10 px-6 text-veryDarkGreenish flex sm:flex-row flex-wrap gap-x-6" >
                    <div className="w-full bg-adminsideNavColor rounded-sm h-[70px] border-b-4 border-orangeish text-whitish flex items-center px-[17px] text-xl font-bold">
                        Service
                    </div>
                    <div className="w-full bg-adminsideNavColor text-whitish">
                        <table className="w-full table ">
                            <thead className="border-separate border-spacing-4 font-bold">
                                <tr>
                                    <td className="p-4">Service Name</td>
                                    <td className="p-4">Price per day of service</td>
                                    <td className="p-4">Location</td>
                                </tr>
                            </thead>
                            <tbody className="font-light">
                                <tr className="p-4 ">
                                    <td className="p-4">{service.name}</td>
                                    <td className="p-4">{service.pricePerDay} XRP</td>
                                    <td className="p-4">{service.location}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div className="bg-adminsideNavColor text-whitish  pt-4 w-full">
                        <div className="text-md">
                            <h5 className="px-[17px] font-semibold my-4">Service Description:</h5>
                            {service.description.split('\n').map((paragraphText, index) => (
                                <p key={index} className="px-[17px] text-justify my-3">
                                    {paragraphText}
                                </p>
                            ))}

                            <div className="px-[17px] mb-2">
                                <Image src={proof.photo} alt="logo" width={1000} height={1000} className="relative top-0 left-0 h-[350px] w-[250px] object-cover" />
                            </div>

                            {service.status === "pending" &&
                                <div className="px-[17px] flex gap-2 gap-x-12 text-md my-6">
                                    <button className="p-2 bg-darkGreenish rounded w-[100px]" onClick={() => activateService(service._id)}>Approve</button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default CampaingDetail;
