"use client"
import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const xrpl = require("xrpl");

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

const ReqDetailsPage = ({ params }) => {
    const reqID = params.id;
    const router = useRouter();
    const [service, setService] = useState("");
    const [amount, setAmount] = useState("");
    const [request, setRequest] = useState("");

    async function getServiceDetails() {
        try {
            const request = await axios.get(`/api/requests/${reqID}`)
            setAmount(request.data.request.amount)
            const service = await axios.get(`/api/services/${request.data.request.service}`)
            setService(service.data.service)
            setRequest(request.data.request)
        } catch (err) {
            console.log(err)
            alert("ERROR! Check Console.")
        }
    }

    useEffect(() => {
        getServiceDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function handleApproval() {
        toast.info("Processing. Please be patient...", toastOption)
        try {
            const escrowRes = await axios.get(`/api/escrows/${request.escrow}`)
            const escrow = escrowRes.data.escrow;
            const project = await axios.get(`/api/projects/${request.project}`)
            const seed = project.data.project.seed;
            const projectWallet = xrpl.Wallet.fromSeed(seed);
            const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233', {
                connectionTimeout: 10000,
                requestTimeout: 60000,
            });
            await client.connect();
            const escrowTx = escrow.escrowTx;
            const ledger = await client.request({ command: 'ledger_closed' })
            const latestLedgerSequence = ledger.result.ledger_index
            escrowTx.LastLedgerSequence = parseInt(latestLedgerSequence) + 3;
            // with this the funds are locked in the escrow from the project's wallet
            const signed = projectWallet.sign(escrow.escrowTx)
            const tx = await client.submitAndWait(signed.tx_blob)
            console.log(tx)
            const requpdateRes = await axios.put(`/api/requests/${reqID}`, { status: "approved" });
            const escrowUpdateRes = await axios.put(`/api/escrows/${request.escrow}`, { status: "active" });
            if (requpdateRes.status === 200 && escrowUpdateRes.status === 200) {
                toast.success("Success", toastOption)
                setTimeout(() => { router.push("/provider/requests") }, 500)
            }
        } catch (err) {
            console.log(err)
            toast.error("Something went wrong. Check console!", toastOption)
        }
    }

    async function handleRejection() {
        toast.info("Processing. Please be patient...", {
            position: "top-right",
            autoClose: 12000,
            hideProgressBar: false,
            newestOnTop: true,
            closeOnClick: true,
            rtl: false,
            pauseOnFocusLoss: true,
            draggable: true,
            pauseOnHover: true,
            theme: "colored"
        })
        try {
            const requpdateRes = await axios.put(`/api/requests/${reqID}`, { status: "rejected" });
            const escrowUpdateRes = await axios.put(`/api/escrows/${request.escrow}`, { status: "cancelled" });
            if (requpdateRes.status === 200 && escrowUpdateRes.status === 200) {
                toast.success("Success", toastOption)
                setTimeout(() => { router.push("/provider/requests") }, 500)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong. Check console!", toastOption)
        }
    }

    return (
        <>
            <ToastContainer />
            {!service ?
                <div className="flex justify-center items-center h-custom w-full">
                    <div className="loader"></div>
                </div> :
                <div className="min-h-screen mx-36 py-10">
                    <div>
                        <h5 className="text-sm font-medium text-gray-400">
                            {request.status === "pending" ? "Pending Approval" : request.status === "approved" ? "Approved" : request.status === "completed" ? "Completed" : "Rejected"}
                        </h5>
                        <h1 className="text-xl font-bold">{service.name}</h1>
                        <div className="flex justify-berween gap-20 mt-5">
                            <div className="flex flex-col w-5/12 gap-5">
                                <Image className="h-96 w-full object-cover rounded" height={1000} width={1000} src={service.photo} alt="Loading..." />
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
                        <div className="flex justify-between w-full mt-10">
                            <div className="flex flex-col gap-1">
                                <h5 className="font-semibold">Price per day of service</h5>
                                <span className="font-light text-gray-300">{service.pricePerDay} XRP</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h5 className="font-semibold">Total days of service requested</h5>
                                <span className="font-light text-gray-300">{Math.round(amount / service.pricePerDay)}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h5 className="font-semibold">Cost incurred</h5>
                                <span className="font-light text-gray-300">{amount} XRP</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h5 className="font-semibold">Location</h5>
                                <span className="font-light text-gray-300">{request.location}</span>
                            </div>
                        </div>
                        <p className="mt-10"><strong>Project: </strong><span onClick={() => router.push(`/provider/${request.project}`)} className="hover:underline hover:cursor-pointer">Click here to view project</span></p>
                    </div>
                    {request.status === "pending" && <div className="mt-6 flex gap-6">
                        <button onClick={() => handleApproval()} className="p-3 bg-darkGreenish rounded">Approve</button>
                        <button onClick={() => handleRejection()} className="p-3 bg-red-800 rounded">Reject</button>
                    </div>}
                </div>
            }
        </>
    );
}

export default ReqDetailsPage;