"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
const xrpl = require("xrpl")

const ServiceHistory = ({ params }) => {
    const serviceID = params.id;
    const [service, setService] = useState("");
    const [requests, setRequests] = useState("");
    const [balance, setBalance] = useState("");
    const [loading, setLoading] = useState(true);
    async function getService() {
        try {
            const token = await axios.get("/api/users/token");
            const user_id = token.data.decodedToken.id;
            const user = await axios.get("/api/users/" + user_id);
            const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233', {
                connectionTimeout: 10000,
                requestTimeout: 60000,
            });
            await client.connect();
            const balance = await client.getXrpBalance(user.data.user.wallet_addr)
            setBalance(balance);

            const res = await axios.get(`/api/services/${serviceID}`);
            setService(res.data.service);
            const reqs = await axios.get("/api/requests");
            const txs = await axios.get("/api/transactions");
            let completedRequests = [];
            let serviceTxs = [];
            for (const req of reqs.data.requests) {
                if (req.status === "completed" && req.service === res.data.service._id) {
                    completedRequests.push(req)
                }
            }
            for (const tx of txs.data.transactions) {
                if (tx.to === res.data.service._id) {
                    serviceTxs.push(tx)
                }
            }
            if (completedRequests.length !== serviceTxs.length) {
                // alert("Something is wrong with the data in database! Check for missing data.")
                setService("MISSING DATA")
                return;
            }
            let data = []
            for (var i = 0; i < completedRequests.length; i++) {
                data.push([completedRequests[i], serviceTxs[i]])
            }
            setRequests(data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            alert("Error. Check console!")
        }
    }

    useEffect(() => {
        getService();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {!service || !requests ?
                (service === "MISSING DATA" ? <div className="min-h-screen mx-36 py-10">
                    <h1 className="text-red-700 text-xl font-bold">
                        Something is wrong with the data in database! Check for missing data.
                    </h1>
                </div>
                    : <div className="flex justify-center items-center h-custom w-full">
                        <div className="loader"></div>
                    </div>
                ) :
                !loading ?
                    <div className="min-h-screen mx-36 py-10">
                        <div>
                            <h5 className="text-sm font-medium text-gray-400">My Balance</h5>
                            <h1 className="text-xl font-semibold">{balance} XRP</h1>
                            <hr className="border-t-neutral-400 my-10"></hr>
                            <h5 className="text-sm font-medium text-gray-400">
                                {service.status === "pending" ? "Pending Approval" : service.status === "approved" ? "Approved" : service.status === "completed" ? "Completed" : "Rejected"}
                            </h5>
                            <h1 className="text-xl font-bold">{service.name}</h1>
                            <div className="flex justify-berween gap-20 mt-5">
                                <div className="flex flex-col w-5/12 gap-5">
                                    <Image className="h-96 w-full object-cover rounded" height={1000} width={1000} src={service.photo} alt="Loading..." />
                                    <div className="flex gap-12 w-full">
                                        <div className="flex flex-col gap-1">
                                            <h5 className="font-semibold">Price per day of Service</h5>
                                            <span className="font-light text-gray-300">12.24 XRP</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h5 className="font-semibold">Location</h5>
                                            <span className="font-light text-gray-300">New York, USA</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="break-words w-7/12">
                                    <h2 className="text-lg font-semibold">Project Overview</h2>
                                    {service.description.split('\n').map((paragraphText, index) => (
                                        <p key={index} className="text-md font-light text-gray-400 mt-2 mb-4">
                                            {paragraphText}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <hr className="border-t-neutral-400 my-10"></hr>
                            <div className="mb-10">
                                <h1 className="text-xl font-semibold mb-5">Service Usage History</h1>
                                <div className="relative overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">
                                                    Transaction
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Amount
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Project
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requests.length !== 0 && Promise.all(
                                                requests.map(async (request, key) => {
                                                    const prj = await axios.get(`/api/projects/${request[0].project}`);
                                                    return (
                                                        <tr key={key} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                            <td className="px-6 py-4">
                                                                {request[1].transaction_hash}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {request[0].amount} XRP
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {prj.data.project.name}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            )}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div> : <div className="flex justify-center items-center h-custom w-full">
                        <div className="loader"></div>
                    </div>
            }
        </>
    );
}

export default ServiceHistory;