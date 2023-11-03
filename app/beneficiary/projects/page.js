// This page displays all the projects that the beneficiary has created

"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
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

const Project = () => {
  const router = useRouter();
  const [projects, setProjects] = useState("");
  const [prjLoading, setPrjLoading] = useState(true);

  async function handleGetProjects() {
    try {
      const token = await axios.get("/api/users/token"); // getting the decoded token details from the cookies
      const user_id = token.data.decodedToken.id;
      const user = await axios.get("/api/users/" + user_id); // getting the details of the logged in user
      let projects = []
      await Promise.all(
        user.data.user.projects.map(async (project) => {
          const response = await axios.get(`/api/projects/${project}`);
          projects.push(response.data.project);
        })
      );
      setProjects(projects)
      setPrjLoading(false);
    } catch (err) {
      console.log(err)
      toast.error(err, toastOption)
    }
  }

  useEffect(() => {
    handleGetProjects()
  }, [])

  function calcProgress(amountRaised, targetAmount) {
    return ((amountRaised / targetAmount) * 100).toFixed(2);
  }

  function calcProgressbar(amountRaised, targetAmount) {
    let percent = ((amountRaised / targetAmount) * 100).toFixed(2);
    if (percent >= 100) return 100;
    return percent;
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen mx-36 py-6">
        <h1 className="text-2xl font-semibold mt-6">My Projects</h1>
        <div className="my-6 flex flex-wrap gap-10">
          {!prjLoading ? (
            projects.length === 0 ? (
              <div>
                <h1 className="text-xl font-medium">No Projects Available</h1>
              </div>
            ) : (
              projects.map((project, index) => (
                <div key={index} className="flex flex-col gap-2 w-96 bg-whitish text-dark rounded">
                  <div key={index} className="flex flex-col gap-2 w-96 bg-whitish text-dark rounded">
                    <div className="flex gap-3 mt-2 px-6 items-center">
                      <div>
                        <h3 className="font-bold text-sm">{project.name}</h3>
                        <h5 className="font-medium text-xs text-gray-500">{project.status === "approved" ? "In progress" : project.status === "completed" ? "Completed" : "Pending Approval"}</h5>
                      </div>
                    </div>
                    <Image className="w-full h-96 object-cover" src={project.photo} width={1200} height={1200} alt="Loading Image..." />
                    <div className="pt-2 pb-6 px-6 flex flex-col gap-3">
                      <p className="text-sm">{project.description.slice(0, 125)}...</p>
                      <div>
                        <div className="text-lightGreenish text-xs">{calcProgress(project.amountRaised, project.targetAmount)}%</div>
                        <div className="w-full h-3 rounded-full bg-gray-400"><div style={{ width: `${calcProgressbar(project.amountRaised, project.targetAmount)}%` }} className="h-full rounded-full bg-lightGreenish"></div></div>
                        <p className="text-sm"><strong>{project.amountRaised} XRP</strong> raised out of <strong>{project.targetAmount} XRP</strong></p>
                      </div>
                      <button className="p-3 bg-darkGreenish rounded text-whitish" onClick={() => router.push(`/beneficiary/projects/${project._id}`)}>View</button>
                    </div>
                  </div>
                </div>
              ))
            )
          ) :
            <div className="flex justify-center items-center h-96 w-full">
              <div className="loader"></div>
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default Project;
