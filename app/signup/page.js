// Signup page for donors

"use client"
import Header from "@/components/indexNav";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isValidAddress } from 'xrpl';
import { useRouter } from "next/navigation";
import axios from "axios";
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

const SignUp = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wallet_addr, setWallet] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [msg, setMsg] = useState("");
  const [strength, setStrength] = useState("");

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

  async function handleSignUp() {
    if (!name || !email || !wallet_addr || !password || !passwordConfirm) {
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
      const response = await axios.post("/api/users", { name, email, wallet_addr, password });
      // console.log(response);
      if (response.status === 200) {
        toast.success("Signup successful", toastOption)
        setTimeout(() => { router.push("/login") }, 1000)
      }
    } catch (err) {
      setDisabled(false);
      if (err.response.status === 400) {
        toast.error("Email already registered!", toastOption);
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
      <div className="min-h-custom flex">
        <div className="w-header">
          <Image src={'/ripple.png'} alt="Loading..." height={1000} width={1000} className="relative top-0 left-0 min-h-custom w-full object-cover z-[-1]" />
        </div>
        <div className="flex flex-col w-header gap-4 justify-center items-center">
          <h1 className="font-bold text-2xl">Register Now!</h1>
          <div className="flex gap-4">
            <Link href={"/signup"}><button className="py-2 px-6 bg-active text-whitish rounded">Donor</button></Link>
            <Link href={"/signup/beneficiary"}><button className="py-2 px-6 bg-darkGreenish text-whitish rounded">Beneficiary</button></Link>
            <Link href={"/signup/provider"}><button className="py-2 px-6 bg-darkGreenish text-whitish rounded">Provider</button></Link>
          </div>
          <form className="container bg-veryDarkGreenish p-6 rounded w-miniheader shadow shadow-gray-800 flex flex-col gap-4">
            <div><input onChange={(e) => setName(e.target.value)} value={name} type="text" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Name" /></div>
            <div><input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Email" /></div>
            <div><input onChange={(e) => setWallet(e.target.value)} value={wallet_addr} type="text" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Wallet Address" /></div>
            <div>
              <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Password" />
              <p className={`text-sm text-orangeish ${strength != "" ? "my-3" : "my-0"}`}>{strength}</p>
            </div>
            <div>
              <input onChange={(e) => setPasswordConfirm(e.target.value)} value={passwordConfirm} type="password" className="w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Confirm Password" />
              <p className={`text-sm text-orangeish ${msg != "" ? "my-3" : "my-0"}`}>{msg}</p>
            </div>
            <button disabled={disabled} className="p-3 bg-darkGreenish rounded" onClick={(e) => { e.preventDefault(); handleSignUp() }}>Sign Up</button>
            <div className="text-center">Already have an account? <Link href={"/login"} className="text-blue-600 font-medium hover:underline">Login</Link></div>
          </form>
        </div>
      </div>
    </>
  )
};

export default SignUp;
