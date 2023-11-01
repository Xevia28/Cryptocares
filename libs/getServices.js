import axios from "axios";

export default async function getServices() {
    try {
        const res = await axios.get("/api/services", { cache: "no-store" });
        if (res.status != 201) {
            throw new Error("Failed to fetch services")
        }
        const services = res.data.services;
        return services;
    } catch (err) {
        console.log(err)
    }
}