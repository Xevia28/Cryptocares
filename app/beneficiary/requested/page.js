// This page displays all the requests made to the providers by the beneficiary

"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const ServicesRequested = () => {
    const router = useRouter();
    const [requests, setRequests] = useState("")
    const [project, setProject] = useState("")
    const [hasProject, setHasProject] = useState("loading")

    async function handleRequestsDetails() {
        try {
            const token = await axios.get("/api/users/token"); // getting the decoded token details from the cookies
            const user_id = token.data.decodedToken.id;
            const user = await axios.get("/api/users/" + user_id); // getting the details of the logged in user
            if (user.data.user.projects.length === 0) {
                setHasProject("false")
                return;
            }
            const project = await axios.get(`/api/projects/${user.data.user.projects[user.data.user.projects.length - 1]}`)
            setProject(project.data.project)
            if (project.data.project.status !== "approved") {
                setHasProject("false");
                return;
            }
            const reqRes = await axios.get("/api/requests");
            let prjRequests = []
            for (const res of reqRes.data.requests) {
                if (res.project === project.data.project._id) {
                    prjRequests.push(res)
                }
            }
            setRequests(prjRequests)
            setHasProject("loaded")
        } catch (err) {
            console.log(err)
            toast.error(err, toastOption)
        }
    }

    useEffect(() => {
        handleRequestsDetails();
    }, [])
    return (
        <>
            <div className="min-h-screen mx-36 py-10">
                <h1 className="text-2xl font-bold my-4">Services Requested</h1>
                {hasProject === "loaded" ?
                    (requests ?
                        (<div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Service
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Provider
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
                                            const provider = await axios.get(`/api/users/${service.data.service.provider}`)
                                            return (
                                                <tr key={key} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                    <td className="px-6 py-4">
                                                        {service.data.service.name}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {provider.data.user.name}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {request.amount} XRP
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {project.name}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {request.status === "pending" ? "Pending Approval" : request.status === "approved" ? "Approved" : request.status === "completed" ? "Completed" : "Rejected"}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button onClick={() => router.push(`/beneficiary/requested/${request._id}`)} className="p-2 bg-darkGreenish text-white rounded">View</button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ))}
                                </tbody>
                            </table>
                        </div>) : <div className="flex justify-center items-center h-96 w-full">
                            <div className="loader"></div>
                        </div>) : hasProject === "loading" ? <div className="flex justify-center items-center h-custom w-full">
                            <div className="loader"></div>
                        </div> : <div className="min-h-screen mx-36 py-10">
                        <h1 className="text-2xl text-gray-400 font-medium">
                            You do not have any active projects!
                        </h1>
                    </div>
                }
            </div>
        </>
    );
}

export default ServicesRequested;