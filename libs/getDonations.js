import axios from "axios";

export default async function getDonations() {
    try {
        const res = await axios.get("/api/donations", { cache: "no-store" });
        if (res.status != 201) {
            throw new Error("Failed to fetch donations")
        }
        const donations = res.data.donations;
        return donations;
    } catch (err) {
        console.log(err)
    }
}