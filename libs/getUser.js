// import axios from "axios";

export default async function getUser(id) {
    try {
        // const res = await axios.get("/api/users", { cache: "no-store" });
        // if (res.status != 201) {
        //     throw new Error("Failed to fetch users")
        // }
        const res = await fetch(`http://localhost:3000/api/users/${id}`)
        if (!res.ok) {
            throw new Error("failed to fetch")
        }

        const user = await res.json()
        return user;

        // const users = res.data.users;
        // return users;
    } catch (err) {
        console.log(err)
    }
}