"use client"
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
const getProjects = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/projects", { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch projects")
    }
    const prjs = res.json()
    return prjs;
  } catch (error) {
    console.log("Error loading projects: ", error);
  }
}

const Home = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [prjLoading, setPrjLoading] = useState(true);
  async function fetchProjects() {
    try {
      const allprjs = await getProjects();
      setFilteredProjects(allprjs.projects.filter((project) => {
        const projectName = project.name.toLowerCase();
        return projectName.includes(searchQuery.toLowerCase());
      }))
      setPrjLoading(false)
    } catch (error) {
      console.error("Error fetching projects: ", error);
    }
  }
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

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
      <div className="min-h-screen mx-36 py-6">
        <div className="flex justify-around items-center py-40">
          <div className="flex flex-col gap-5">
            <h1 className="font-extrabold text-6xl w-header drop-shadow-custom z-[-1]">A Dedicated Space for Providers to Catalyze Change</h1>
            <h5 className="font-semibold text-lg w-subheader">By offering your expertise, resources, and support, you enable beneficiaries to access the opportunities and assistance they need to thrive and achieve their goals. </h5>
          </div>
          <Image className="h-miniheader w-miniheader" src={"/bulb.png"} height={1000} width={1000} alt="idea" />
        </div>
        <hr className="border-t-neutral-400"></hr>
        <div className="py-12">
          <h1 className="font-bold text-2xl">Projects</h1>
          <div className="w-full h-12 flex justify-between gap-6 mt-4">
            <input
              className="h-full w-11/12 rounded text-dark bg-whitish p-3"
              type="text"
              placeholder="Search for fundraising projects"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="p-3 w-1/12 bg-darkGreenish rounded">Search</button>
          </div>
          <Suspense fallback={<><div className="h-96 w-full flex items-center justify-center"><div className="loader"></div></div></>}>
            <div className="my-12 flex flex-wrap gap-10">
              {/* <ProjectContainer promise={filteredProjects} /> */}
              {!prjLoading ? ((filteredProjects.length === 0 ||
                filteredProjects.every(project => project.status === "pending")) ? (
                <div>
                  <h1 className="text-xl font-medium">No Projects Available</h1>
                </div>
              ) :
                Promise.all(
                  filteredProjects.map(async (project, index) => {
                    if (project.status !== "pending") {
                      const user = await axios.get(`/api/users/${project.beneficiary}`)
                      return <div key={index} className="flex flex-col gap-2 w-96 bg-whitish text-dark rounded">
                        <div className="flex gap-3 mt-2 px-3 items-center">
                          <Image className="rounded-full w-10 h-10 object-cover" src={user.data.user.photo} width={100} height={100} alt="prof" />
                          <div>
                            <h3 className="font-bold">{project.name}</h3>
                            <h5 className="font-medium text-xs text-gray-500">{project.status === "approved" ? "In progress" : project.status === "completed" ? "Completed" : "Pending Approval"}</h5>
                          </div>
                        </div>
                        <Image className="w-full h-96 object-cover" src={project.photo} width={1200} height={1200} alt="prof" />
                        <div className="pt-2 pb-6 px-6 flex flex-col gap-3">
                          <p className="text-sm">{project.description.slice(0, 118)}...</p>
                          <div>
                            <div className="text-lightGreenish text-xs">{calcProgress(project.amountRaised, project.targetAmount)}%</div>
                            <div className="w-full h-3 rounded-full bg-gray-400"><div style={{ width: `${calcProgressbar(project.amountRaised, project.targetAmount)}%` }} className="h-full rounded-full bg-lightGreenish"></div></div>
                            <p className="text-sm"><strong>{project.amountRaised} XRP</strong> raised out of <strong>{project.targetAmount} XRP</strong></p>
                          </div>
                          <button onClick={() => router.push(`/provider/${project._id}`)} className="p-3 bg-darkGreenish rounded text-whitish">View</button>
                        </div>
                      </div>
                    }
                  })
                )) : <div className="flex justify-center items-center h-96 w-full">
                <div className="loader"></div>
              </div>
              }
            </div>
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default Home;
