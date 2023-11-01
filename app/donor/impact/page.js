"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Impact = () => {
  const router = useRouter();
  const [donations, setDonations] = useState("")
  async function handleImpactDetails() {
    const token = await axios.get("/api/users/token");
    const user_id = token.data.decodedToken.id;
    const user = await axios.get(`/api/users/${user_id}`)
    const donationRes = await axios.get("/api/donations");
    let userDonations = []
    for (const res of donationRes.data.donations) {
      // console.log(res.donor)
      // console.log(user.data.user.wallet_addr)
      if (res.donor === user.data.user._id) {
        userDonations.push(res)
      }
    }
    setDonations(userDonations)
    // setUser(user.data.user);

  }

  useEffect(() => {
    handleImpactDetails();
  }, [])

  return (
    <>
      <div className="min-h-screen mx-36 py-10">
        {donations ?
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Transaction
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {donations && (donations.length === 0 ? <tr><td className="pt-5 text-2xl">You have not made any donations</td></tr> : Promise.all(
                  donations.map(async (donation, key) => {
                    const prj = await axios.get(`/api/projects/${donation.project}`);
                    return (
                      <tr key={key} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">
                          {donation.transaction_hash}
                        </td>
                        <td className="px-6 py-4">
                          {donation.amount} XRP
                        </td>
                        <td className="px-6 py-4">
                          {prj.data.project.name}
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => router.push(`/donor/${prj.data.project._id}`)} className="p-2 bg-darkGreenish text-white rounded">View</button>
                        </td>
                      </tr>
                    );
                  })
                ))}
              </tbody>
            </table>
          </div>
          : <div className="flex justify-center items-center h-96 w-full">
            <div className="loader"></div>
          </div>
        }
      </div>
    </>
  );
};

export default Impact;
