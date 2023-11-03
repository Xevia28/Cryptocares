// This page displays the details of the request made by the beneficiary and the beneficiary can confirm the XRP payment for the service 
// (if that request was approved and if they got the service requested) they requested in this page

"use client"
import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const xrpl = require("xrpl");

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

const ReqDetailsPage = ({ params }) => {
    const reqID = params.id;
    const router = useRouter();
    const [service, setService] = useState("");
    const [amount, setAmount] = useState("");
    const [balance, setBalance] = useState("");
    const [request, setRequest] = useState("");
    const [provider, setProvider] = useState("");

    async function getServiceDetails() {
        try {
            const request = await axios.get(`/api/requests/${reqID}`)
            setAmount(request.data.request.amount)
            const service = await axios.get(`/api/services/${request.data.request.service}`)
            setService(service.data.service)
            const provRes = await axios.get(`/api/users/${service.data.service.provider}`)
            setProvider(provRes.data.user)
            const project = await axios.get(`/api/projects/${request.data.request.project}`)
            const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233', {
                connectionTimeout: 10000,
                requestTimeout: 60000,
            });
            await client.connect();
            const walletBalance = await client.getXrpBalance(project.data.project.wallet_addr)
            setBalance(walletBalance)
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

    async function handleConfirmation() {
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

            const prepared = await client.autofill({
                "TransactionType": "EscrowFinish",
                "Account": projectWallet.classicAddress,
                "Owner": projectWallet.classicAddress,
                "OfferSequence": parseInt(escrow.sequence),
                "Condition": escrow.condition,
                "Fulfillment": escrow.fulfillment
            })
            const signed = projectWallet.sign(prepared)
            const tx = await client.submitAndWait(signed.tx_blob)
            console.log(tx)
            if (tx.result.meta.TransactionResult === "tesSUCCESS") { // if the xrpl transaction was successful
                const txRes = await axios.post("/api/transactions", { transaction_hash: tx.result.hash, amount, from: projectWallet.classicAddress, to: request.service })
                const requpdateRes = await axios.put(`/api/requests/${reqID}`, { status: "completed" });
                const escrowUpdateRes = await axios.put(`/api/escrows/${request.escrow}`, { status: "finished" });
                if (requpdateRes.status === 200 && escrowUpdateRes.status === 200 && txRes.status === 200) {
                    toast.success("Success", toastOption)
                    setTimeout(() => { router.push("/beneficiary/requested") }, 500)
                }
            } else {
                toast.info("Transaction not successful. Check tx data in console", toastOption);
            }
        } catch (err) {
            console.log(err)
            toast.error("Something went wrong. Check console!", toastOption)
        }
    }

    return (
        <>
            <ToastContainer />
            {!service || !balance ?
                <div className="flex justify-center items-center h-custom w-full">
                    <div className="loader"></div>
                </div> :
                <div className="min-h-screen mx-36 py-10">
                    <div>
                        <h5 className="text-sm font-medium text-gray-400">Current Project Funds</h5>
                        <h1 className="text-xl font-semibold">{balance} XRP</h1>
                        <hr className="border-t-neutral-400 my-10"></hr>
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
                    </div>
                    <p className="mt-10"><strong>Project: </strong><span onClick={() => router.push(`/beneficiary/projects/${request.project}`)} className="hover:underline hover:cursor-pointer">Click here to view project</span></p>
                    {request.status === "approved" && <div className="mt-6 flex gap-6">
                        <button onClick={() => {
                            const confirmation = window.confirm("Are you sure you want to confirm that the service has been received from the provider?");
                            if (confirmation) {
                                handleConfirmation();
                            }
                        }
                        } className="p-3 bg-darkGreenish rounded">Confirm Service Received</button>
                    </div>}
                </div>
            }
        </>
    );
}

export default ReqDetailsPage;