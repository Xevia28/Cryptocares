// This page shows the details of the project selected in the explore page

"use client"
import axios from "axios";
import Image from "next/image";
import Header from "@/components/indexNav";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
const ProjectPage = ({ params }) => {
    const projectId = params.id;
    const router = useRouter();
    const [project, setProject] = useState("");
    // const [user, setUser] = useState("");
    const [donations, setDonations] = useState("");

    async function getProjectDetails(id) {
        try {
            const project = await axios.get(`/api/projects/${id}`)
            setProject(project.data.project);
            // console.log(project.data.project)
            // const user = await axios.get(`/api/users/${project.data.project.beneficiary}`)
            // setUser(user.data.user)
            // console.log(user.data.user)
            const allDonations = await axios.get("/api/donations")
            const donations = []
            for (const donation of allDonations.data.donations) {
                if (donation.project === project.data.project._id) {
                    donations.push(donation)
                }
            }
            setDonations(donations)
        } catch (err) {
            toast.error("Error fetching project details.")
            console.log(err)
        }
    }

    useEffect(() => {
        getProjectDetails(projectId)
    }, [projectId])

    function calcProgress(amountRaised, targetAmount) {
        return ((amountRaised / targetAmount) * 100).toFixed(2);
    }

    function calcProgressbar(amountRaised, targetAmount) {
        let percent = ((amountRaised / targetAmount) * 100).toFixed(2);
        if (percent >= 100) return 100;
        return percent;
    }

    function getDate(dateString) {
        let date = new Date(dateString);
        let day = date.getDate();
        let month = date.toLocaleString('default', { month: 'long' });
        let year = date.getFullYear();
        let formattedDate = `${day} ${month} ${year}`;
        return (formattedDate);
    }


    return (
        <>
            <Header />
            {/* {(user &&  */}
            {(project && donations) ?
                <div className="min-h-screen mx-36 py-10">
                    <div>
                        <h5 className="text-sm font-medium text-gray-400">Active</h5>
                        <h1 className="text-xl font-semibold">{project.name}</h1>
                        <div className="flex justify-berween gap-20 mt-5">
                            <div className="flex flex-col w-5/12 gap-5">
                                <Image className="h-96 w-full object-cover rounded" height={1000} width={1000} src={project.photo} alt="Loading..." />
                                <div className="flex flex-col gap-1">
                                    <span>{calcProgress(project.amountRaised, project.targetAmount)}%</span>
                                    <div className="w-full h-2 rounded-full bg-gray-400"><div style={{ width: `${calcProgressbar(project.amountRaised, project.targetAmount)}%` }} className="h-full rounded-full bg-lightGreenish"></div></div>
                                    <p className=""><strong>{project.amountRaised} XRP</strong> raised out of <strong>{project.targetAmount} XRP</strong></p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-gray-400">Total Donations: <span className="text-white">{donations.length}</span></span>
                                    <span className="text-sm text-gray-400">Location: <span className="text-white">{project.location}</span></span>
                                    {/* <span className="text-sm text-gray-400">Project Manager: <span className="text-white">{user.name}</span></span> */}
                                    <span className="text-sm text-gray-400">Launched: <span className="text-white">{getDate(project.start_date)}</span></span>
                                    <span className="text-sm text-gray-400">Ends: <span className="text-white">{getDate(project.end_date)}</span></span>
                                </div>
                                <div>
                                    <button onClick={() => router.push("/signup")} className="rounded bg-darkGreenish py-3 px-10">Donate Now</button>
                                </div>
                            </div>
                            <div className="break-words w-7/12">
                                <h2 className="text-lg font-semibold">Project Overview</h2>
                                {project.description.split('\n').map((paragraphText, index) => (
                                    <p key={index} className="text-md font-light text-gray-400 mt-2 mb-4">
                                        {paragraphText}
                                    </p>
                                ))}
                                <p className="text-md font-light text-gray-400 mt-2 mb-4">Wallet address : {project.wallet_addr}</p>
                            </div>
                        </div>
                    </div>
                    <hr className="border-t-neutral-400 my-10"></hr>
                    <div className="mb-10">
                        <h1 className="text-xl font-semibold mb-5">Previous Donations</h1>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Transaction
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Donor
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donations.map((donation, key) => {
                                        return (
                                            <tr key={key} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <td className="px-6 py-4">
                                                    {donation.transaction_hash}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {donation.amount} XRP
                                                </td>
                                                <td className="px-6 py-4">
                                                    {donation.donor}
                                                </td>
                                            </tr>)
                                    })}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div > :
                <div className="flex justify-center items-center h-custom w-full">
                    <div className="loader"></div>
                </div>
            }
            <Footer />
        </>
    );
}

export default ProjectPage;