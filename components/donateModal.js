// This is the modal component that opens when a donor decides to donate to a project

"use client"
import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

const xrpl = require("xrpl")
const Modal = ({ data, onClose }) => {
    const [user, setUser] = useState("");
    const [amount, setAmount] = useState("");
    const [seed, setSeed] = useState("");

    async function handleUserDetails() {
        const token = await axios.get("/api/users/token"); // getting the decoded token details from the cookies
        const user_id = token.data.decodedToken.id;
        const user = await axios.get("/api/users/" + user_id); // getting the details of the logged in user
        setUser(user.data.user);
        // setUser(user.data.user);
    }

    useEffect(() => {
        handleUserDetails();
    }, [])

    async function handleDonation(destination) {
        if (!seed || !amount) {
            toast.error("Please fill both fields!", toastOption);
            return;
        }
        if (amount === "0") {
            toast.error("Amount can't be 0", toastOption)
            return;
        }
        try {
            toast.info("Processing. Please be patient...", toastOption)
            const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233', { connectionTimeout: 10000 });
            await client.connect();
            let address = "";
            let wallet = "";
            try {
                wallet = xrpl.Wallet.fromSeed(seed);
                address = wallet.classicAddress;
            } catch (err) {
                toast.error("Invalid Seed Value", toastOption)
                return;
            }
            if (address !== user.wallet_addr) {
                toast.error("Please provide the seed value of your wallet address registered with the system!", toastOption)
                return;
            }
            const prepared = await client.autofill({
                "TransactionType": "Payment",
                "Account": wallet.address,
                "Amount": xrpl.xrpToDrops(amount),
                "Destination": destination
            })
            const signed = wallet.sign(prepared)
            const tx = await client.submitAndWait(signed.tx_blob);
            console.log(tx.result.hash);
            console.log(tx)
            if (tx.result.meta.TransactionResult === "tesSUCCESS") { // if the xrpl transaction was successful
                try {
                    const txRes = await axios.post("http://localhost:3000/api/transactions", {
                        transaction_hash: tx.result.hash, amount: amount, from: wallet.address, to: destination
                    });
                    console.log(txRes);
                    const donationRes = await axios.post("http://localhost:3000/api/donations", {
                        transaction_hash: tx.result.hash, amount: amount, donor: user._id, project: data._id
                    });
                    console.log(donationRes)
                    const newAmount = parseFloat(data.amountRaised) + parseFloat(amount);
                    const prjRes = await axios.put(`http://localhost:3000/api/projects/${data._id}`, { amountRaised: newAmount })
                    console.log(prjRes)

                    if (txRes.status === 200 && donationRes.status === 200 && prjRes.status === 200) {
                        toast.success("Success!", toastOption)
                        setTimeout(() => {
                            setAmount("");
                            setSeed("");
                        }, 500)
                    } else {
                        toast.error("Something went wrong", toastOption)
                    }


                } catch (error) {
                    console.log("Error fetching transactions: ", error);
                }
            } else {
                console.error("Transaction failed with result:", tx.result.meta.TransactionResult);
            }
        } catch (err) {
            toast.error("Error. Check console!", toastOption)
            console.log(err)
        }

    }
    return (
        <div className="fixed top-0 left-0 w-full h-screen z-10 bg-bgDark flex justify-center items-center">
            <ToastContainer />
            <div className="bg-dark px-8 py-10 rounded w-subheader">
                <h1 className="text-3xl text-center my-2 font-bold">Donate XRP</h1>
                <p className="break-words mt-3">Project Wallet Address: <span className="text-gray-500">{data.wallet_addr}</span></p>
                <input className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500 my-2" type="text"
                    onChange={(e) => {
                        const reg = /^[0-9]*\.?[0-9]*$/;
                        if (e.target.value === "" || reg.test(e.target.value)) {
                            setAmount(e.target.value)
                        }
                    }}
                    value={amount}
                    placeholder="XRP Amount"
                />
                <input className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500 my-2" type="text"
                    onChange={(e) => setSeed(e.target.value)}
                    value={seed}
                    placeholder="Seed Value"
                />
                <button className="p-3 bg-darkGreenish rounded block w-full mt-4" onClick={() => handleDonation(data.wallet_addr)}>Donate</button>
                <button className="p-3 bg-red-800 rounded block w-full mt-4" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
