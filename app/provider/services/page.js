"use client"
import Nav from "@/components/provNav";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
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

const Services = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerDay, setPrice] = useState("");
  const [fileInputPON, setFileInputPON] = useState('');
  const [fileInputImage, setFileInputImage] = useState('');
  const [ipfsPathPON, setIpfsPathPON] = useState('');
  const [ipfsPathImage, setIpfsPathImage] = useState('');
  const [userID, setUserID] = useState();
  const [ipfsPONLoading, setIpfsPONLoading] = useState(false);
  const [ipfsIMGLoading, setIpfsIMGLoading] = useState(false);

  async function handleUserDetails() {
    const token = await axios.get("/api/users/token");
    const user_id = token.data.decodedToken.id;
    setUserID(user_id)
  }

  useEffect(() => {
    handleUserDetails();
  }, [])

  async function handleUpload(file) {
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
      setIpfsPONLoading(true);
      await handleUpload(fileInputPON).then(x => {
        setIpfsPathPON(x);
        setIpfsPONLoading(false);
      })
    } else {
      toast.error("No file selected", toastOption);
    }
  }
  async function handleUploadImage() {
    if (fileInputImage !== '') {
      setIpfsIMGLoading(true);
      await handleUpload(fileInputImage).then(x => {
        setIpfsPathImage(x);
        setIpfsIMGLoading(false);
      })
    } else {
      toast.error("No file selected", toastOption);
    }
  }

  async function handleService() {
    if (!name || !description || !location || !pricePerDay || !fileInputPON || !fileInputImage) {
      toast.error("Please fill all the fields!", toastOption)
      return;
    }
    if (!ipfsPathPON || !ipfsPathImage) {
      toast.error("Please upload both the files to get the IPFS Path.", toastOption)
      return;
    }

    try {
      setDisabled(true);
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
      const serviceResponse = await axios.post("/api/services", { name, description, location, pricePerDay, photo: ipfsPathImage, provider: userID });
      // console.log(serviceResponse)
      if (serviceResponse.status === 200 || serviceResponse.status === 201) {
        const service_id = serviceResponse.data.id;
        const proofResponse = await axios.post("/api/proofs", { photo: ipfsPathPON, service_id })
        console.log(proofResponse)
        const user = await axios.get(`/api/users/${userID}`);
        console.log(user)
        const existingServices = user.data.user.services;
        existingServices.push(service_id);
        const updateRes = await axios.put(`/api/users/${userID}`, { services: existingServices })
        if (proofResponse.status === 200 && updateRes.status === 200) {
          toast.success("Service registration sent to admins. Administrators will look over your request.", toastOption)
          setDisabled(false);
          setTimeout(() => { router.push("/provider/myservices") }, 1000);
        } else {
          console.error("Service registration failed:", proofResponse.data);
          toast.error("Service registration failed", toastOption);
        }
      }
    } catch (err) {
      setDisabled(false);
      toast.error("Request timed out. Please try again.", toastOption)
      console.log(err)
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="absolute top-20 left-0 bg-[url('/Vector.png')] bg-contain h-vectorHeight w-full z-[-1]"></div>
      <div className="min-h-custom mx-36 flex items-center">
        <div className="my-12 w-full h-full flex justify-around items-center">
          <div className="flex flex-col justify-center gap-5">
            <h1 className="font-extrabold text-6xl w-subheader">Empower Your Service Contributions</h1>
            <h5 className="font-medium w-miniheader">Join a community of providers and offer your expertise to beneficiaries around the world through our XRPL-powered platform.</h5>
          </div>
          <div className="container bg-veryDarkGreenish p-5 rounded w-miniheader shadow shadow-slate-800">
            <h2 className="font-bold text-xl my-4 text-center">Regiser Service</h2>
            <form className="flex flex-col gap-4">
              <div><input type="text" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Service Name" onChange={(e) => setName(e.target.value)} value={name} /></div>
              <div><textarea spellCheck="false" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Service Description" onChange={(e) => setDescription(e.target.value)} value={description} /></div>
              <div><input type="text" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Location" onChange={(e) => setLocation(e.target.value)} value={location} /></div>
              <div>
                <label className="block text-gray-400 mb-2">Specify how much XRP would cost to avail your service for a day:</label>
                <input type="text" className="w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Price per day of service (XRP)"
                  onChange={(e) => {
                    const reg = /^[0-9]*\.?[0-9]*$/;
                    if (e.target.value === "" || reg.test(e.target.value)) {
                      setPrice(e.target.value)
                    }
                  }}
                  value={pricePerDay} />
              </div>
              <div>
                <label className="block text-gray-400 mb-3">Proof of need (documentation of the financial situation or proof of status (ex. a refugee, disaster victaim)):</label>
                <div className="w-full border border-slate-500 rounded bg-inpBg">
                  <input className="w-3/4 p-3 file:cursor-pointer" type="file" onChange={(e) => setFileInputPON(e.target.files[0])} />
                  <button className="p-3 w-1/4 bg-darkGreenish rounded" onClick={(e) => { e.preventDefault(); handlePONUpload() }}>Upload</button>
                </div>
                {ipfsPONLoading ? <div className="w-full h-48 flex justify-center items-center"><div className="loader"></div></div> :
                  <p className="mt-2 text-sm break-words">IPFS path generated: <span className="text-slate-400">{ipfsPathPON === '' ? 'Upload file to generate IPFS path' : ipfsPathPON} </span></p>
                }
              </div>
              <div>
                <label className="block text-gray-400 mb-3">Image:</label>
                <div className="w-full border border-slate-500 rounded bg-inpBg">
                  <input className="w-3/4 p-3 file:cursor-pointer" type="file" onChange={(e) => setFileInputImage(e.target.files[0])} />
                  <button className="p-3 w-1/4 bg-darkGreenish rounded" onClick={(e) => { e.preventDefault(); handleUploadImage() }}>Upload</button>
                </div>
                {ipfsIMGLoading ? <div className="w-full h-48 flex justify-center items-center"><div className="loader"></div></div> :
                  <p className="mt-2 text-sm break-words">IPFS path generated: <span className="text-slate-400">{ipfsPathImage === '' ? 'Upload file to generate IPFS path' : ipfsPathImage} </span></p>
                }
              </div>
              <button className="p-3 bg-darkGreenish rounded" disabled={disabled} onClick={(e) => { e.preventDefault(); handleService() }}>Register Service</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
