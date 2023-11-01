"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@/components/showModal";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const xrpl = require("xrpl")

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

const Create = () => {
  const [disabled, setDisabled] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [end_date, setDeadline] = useState("");
  const [fileInputPON, setFileInputPON] = useState('');
  const [fileInputImage, setFileInputImage] = useState('');
  const [ipfsPathPON, setIpfsPathPON] = useState('');
  const [ipfsPathImage, setIpfsPathImage] = useState('');
  const [userID, setUserID] = useState();
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasProject, setHasProject] = useState("loading");
  const [ipfsPONLoading, setIpfsPONLoading] = useState(false);
  const [ipfsIMGLoading, setIpfsIMGLoading] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  async function handleUserDetails() {
    const token = await axios.get("/api/users/token");
    const user_id = token.data.decodedToken.id;
    setUserID(user_id);
    const user = await axios.get("/api/users/" + user_id);
    if (user.data.user.projects.length === 0) {
      setHasProject("false")
      return;
    }
    const project = await axios.get(`/api/projects/${user.data.user.projects[user.data.user.projects.length - 1]}`)
    if (project.data.project.status === "completed") {
      setHasProject("false");
      return;
    }
    setHasProject("loaded")
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

  async function handleCreateProject() {
    if (!name || !description || !amount || !location || !end_date || !fileInputPON || !fileInputImage) {
      toast.error("Please fill all the fields!", toastOption)
      return;
    }
    if (!ipfsPathPON || !ipfsPathImage) {
      toast.error("Please upload both the files to get the IPFS Path.", toastOption)
      return;
    }
    if (name.length >= 50) {
      toast.error("Please provide a title with length upto only 50 characters!", toastOption)
      return;
    }
    var today = new Date().toISOString().split('T')[0];
    if (end_date <= today) {
      toast.error("Please select a date after today!", toastOption);
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
      const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
      await client.connect()
      const testWallet = await client.fundWallet(0);
      setData(testWallet.wallet);
      setShowModal(true);
      const projectResponse = await axios.post("/api/projects", { name, description, location, targetAmount: amount, end_date, wallet_addr: testWallet.wallet.address, seed: testWallet.wallet.seed, photo: ipfsPathImage, beneficiary: userID });
      console.log(projectResponse)
      if (projectResponse.status === 200 || projectResponse.status === 201) {
        toast.info("Almost there!", toastOption)
        const proj_id = projectResponse.data.id;
        const proofResponse = await axios.post("/api/proofs", { photo: ipfsPathPON, proj_id })
        const user = await axios.get(`/api/users/${userID}`);
        console.log(user)
        const existingProjects = user.data.user.projects;
        existingProjects.push(proj_id);
        console.log(existingProjects)
        const updateRes = await axios.put(`/api/users/${userID}`, { projects: existingProjects })
        if (proofResponse.status === 200 && updateRes.status === 200) {
          toast.success("Project creation sent to admins. Administrators will look over your request.", toastOption)
          setTimeout(() => {
            setName("")
            setDescription("")
            setLocation("")
            setAmount("")
            setDeadline("")
            setIpfsPathImage("")
            setIpfsPathPON("")
            setDisabled(false)
          }, 1000);
        }
      }
    } catch (err) {
      console.log(err)
      setDisabled(false);
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
      <ToastContainer />
      {showModal && <Modal data={data} onClose={closeModal} />}
      {hasProject === "loading" ? <div className="flex justify-center items-center h-custom w-full">
        <div className="loader"></div>
      </div> : hasProject === "false" ? <>
        <div className="absolute top-20 left-0 bg-[url('/Vector.png')] bg-contain h-vectorHeight w-full z-[-1]"></div>
        <div className="min-h-custom mx-36 flex items-center">
          <div className="my-12 w-full h-full flex justify-around items-center">
            <div className="flex flex-col justify-center gap-5">
              <h1 className="font-extrabold text-6xl w-subheader">Start a Ripple, Make a Wave</h1>
              <h5 className="font-medium w-miniheader">Create Inspiring Campaigns with Blockchain Technology. Create, Share, and Amplify with the XRP Ledger.</h5>
            </div>
            <div className="container bg-veryDarkGreenish p-5 rounded w-miniheader shadow shadow-slate-800">
              <h2 className="font-bold text-xl my-4 text-center">Create Project</h2>
              <form className="flex flex-col gap-4">
                <div><input type="text" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Project Name" onChange={(e) => setName(e.target.value)} value={name} /></div>
                <div><textarea spellCheck="false" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Project Description" onChange={(e) => setDescription(e.target.value)} value={description} /></div>
                <div><input type="text" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Location" onChange={(e) => setLocation(e.target.value)} value={location} /></div>
                <div>
                  <input type="text" min={0} className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Target Amount (XRP)"
                    onChange={(e) => {
                      const reg = /^[0-9]*\.?[0-9]*$/;
                      if (e.target.value === "" || reg.test(e.target.value)) {
                        setAmount(e.target.value)
                      }
                    }}
                    value={amount} />
                </div>
                <div>
                  <label className="block text-gray-400 mb-3">Project Deadline:</label>
                  <input onChange={(e) => setDeadline(e.target.value)} value={end_date} type="date" className="w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-3">Proof of need (documentation of the financial situation or proof of status (ex. a refugee, disaster victim)):</label>
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
                <button className="p-3 bg-darkGreenish rounded" onClick={(e) => { e.preventDefault(); handleCreateProject() }} disabled={disabled}>Create Project</button>
              </form>
            </div >
          </div >
        </div >
      </> : <div className="min-h-screen mx-36">
        <h1 className="font-semibold text-xl mt-10 text-gray-400">You already have an active or a pending project. You can only create one project at a time.</h1>
      </div>}
    </>
  );
};

export default Create;
