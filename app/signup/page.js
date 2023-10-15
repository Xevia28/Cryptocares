"use client"
import Header from "@/components/indexNav";
import Image from "next/image";
import Link from "next/link";
// import { isValidAddress } from 'xrpl';
import { useState } from "react";

const SignUp = () => {

  return (
    <>
      <Header />
      <div className="h-custom flex">
        <div className="w-header">
          <Image src={'/ripple.png'} alt="sda" height={1000} width={1000} className="relative top-0 left-0 h-custom w-full z-[-1]" />
        </div>
        <div className="flex flex-col w-header gap-4 justify-center items-center">
          <h1 className="font-bold text-2xl">Register Now!</h1>
          <div className="flex gap-4">
            <button className="py-2 px-6 bg-darkGreenish text-whitish rounded">Donor</button>
            <button className="py-2 px-6 bg-darkGreenish text-whitish rounded">Beneficiary</button>
            <button className="py-2 px-6 bg-darkGreenish text-whitish rounded">Provider</button>
          </div>
          <form className="container bg-veryDarkGreenish p-6 rounded w-miniheader shadow shadow-gray-800 flex flex-col gap-4">
            <div><input type="text" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Name" /></div>
            <div><input type="text" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Email" /></div>
            <div><input type="text" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Wallet Address" /></div>
            <div><input type="text" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Password" /></div>
            <div><input type="text" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Confirm Password" /></div>
            <button className="p-3 bg-darkGreenish rounded">Create Project</button>
            <div className="text-center">Already have an account? <Link href={"/login"} className="text-blue-600 font-medium hover:underline">Login</Link></div>
          </form>
        </div>
      </div>
    </>
  )
  // const [inputValue, setInputValue] = useState(''); // State to store the input value
  // const [fileInput, setFileInput] = useState(''); // State to store the input value
  // const [message, setMessage] = useState(''); // State to store the message
  // const [ipfsMessage, setIpfsMessage] = useState(''); // State to store the message
  // const [ipfsPath, setIpfsPath] = useState('');
  // const handleClick = () => {
  //   if (isValidAddress(inputValue)) {
  //     setMessage('Condition is met!');
  //   } else {
  //     setMessage('Condition is not met.');
  //   }
  // };

  // function validateAddress(address) {
  //   if (isValidAddress(address)) {
  //     console.log(`${address} is a valid XRPL wallet address`);
  //   } else {
  //     console.log(`${address} is not a valid XRPL wallet address`);
  //   }
  // }

  // async function handleUpload() {
  //   if (fileInput !== '') {
  //     try {
  //       const formData = new FormData();
  //       formData.append("file", fileInput);
  //       // showLoading();

  //       const xhr = new XMLHttpRequest();
  //       xhr.open(
  //         "POST",
  //         "https://api.pinata.cloud/pinning/pinFileToIPFS",
  //         true
  //       );
  //       xhr.setRequestHeader("pinata_api_key", "4e2e0b082a3a7a7624d3");
  //       xhr.setRequestHeader(
  //         "pinata_secret_api_key",
  //         "f9ccf3142e278df713936a3a8032d7c2e5b5336543a884f4b44e40b707ddba35"
  //       );
  //       xhr.onload = function () {
  //         if (xhr.status === 200) {
  //           const resFile = JSON.parse(xhr.responseText);

  //           const imgHash = `https://gateway.ipfs.io/ipfs/${resFile.IpfsHash}`;
  //           setIpfsPath(imgHash);
  //           setIpfsMessage("IPFS path generated: " + imgHash);
  //         } else {
  //           alert("Unable to upload image to Pinata");
  //         }
  //         // hideLoading();
  //       };
  //       xhr.send(formData);
  //     } catch (err) {
  //       alert("Unable to upload image to Pinata");
  //       console.log(err);
  //     }
  //   } else {
  //     alert("No file selected");
  //   }
  // }

  // return (
  //   <>
  //     <Header />
  //     <div className="p-6 m-6 flex flex-col gap-6">
  //       <div>
  //         <label className="block font-bold">Wallet Address</label>
  //         <input
  //           type="text"
  //           className="p-3 text-black rounded"
  //           value={inputValue}
  //           onChange={(e) => setInputValue(e.target.value)}
  //         />
  //         <button className="ml-5 p-3 bg-blue-600 text-white rounded" onClick={handleClick}>Check Condition</button>
  //         <p className="text-slate-500 mt-2">{message}</p>
  //       </div>
  //       <div>
  //         <label className="block font-bold">IPFS</label>
  //         {/* <input type="file" id="fileInput" /> */}
  //         <input
  //           type="file"
  //           className="rounded"
  //           onChange={(e) => setFileInput(e.target.files[0])}
  //         />
  //         <button className="ml-5 p-3 bg-blue-600 text-white rounded" onClick={handleUpload}>Upload Photo</button>
  //         <p className="text-slate-500 mt-2">{ipfsMessage}</p>
  //       </div>
  //     </div>

  //   </>
  // );
};

export default SignUp;
