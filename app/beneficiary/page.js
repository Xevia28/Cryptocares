"use client"
import axios from "axios";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
const getServices = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/services", { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch services")
    }
    const services = res.json()
    return services;
  } catch (error) {
    console.log("Error loading projects: ", error);
  }
}

const Home = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceLoaded, setServicesLoaded] = useState(false);

  async function fetchServices() {
    try {
      const allservices = await getServices();
      // console.log(allservices)
      setFilteredServices(allservices.services.filter((service) => {
        const serviceName = service.name.toLowerCase();
        return serviceName.includes(searchQuery.toLowerCase());
      }))
      setServiceLoading(false)
      setServicesLoaded(true)
    } catch (error) {
      setServicesLoaded(false)
      console.error("Error fetching services: ", error);
    }
  }
  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <>
      <div className="min-h-screen mx-36 py-6">
        <div className="flex justify-around items-center py-28">
          <div className="flex flex-col gap-5">
            <h1 className="font-extrabold text-6xl w-header drop-shadow-custom z-[-1]">Your Gateway to Decentralized Giving</h1>
            <h5 className="font-semibold text-lg w-subheader">A New Era of Trustworthy and Inclusive Charitable Support. Together, we can shape a new era of compassion, unity, and hope.</h5>
          </div>
          <Image className="h-miniheader w-miniheader" src={"/1im.png"} height={1000} width={1000} alt="trust" />
        </div>
        <hr className="border-t-neutral-400"></hr>
        <div className="py-12">
          <h1 className="font-bold text-2xl">Services</h1>
          <div className="w-full h-12 flex justify-between gap-6 mt-4">
            <input
              className="h-full w-11/12 rounded text-dark bg-whitish p-3"
              type="text"
              placeholder="Search for services offered by providers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="p-3 w-1/12 bg-darkGreenish rounded">Search</button>
          </div>
          <Suspense fallback={<><div className="h-96 w-full flex items-center justify-center"><div className="loader"></div></div></>}>
            <div className="my-12 flex flex-wrap gap-10">
              {/* <ProjectContainer promise={filteredProjects} /> */}
              {!serviceLoading ? ((filteredServices.length === 0 ||
                filteredServices.every(service => service.status === "pending")) ? (
                <div>
                  <h1 className="text-xl font-medium">No Services Available</h1>
                </div>
              ) :
                Promise.all(
                  filteredServices.map(async (service, index) => {
                    if (service.status !== "pending") {
                      const user = await axios.get(`/api/users/${service.provider}`)
                      return <div key={index} className="flex flex-col gap-2 w-96 bg-whitish text-dark rounded">
                        <div className="flex gap-3 mt-2 px-6 py-1 items-center">
                          <Image className="rounded-full w-10 h-10 object-cover" src={user.data.user.photo} width={100} height={100} alt="Loading..." />
                          <div>
                            <h3 className="font-bold text-sm">{service.name}</h3>
                            <h5 className="font-medium text-xs text-gray-500">{service.status === "approved" ? "In progress" : service.status === "completed" ? "Completed" : "Pending Approval"}</h5>
                          </div>
                        </div>
                        <Image className="w-full h-96 object-cover" src={service.photo} width={1200} height={1200} alt="prof" />
                        <div className="pt-2 pb-6 px-6 flex flex-col gap-3">
                          <p className="text-sm">{service.description.slice(0, 125)}...</p>
                          <button className="p-3 bg-darkGreenish rounded text-whitish" onClick={() => router.push(`/beneficiary/${service._id}`)}>View</button>
                        </div>
                      </div>
                    }
                  })
                )) : (serviceLoaded ? <div className="flex justify-center items-center h-96 w-full">
                  <div className="loader"></div>
                </div> : <p className="text-red-500 text-2xl font-medium w-full text-center">Failed to fetch services. Please refresh the page once!</p>)}
            </div>
          </Suspense>
        </div>
      </div >
    </>
  );
};

export default Home;
