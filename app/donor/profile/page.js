// Profile Page

"use client"
import { useState, useEffect } from "react";
const xrpl = require("xrpl");
import { isValidAddress } from 'xrpl';
import Image from "next/image";
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

const Profile = () => {
  const [state, setState] = useState(0);
  const [balance, setWallet] = useState("");
  const [userData, setUserData] = useState(null);
  const [fileInput, setFileInput] = useState("");
  const [ipfsPath, setIpfsPath] = useState("");
  const [name, setName] = useState(userData ? userData.name : "");
  const [email, setEmail] = useState(userData ? userData.email : "");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [walletAddress, setWalletAddress] = useState(userData ? userData.wallet_addr : "");
  const [ipfsLoading, setIpfsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function handleIPFS(file) {
    return new Promise((resolve, reject) => {
      try {
        setIpfsLoading(true)
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
            resolve(imgHash);
            setIpfsLoading(false);
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

  async function handleUpload() {
    if (fileInput !== '') {
      await handleIPFS(fileInput).then(x => setIpfsPath(x))
    } else {
      toast.error("No file selected", toastOption);
    }
  }

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

  async function handleUpdate() {
    if (!name && !email && !password && !fileInput && !walletAddress) {
      toast.error("Please fill atleast one required field", toastOption);
      return;
    }
    const updateData = {}

    if (name) {
      updateData.name = name;
    }
    if (password) {
      updateData.password = password;
      if (!isStrongPassword(password)) {
        toast.error("Please provide a strong password", toastOption)
        return;
      }
      if (password && !confirmpassword) {
        toast.error("Please confirm your password", toastOption);
        return;
      }
      if (password !== confirmpassword) {
        toast.error("Passwords do not match!", toastOption)
        return;
      }
    }
    if (email) {
      updateData.email = email;
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(email)) {
        toast.error("Please provide a valid email address", toastOption);
        return;
      }
    }
    if (walletAddress) {
      updateData.wallet_addr = walletAddress;
      if (!isValidAddress(walletAddress)) {
        toast.error("Please provide a valid XRP wallet address", toastOption)
        return;
      }
    }

    if (fileInput && !ipfsPath) {
      toast.error("Please upload the file to continue", toastOption);
      return;
    }
    if (ipfsPath) {
      updateData.photo = ipfsPath;
    }

    try {
      toast.info("Processing. Please be patient...", toastOption);
      const res = await axios.put(`/api/users/${userData._id}`, updateData);
      if (res.status === 200) {
        toast.success("Profile updated successfully", toastOption);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmpassword("");
        setIpfsPath("");
        setState(state + 1);
      }
    } catch (err) {
      console.log(err)
      toast.error("Something went wrong. Please check your console", toastOption)
    }

  }

  async function handleUserDetails() {
    try {
      const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233', {
        connectionTimeout: 10000,
        requestTimeout: 60000,
      });
      const token = await axios.get("/api/users/token"); // getting the decoded token details from the cookies
      const user_id = token.data.decodedToken.id;
      const user = await axios.get("/api/users/" + user_id); // getting the details of the logged in user
      await client.connect();
      setUserData(user.data.user)
      const walletBalance = await client.getXrpBalance(user.data.user.wallet_addr)
      setWallet(walletBalance)
      setLoading(false);
    } catch (err) {
      console.log(err)
      toast.error("Something went wrong. Check console!", toastOption)
    }
  }

  useEffect(() => {
    handleUserDetails();
  }, [state])

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen w-full">
        {!loading ? (
          <div className="w-lg mx-36 mt-10">
            <h1 className="text-2xl text-center font-semibold my-4">Edit Profile</h1>
            <div>
              <Image src={userData.photo} alt="logo" width={1000} height={1000} className="mt-5 h-[120px] w-[120px] mx-auto rounded-full object-cover z-[-1]" />
            </div>
            <div>
              <div className="mt-6">
                <h5 className="text-sm font-medium text-gray-400">My Funds</h5>
                <h1 className="text-xl font-semibold mb-6">{balance} XRP</h1>
                <hr className="border-t-neutral-400"></hr>
              </div>
              <form className="py-6">
                <div className="flex gap-10 mt-10">
                  <div className="flex-1 flex flex-col gap-1">
                    <label>Name:</label>
                    <input type="text" className="w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder={userData.name} value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <label>Email:</label>
                    <input type="email" className="w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder={userData.email} value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="flex gap-10 mt-10">
                  <div className="flex-1 flex flex-col gap-1">
                    <label>Password:</label>
                    <input type="password" className="w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <label>Confirm Password:</label>
                    <input type="password" className="w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Confirm Password" value={confirmpassword} onChange={(e) => setConfirmpassword(e.target.value)} />
                  </div>
                </div>
                <div className="flex flex-col gap-1 mt-10">
                  <label>Photo:</label>
                  <div className="w-full border border-slate-500 rounded bg-inpBg">
                    <input className="w-3/4 p-2 file:cursor-pointer" type="file" onChange={(e) => setFileInput(e.target.files[0])} />
                    <button className="p-2 w-1/4 bg-darkGreenish rounded" onClick={(e) => { e.preventDefault(); handleUpload() }}>Upload</button>
                  </div>
                  {ipfsLoading ? <div className="w-full h-48 flex justify-center items-center"><div className="loader"></div></div> :
                    <p className="mt-2 text-xs break-words">IPFS path generated: <span className="text-slate-400">{ipfsPath === '' ? 'Upload file to generate IPFS path' : ipfsPath} </span></p>
                  }
                </div>
                <div className="flex flex-col gap-1 mt-10">
                  <label>Wallet:</label>
                  <input type="text" className="w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder={userData.wallet_addr} value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
                </div>
                <button onClick={(e) => { e.preventDefault(); handleUpdate() }} className="p-3 w-40 bg-darkGreenish rounded mt-6">Update</button>
              </form>
            </div>
          </div >
        ) : (
          <div className="mx-36 py-10 text-xl font-semibold">Loading User Data...</div>
        )}
      </div >
    </>
  );
};

export default Profile;