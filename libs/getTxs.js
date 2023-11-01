import axios from "axios";

export default async function getTxs() {
    try {
        const res = await axios.get("/api/transactions", { cache: "no-store" });
        if (res.status != 201) {
            throw new Error("Failed to fetch transactions")
        }
        const transactions = res.data.transactions;
        return transactions;
    } catch (err) {
        console.log(err)
    }
}