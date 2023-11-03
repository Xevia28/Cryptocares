// This page displays all the project and service creation requests.

"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Campaigns = () => {
    const router = useRouter();
    const [projects, setProjects] = useState("");
    const [services, setServices] = useState("");
    const [loading, setLoading] = useState(true);

    async function handleData() {
        const projects = await axios.get("/api/projects");
        const services = await axios.get("/api/services");
        setProjects(projects.data.projects);
        setServices(services.data.services);
        setLoading(false)
    }

    useEffect(() => {
        handleData()
    }, [])

    return (
        <div className="h-[100vh] w-full bg-whitish overflow-y-auto">
            {loading ?
                <div className="flex justify-center items-center h-full w-full">
                    <div className="loader"></div>
                </div> :
                <>
                    <div className="w-full p-10 px-6 text-veryDarkGreenish flex sm:flex-row flex-wrap gap-x-6 " >
                        <div className="w-full bg-adminsideNavColor rounded-sm h-[70px] border-b-4 border-orangeish text-whitish flex items-center px-[17px] text-xl font-bold">
                            Projects
                        </div>
                        <div className="w-full bg-adminsideNavColor text-whitish">
                            <table className="w-full table font-light">
                                <thead className="font-medium border-separate border-spacing-4 border border-white-500">
                                    <tr>
                                        <td className="p-4">Beneficiary Name</td>
                                        <td className="p-4">Project Name</td>
                                        <td className="p-4">Status</td>
                                        <td className="p-4">Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.length === 0 ?
                                        <tr className="p-4">
                                            <td className="p-4">No projects available</td>
                                        </tr> :
                                        Promise.all(
                                            projects.map(async (project, index) => {
                                                const bene = await axios.get(`/api/users/${project.beneficiary}`)
                                                return <tr key={index} className="p-4">
                                                    <td className="p-4 opacity-75">{bene.data.user.name}</td>
                                                    <td className="p-4 opacity-75">{project.name}</td>
                                                    <td className="p-4 opacity-75">{project.status === "pending" ? "Pending" : "Approved"}</td>
                                                    <td className="p-4">
                                                        <button className="py-2 px-5 bg-darkGreenish font-medium rounded" onClick={() => router.push(`/admin/campaigns/p ${project._id}`)}>View</button>
                                                    </td>
                                                </tr>
                                            })
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="w-full p-10 px-6 text-veryDarkGreenish flex sm:flex-row flex-wrap gap-x-6 " >
                        <div className="w-full bg-adminsideNavColor rounded-sm h-[70px] border-b-4 border-orangeish text-whitish flex items-center px-[17px] text-xl font-bold">
                            Services
                        </div>
                        <div className="w-full bg-adminsideNavColor text-whitish">
                            <table className="w-full table font-light">
                                <thead className="font-medium border-separate border-spacing-4 border border-white-500">
                                    <tr>
                                        <td className="p-4">Provider Name</td>
                                        <td className="p-4">Service Name</td>
                                        <td className="p-4">Status</td>
                                        <td className="p-4">Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.length === 0 ?
                                        <tr className="p-4">
                                            <td className="p-4">No services available</td>
                                        </tr> :
                                        Promise.all(
                                            services.map(async (service, index) => {
                                                const prov = await axios.get(`/api/users/${service.provider}`)
                                                return <tr key={index} className="p-4">
                                                    <td className="p-4 opacity-75">{prov.data.user.name}</td>
                                                    <td className="p-4 opacity-75">{service.name}</td>
                                                    <td className="p-4 opacity-75">{service.status === "pending" ? "Pending" : "Approved"}</td>
                                                    <td className="p-4">
                                                        <button className="py-2 px-5 bg-darkGreenish font-medium rounded" onClick={() => router.push(`/admin/campaigns/s ${service._id}`)}>View</button>
                                                    </td>
                                                </tr>
                                            })
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </>}

        </div>);
};

export default Campaigns;
