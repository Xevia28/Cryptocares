"use client"
import Image from "next/image";
import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const xrpl = require("xrpl");
const cc = require("five-bells-condition");

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

const ProjectPage = ({ params }) => {
    const serviceId = params.service;
    const [location, setLocation] = useState("");
    const [days, setDays] = useState("");
    const [amount, setAmount] = useState(0);
    const [service, setService] = useState("");
    const [provider, setProvider] = useState("");
    const [project, setProject] = useState("");
    const [balance, setBalance] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [hasProject, setHasProject] = useState("loading");

    async function handleUserDetails() {
        try {
            const token = await axios.get("/api/users/token");
            const user_id = token.data.decodedToken.id;
            const user = await axios.get("/api/users/" + user_id);
            const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233', {
                connectionTimeout: 10000,
                requestTimeout: 60000,
            });
            await client.connect();
            // console.log(user.data.user.projects[user.data.user.projects.length - 1])
            if (user.data.user.projects.length === 0) {
                setHasProject("false")
                return;
            }
            const project = await axios.get(`/api/projects/${user.data.user.projects[user.data.user.projects.length - 1]}`)
            setProject(project.data.project)
            // console.log(project.data.project.wallet_addr)
            if (project.data.project.status !== "approved") {
                setHasProject("false");
                return;
            }
            const walletBalance = await client.getXrpBalance(project.data.project.wallet_addr)
            setBalance(walletBalance)
            setHasProject("loaded")
        } catch (err) {
            console.log(err)
            toast.error(err, toastOption)
        }
    }

    async function getServiceDetails(id) {
        try {
            const service = await axios.get(`/api/services/${id}`);
            setService(service.data.service);
            const user = await axios.get(`/api/users/${service.data.service.provider}`);
            setProvider(user.data.user);
            // console.log(user.data.user)
            // const allDonations = await axios.get("/api/donations")
            // const donations = []
            // for (const donation of allDonations.data.donations) {
            //     if (donation.service === service.data.service._id) {
            //         donations.push(donation)
            //     }
            // }
            // setDonations(donations)
        } catch (err) {
            toast.error("Error fetching project details.", toastOption)
            console.log(err)
        }
    }

    useEffect(() => {
        handleUserDetails();
    }, [])

    useEffect(() => {
        getServiceDetails(serviceId);
    }, [serviceId])

    async function handleClick() {
        if (!location || !days) {
            toast.error("Please fill all the fields!", toastOption);
            return;
        }
        if (amount >= balance) {
            toast.error("Insufficient Balance", toastOption);
            return;
        }

        try {
            setDisabled(true)
            toast.info("Processing. Please be patient...", toastOption)
            // console.log(project.wallet_addr)
            // console.log(provider.wallet_addr)
            const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
            await client.connect()
            // Calculate the Unix timestamp of the future date and time
            const cancelAfterDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 2 weeks from now
            const cancelAfterTimestamp = Math.floor(cancelAfterDate.getTime() / 1000);
            const rippleOffset = 946684800;
            const cancelAfter = cancelAfterTimestamp - rippleOffset;
            const fulfillment = new cc.PreimageSha256()
            const preimageBuffer = Buffer.from(`Project(${project._id})ConfirmsProvider(${provider._id}at${new Date()})`, 'utf-8');
            fulfillment.setPreimage(preimageBuffer)
            const condition = fulfillment.getConditionBinary().toString('hex').toUpperCase()
            const fulfillment_hex = fulfillment.serializeBinary().toString('hex').toUpperCase()

            const escrowTx = await client.autofill({
                "TransactionType": "EscrowCreate",
                "Account": project.wallet_addr,
                "Amount": xrpl.xrpToDrops(amount),
                "Destination": provider.wallet_addr,
                "CancelAfter": cancelAfter,
                "Condition": condition, // Provider(provID)ApprovesProject(projID)
            })
            // console.log(escrowTx)
            const escrowRes = await axios.post("/api/escrows", { account: project.wallet_addr, destination: provider.wallet_addr, amount, condition, fulfillment: fulfillment_hex, sequence: escrowTx.Sequence, cancelAfter, escrowTx })
            const reqRes = await axios.post("/api/requests", { service: service._id, project: project._id, location, amount, escrow: escrowRes.data.id })
            const existingRequests = project.serviceRequests;
            existingRequests.push(reqRes.data.id);
            await axios.put(`/api/projects/${project._id}`, { serviceRequests: existingRequests })
            toast.success("Success", toastOption);
            setTimeout(() => { setLocation(""); setDays(""); setAmount(0); setDisabled(false) }, 500);
        } catch (err) {
            console.log(err)
            toast.error("An error occurred! Check console", toastOption)
            setDisabled(false)
        }
    }
    return (
        <>
            <ToastContainer />
            {(provider && service) ?
                // && donations) ?
                (hasProject === "loaded" ?
                    <div className="min-h-screen mx-36 py-10">
                        <div>
                            <h5 className="text-sm font-medium text-gray-400">Current Project Funds</h5>
                            <h1 className="text-xl font-semibold">{balance} XRP</h1>
                            <hr className="border-t-neutral-400 my-10"></hr>
                            <h5 className="text-sm font-medium text-gray-400">Active</h5>
                            <h1 className="text-xl font-semibold">{service.name}</h1>
                            <div className="flex justify-berween gap-20 mt-5">
                                <div className="flex flex-col w-5/12 gap-5">
                                    <Image className="h-96 w-full object-cover rounded" height={1000} width={1000} src={service.photo} alt="Loading..." />
                                    <div className="flex flex-col gap-2">
                                        <input onChange={(e) => setLocation(e.target.value)} value={location} type="text" placeholder="Location" className="h-full w-full rounded py-2 px-5 text-whitish bg-inpBg border border-slate-500" />
                                        <p className="mt-2 text-gray-400">Price per day of service: <span className="text-white font-semibold">{service.pricePerDay} XRP</span></p>
                                        <input onChange={(e) => {
                                            const reg = /^[1-9]\d*$/;
                                            if (e.target.value === "") {
                                                setDays(e.target.value);
                                                setAmount(0);
                                            } else if (reg.test(e.target.value)) {
                                                setDays(e.target.value);
                                                setAmount(Number((parseFloat(e.target.value) * parseFloat(service.pricePerDay)).toFixed(6)));
                                            }
                                        }}
                                            value={days}
                                            type="text" placeholder="Days" className="h-full w-full rounded py-2 px-5 text-whitish bg-inpBg border border-slate-500" />
                                        <p className="mt-2 text-gray-400">
                                            Total Amount: <span className="text-white font-semibold">{amount} XRP</span>
                                        </p>
                                        <button disabled={disabled} onClick={() => handleClick()} className="rounded bg-darkGreenish py-3 px-10">Request</button>
                                    </div>
                                </div>
                                <div className="break-words w-7/12">
                                    <h2 className="text-lg font-semibold">Project Overview</h2>
                                    {service.description.split('\n').map((paragraphText, index) => (
                                        <p key={index} className="text-md font-light text-gray-400 mt-2 mb-4">
                                            {paragraphText}
                                        </p>
                                    ))}
                                    <p className="text-md font-light text-gray-400 mt-2 mb-4"><strong>Location:</strong> {service.location}</p>
                                </div>
                            </div>
                            <hr className="border-t-neutral-400 my-10"></hr>

                        </div>
                    </div > : hasProject === "loading" ? <div className="flex justify-center items-center h-custom w-full">
                        <div className="loader"></div>
                    </div> : <div className="min-h-screen mx-36 py-10">
                        <h1 className="text-3xl font-medium">
                            You do not have any active projects!
                        </h1>
                    </div>
                ) : <div className="flex justify-center items-center h-custom w-full">
                    <div className="loader"></div>
                </div>
            }
        </>
    );
}

export default ProjectPage;