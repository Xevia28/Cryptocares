import axios from "axios";

export default async function getProjects() {
    try {
        const res = await fetch("http://localhost:3000/api/projects")
        if (!res.ok) {
            throw new Error("failed to fetch")
        }
        // const res = await axios.get("/api/projects", { cache: "no-store" });
        // if (res.status != 201) {
        //     throw new Error("Failed to fetch projects")
        // }
        // const projects = res.data.projects;
        // return projects;
        const prjs = await res.json()
        return prjs.projects;
    } catch (err) {
        console.log(err)
    }
}