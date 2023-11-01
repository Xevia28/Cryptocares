"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const ServiceRequests = () => {
    const router = useRouter();
    const [requests, setRequests] = useState("")
    const [project, setProject] = useState("")

    async function handleRequestsDetails() {
        try {
            const token = await axios.get("/api/users/token");
            const user_id = token.data.decodedToken.id;
            const user = await axios.get("/api/users/" + user_id);
            const provServices = user.data.user.services;
            const reqRes = await axios.get("/api/requests");
            let prjRequests = []
            for (const res of reqRes.data.requests) {
                if (provServices.includes(res.service)) {
                    prjRequests.push(res);
                }

            }
            setRequests(prjRequests)
        } catch (err) {
            console.log(err)
            alert("ERROR! Check console")
        }
    }

    useEffect(() => {
        handleRequestsDetails();
    }, [])
    return (
        <>
            <div className="min-h-screen mx-36 py-10">
                <h1 className="text-2xl font-bold my-4">Service Requests</h1>
                {requests ?
                    (<div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Service
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Project
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests && (requests.length === 0 ? <tr><td className="pt-5 text-2xl">You have not made any requests</td></tr> : Promise.all(
                                    requests.map(async (request, key) => {
                                        const service = await axios.get(`/api/services/${request.service}`);
                                        const project = await axios.get(`/api/projects/${request.project}`);
                                        return (
                                            <tr key={key} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <td className="px-6 py-4">
                                                    {service.data.service.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {request.amount} XRP
                                                </td>
                                                <td className="px-6 py-4">
                                                    {project.data.project.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {request.status === "pending" ? "Pending Approval" : request.status === "approved" ? "Approved" : request.status === "completed" ? "Completed" : "Rejected"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button onClick={() => router.push(`/provider/requests/${request._id}`)} className="p-2 bg-darkGreenish text-white rounded">View</button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ))}
                            </tbody>
                        </table>
                    </div>) : <div className="flex justify-center items-center h-96 w-full">
                        <div className="loader"></div>
                    </div>
                }
            </div >
        </>
    );
}

export default ServiceRequests;