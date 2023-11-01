"use client"
import { useState } from "react";
import Header from "@/components/indexNav";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleLogin() {
    if (!email || !password) {
      toast.error("Please fill in all required fields", toastOption);
      return;
    }
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      toast.error("Please provide a valid email address", toastOption);
      return;
    }
    try {
      setDisabled(true);
      toast.info("Processing. Please be patient...", {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        newestOnTop: true,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: "colored"
      })
      const response = await axios.post("/api/users/login", { email, password });
      // console.log(response);
      if (response.status === 200) {
        toast.success("Login successful", toastOption)
        console.log(response.data.role)
        if (response.data.role === "donor") {
          setTimeout(() => { router.push("/donor") }, 1000)
          return;
        } else if (response.data.role === "beneficiary") {
          setTimeout(() => { router.push("/beneficiary") }, 1000)
          return;
        } else {
          setTimeout(() => { router.push("/provider") }, 1000)
          return;
        }
      }
    } catch (err) {
      setDisabled(false);
      if (err.response.status === 400) {
        console.log(err.response.data.error)
        if (err.response.data.error === "Invalid password") {
          toast.error("Incorrect password!", toastOption);
          return;
        }
        toast.error("Email not registered!", toastOption);
        return;
      }
      if (err.response.status === 403) {
        console.log(err.response.data.error)
        toast.error("User account is not activated!", toastOption);
        return;
      }
      toast.error(err.message, toastOption);
      console.log(err)
    }
  }

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
  return (
    <>
      <Header />
      <ToastContainer />
      <div className="min-h-custom flex">
        <div className="w-header">
          <Image src={'/ripple.png'} alt="sda" height={1000} width={1000} className="relative top-0 left-0 min-h-custom w-full object-cover z-[-1]" />
        </div>
        <div className="flex flex-col w-header gap-4 justify-center items-center">
          <h1 className="font-bold text-3xl">Sign In</h1>

          <form className="container bg-veryDarkGreenish p-6 rounded w-miniheader shadow shadow-gray-800 flex flex-col gap-4">
            <div><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Email" /></div>
            <div><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Password" /></div>
            <button disabled={disabled} onClick={(e) => { e.preventDefault(); handleLogin() }} className="p-3 bg-darkGreenish rounded">Sign In</button>
            <div className="text-center">Do not have an account? <Link href={"/signup"} className="text-blue-600 font-medium hover:underline">Sign Up</Link></div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
