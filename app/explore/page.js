"use client"
import Header from "@/components/indexNav";
import Image from "next/image";
import { useEffect, useState } from "react";
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

const Explore = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    async function fetchProjects() {
      try {
        const allprjs = await getProjects();
        console.log(allprjs.projects)
        setProjects(allprjs.projects)
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    }

    fetchProjects();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen mx-36 py-10">
        <h1 className="font-bold text-2xl">All Projects</h1>
        <div className="w-full h-12 flex justify-between gap-6 mt-4">
          <input className="h-full w-11/12 rounded text-dark bg-whitish p-3" type="text" placeholder="Search for fundraising projects" />
          <button className="p-3 w-1/12 bg-darkGreenish rounded">Search</button>
        </div>
        <div className="my-12 flex flex-wrap gap-10">
          {projects.map((project, index) => (
            <div key={index} className="flex flex-col gap-2 w-96 bg-whitish text-dark rounded">
              <div className="flex gap-3 mt-2 px-3 items-center">
                <Image className="rounded-full w-10 h-10 object-cover" src={"/profile.jpg"} width={20} height={20} alt="prof" />
                <div>
                  <h3 className="font-bold">{project.name}</h3>
                  <h5 className="font-medium text-sm text-gray-500">In progress</h5>
                </div>
              </div>
              <Image className="w-full" src={"/profile.jpg"} width={20} height={20} alt="prof" />
              <div className="pt-2 pb-6 px-6 flex flex-col gap-3">
                <p className="font-xs">Highly rated charities providing relief and recovery of those who need the resources to build their projects...</p>
                <div>
                  <div className="text-lightGreenish">50%</div>
                  <div className="w-full h-3 rounded-full bg-gray-400"><div className="w-1/2 h-full rounded-full bg-lightGreenish"></div></div>
                  <p>12.4 XRP raised out of 200 XRP</p>
                </div>
                <button className="p-3 bg-darkGreenish rounded text-whitish">View</button>
              </div>
            </div>
          ))}


        </div>
      </div>
    </>
  );
};

export default Explore;
