import axios from "axios";

export default async function getEscrows() {
    try {
        const res = await axios.get("/api/escrows", { cache: "no-store" });
        if (res.status != 201) {
            throw new Error("Failed to fetch escrows")
        }
        const escrows = res.data.escrows;
        return escrows;
    } catch (err) {
        console.log(err)
    }
}