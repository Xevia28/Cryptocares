// Signup page for beneficiaries and providers

"use client"
import Header from "@/components/indexNav";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { isValidAddress } from 'xrpl';
import axios from "axios";
import { useRouter } from "next/navigation";
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

export default function Page({ params }) {
    const query = { params }
    const role = query.params.user;
    const router = useRouter();
    const [disabled, setDisabled] = useState(false);
    const [fileInputPON, setFileInputPON] = useState('');
    const [photo, setIpfsPathPON] = useState('');
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [wallet_addr, setWallet] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [ipfsLoading, setIpfsLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [strength, setStrength] = useState("");

    useEffect(() => {
        setName('');
        setEmail('');
        setWallet('');
        setPassword('');
        setPasswordConfirm('');
        setStrength('');
        setMsg('');
        setFileInputPON('');
        setIpfsPathPON('');
    }, [role]);


    useEffect(() => {
        function checkMatch(pword) {
            pword === password ? setMsg("") : setMsg("Passwords do not match!");
            pword === password ? setPasswordMatch(true) : setPasswordMatch(false);
            pword === "" && setMsg("")
        };
        checkMatch(passwordConfirm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [passwordConfirm]);

    useEffect(() => {
        function checkStrength(pword) {
            isStrongPassword(pword) ? setStrength("") : setStrength("Your password should meet the following requirements for a strong password: more than 7 letters, atleast one uppercase letter(A-Z), atleast one lowercase letter(a-z), atleast one digit(0-9) and atleast one special character(e.g., !, @, #, $, %, ^, &).")
            pword === "" && setStrength("")
        };
        checkStrength(password);
    }, [password]);

    function isStrongPassword(pword) {
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(pword);
        const hasLowercase = /[a-z]/.test(pword);
        const hasDigit = /\d/.test(pword);
        const hasSpecialChar = /[!@#$%^&*]/.test(pword);
        return (
            pword.length >= minLength &&
            hasUppercase &&
            hasLowercase &&
            hasDigit &&
            hasSpecialChar
        );
    }

    async function handleUpload(file) { // handling the file upload to generate ipfs path
        return new Promise((resolve, reject) => {
            try {
                const formData = new FormData();
                formData.append("file", file);

                const xhr = new XMLHttpRequest();
                xhr.open(
                    "POST",
                    "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    true
                );
                xhr.setRequestHeader("pinata_api_key", "4e2e0b082a3a7a7624d3");
                xhr.setRequestHeader(
                    "pinata_secret_api_key",
                    "f9ccf3142e278df713936a3a8032d7c2e5b5336543a884f4b44e40b707ddba35"
                );

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        const resFile = JSON.parse(xhr.responseText);
                        const imgHash = `https://gateway.ipfs.io/ipfs/${resFile.IpfsHash}`;
                        // console.log(imgHash);
                        resolve(imgHash);
                    } else {
                        reject("Unable to upload image to Pinata");
                    }
                };

                xhr.send(formData);
            } catch (err) {
                reject("Unable to upload image to Pinata");
                console.log(err);
            }
        });
    }

    async function handlePONUpload() {
        if (fileInputPON !== '') {
            setIpfsLoading(true)
            await handleUpload(fileInputPON).then(x => {
                setIpfsPathPON(x);
                setIpfsLoading(false);
            })
        } else {
            toast.error("No file selected", toastOption);
        }
    }

    async function handleSignUp() {
        if (!name || !email || !wallet_addr || !password || !passwordConfirm || !fileInputPON) {
            toast.error("Please fill in all required fields", toastOption);
            return;
        }
        if (!isStrongPassword(password)) {
            toast.error("Please provide a strong password", toastOption)
            return;
        }
        if (!passwordMatch) {
            toast.error("Passwords do not match!", toastOption)
            return;
        }
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(email)) {
            toast.error("Please provide a valid email address", toastOption);
            return;
        }
        if (!isValidAddress(wallet_addr)) {
            toast.error("Please provide a valid XRP wallet address", toastOption)
            return;
        }
        if (!photo) {
            toast.error("Upload the photo to generate IPFS url", toastOption);
            return;
        }
        try {
            setDisabled(true);
            toast.info("Processing. Please be patient...", {
                position: "top-right",
                autoClose: 15000,
                hideProgressBar: false,
                newestOnTop: true,
                closeOnClick: true,
                rtl: false,
                pauseOnFocusLoss: true,
                draggable: true,
                pauseOnHover: true,
                theme: "colored"
            })
            const userResponse = await axios.post("/api/users", { name, email, wallet_addr, password, photo, role: role, is_active: false });
            // console.log(userResponse)
            if (userResponse.status === 200 || userResponse.status === 201) {
                // toast.info("User created. Processing", toastOption)
                const user_id = userResponse.data.id;
                const proofResponse = await axios.post("/api/proofs", { photo, user_id })
                // console.log(proofResponse)
                if (proofResponse.status === 200 || proofResponse.status === 201) {
                    // console.log("Success")
                    toast.success("User Creation Registered. Admins will look over your request", toastOption)
                    setTimeout(() => { router.push("/login") }, 1000)
                } else {
                    console.error("Proof creation failed:", proofResponse.data);
                    toast.error("Proof creation failed", toastOption);
                }
            }
        } catch (err) {
            setDisabled(false);
            if (err.response.status === 400) {
                toast.error("Email already registered!", toastOption);
                return;
            }
            // console.log(err.response.data.error)
            // console.log(err.response.data.error.startsWith("E11000 duplicate key error collection"))
            if (err.response.data.error.startsWith("E11000 duplicate key error collection")) {
                toast.error("Wallet address already registered!", toastOption);
                return;
            }
            toast.error("Request timed out. Please try again.", toastOption)
            console.log(err)
        }
    }
    return (
        <>
            <Header />
            <ToastContainer />
            <div className="min-h-screen flex">
                <div className="w-header h-full">
                    <Image src={'/ripple.png'} alt="sda" height={1000} width={1000} className="relative top-0 left-0 min-h-screen w-full object-cover z-[-1]" />
                </div>
                <div className="flex flex-col w-header gap-4 justify-center items-center py-4">
                    <h1 className="font-bold text-2xl">Register Now!</h1>
                    <div className="flex gap-4">
                        <Link href={"/signup"}><button className="py-2 px-6 bg-darkGreenish text-whitish rounded">Donor</button></Link>
                        <Link href={"/signup/beneficiary"}><button className={`py-2 px-6 ${role === "beneficiary" ? 'bg-active' : 'bg-darkGreenish'} text-whitish rounded`}>Beneficiary</button></Link>
                        <Link href={"/signup/provider"}><button className={`py-2 px-6 ${role === "provider" ? 'bg-active' : 'bg-darkGreenish'} text-whitish rounded`}>Provider</button></Link>
                    </div>
                    {role === "beneficiary" ?
                        <form className="container bg-veryDarkGreenish p-6 rounded w-miniheader shadow shadow-gray-800 flex flex-col gap-4">
                            <div><input onChange={(e) => setName(e.target.value)} value={name} type="text" className="h-full w-full rounded p-2 text-sm text-whitish bg-inpBg border border-slate-500" placeholder="Name" /></div>
                            <div><input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="h-full w-full rounded p-2 text-sm text-whitish bg-inpBg border border-slate-500" placeholder="Email" /></div>
                            <div><input onChange={(e) => setWallet(e.target.value)} value={wallet_addr} type="text" className="h-full w-full rounded p-2 text-sm text-whitish bg-inpBg border border-slate-500" placeholder="Wallet Address" /></div>
                            <div>
                                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="w-full rounded p-2 text-sm text-whitish bg-inpBg border border-slate-500" placeholder="Password" />
                                <p className={`text-xs text-orangeish ${strength != "" ? "my-3" : "my-0"}`}>{strength}</p>
                            </div>
                            <div>
                                <input onChange={(e) => setPasswordConfirm(e.target.value)} value={passwordConfirm} type="password" className="w-full rounded p-2 text-sm text-whitish bg-inpBg border border-slate-500" placeholder="Confirm Password" />
                                <p className={`text-xs text-orangeish ${msg != "" ? "my-2" : "my-0"}`}>{msg}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-3">Proof of need (documentation of the financial situation or proof of status (ex. a refugee, disaster victim)):</label>
                                <div className="w-full border border-slate-500 rounded bg-inpBg">
                                    <input className="w-3/4 p-2 file:cursor-pointer" type="file" onChange={(e) => setFileInputPON(e.target.files[0])} />
                                    <button className="p-2 w-1/4 bg-darkGreenish rounded" onClick={(e) => { e.preventDefault(); handlePONUpload() }}>Upload</button>
                                </div>
                                {ipfsLoading ?
                                    <div className="w-full h-48 flex justify-center items-center"><div className="loader"></div></div> :
                                    <p className="mt-2 text-xs break-words">IPFS path generated: <span className="text-slate-400">{photo === '' ? 'Upload file to generate IPFS path' : photo} </span></p>
                                }
                            </div>
                            <button className="p-2 bg-darkGreenish rounded" onClick={(e) => { e.preventDefault(); handleSignUp() }}>Sign Up</button>
                            <div className="text-center">Already have an account? <Link href={"/login"} className="text-blue-600 font-medium hover:underline">Login</Link></div>
                        </form> :
                        <form className="container bg-veryDarkGreenish p-6 rounded w-miniheader shadow shadow-gray-800 flex flex-col gap-4">
                            <div><input onChange={(e) => setName(e.target.value)} value={name} type="text" className="h-full w-full rounded p-2 text-sm text-whitish bg-inpBg border border-slate-500" placeholder="Name" /></div>
                            <div><input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="h-full w-full rounded p-2 text-sm text-whitish bg-inpBg border border-slate-500" placeholder="Email" /></div>
                            <div><input onChange={(e) => setWallet(e.target.value)} value={wallet_addr} type="text" className="h-full w-full rounded p-2 text-sm text-whitish bg-inpBg border border-slate-500" placeholder="Wallet Address" /></div>
                            <div>
                                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="w-full rounded p-2 text-sm text-whitish bg-inpBg border border-slate-500" placeholder="Password" />
                                <p className={`text-xs text-orangeish ${strength != "" ? "my-3" : "my-0"}`}>{strength}</p>
                            </div>
                            <div>
                                <input onChange={(e) => setPasswordConfirm(e.target.value)} value={passwordConfirm} type="password" className="w-full rounded p-2 text-sm text-whitish bg-inpBg border border-slate-500" placeholder="Confirm Password" />
                                <p className={`text-xs text-orangeish ${msg != "" ? "my-2" : "my-0"}`}>{msg}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-3">Proof of eligibility (documentation to show that you have the necessary qualifications, skills, or credentials to offer their services):</label>
                                <div className="w-full border border-slate-500 rounded bg-inpBg">
                                    <input className="w-3/4 p-2 file:cursor-pointer" type="file" onChange={(e) => setFileInputPON(e.target.files[0])} />
                                    <button className="p-2 w-1/4 bg-darkGreenish rounded" onClick={(e) => { e.preventDefault(); handlePONUpload() }}>Upload</button>
                                </div>
                                {ipfsLoading ?
                                    <div className="w-full h-48 flex justify-center items-center"><div className="loader"></div></div> :
                                    <p className="mt-2 text-xs break-words">IPFS path generated: <span className="text-slate-400">{photo === '' ? 'Upload file to generate IPFS path' : photo} </span></p>
                                }
                            </div>
                            <button disabled={disabled} className="p-2 bg-darkGreenish rounded" onClick={(e) => { e.preventDefault(); handleSignUp() }}>Sign Up</button>
                            <div className="text-center">Already have an account? <Link href={"/login"} className="text-blue-600 font-medium hover:underline">Login</Link></div>
                        </form>
                    }

                </div>
            </div>
        </>
    )
}