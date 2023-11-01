import axios from "axios";

export default async function getProofs() {
    try {
        const res = await axios.get("/api/proofs", { cache: "no-store" });
        if (res.status != 201) {
            throw new Error("Failed to fetch proofs")
        }
        const proofs = res.data.proofs;
        return proofs;
    } catch (err) {
        console.log(err)
    }
}