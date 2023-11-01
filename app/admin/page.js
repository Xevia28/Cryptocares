"use client"
import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [donors, setDonors] = useState("");
  const [beneficiaries, setBeneficiaries] = useState("");
  const [providers, setProviders] = useState("");
  const [admins, setAdmins] = useState("");
  const [donationCount, setDC] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  async function handleData() {
    const users = await axios.get("/api/users");
    const donations = await axios.get("/api/donations");
    const donationCount = donations.data.donations.length;
    let amt = 0;
    let arrDonors = []
    let arrBene = []
    let arrProv = []
    let arrAdm = []
    for (const user of users.data.users) {
      if (user.role === "donor") {
        arrDonors.push(user)
      } else if (user.role === "beneficiary") {
        arrBene.push(user)
      } else if (user.role === "provider") {
        arrProv.push(user)
      } else {
        arrAdm.push(user)
      }
    }
    for (const donation of donations.data.donations) {
      amt += parseFloat(donation.amount.toFixed(3))
    }
    setAmount(amt)
    setDC(donationCount)
    setDonors(arrDonors)
    setBeneficiaries(arrBene)
    setProviders(arrProv)
    setAdmins(arrAdm)
    setLoading(false)
  }
  useEffect(() => {
    handleData()
  }, [])

  return (
    <div className="h-[100vh] w-full bg-whitish overflow-y-auto">
      {loading ?
        <div className="flex justify-center items-center h-full w-full">
          <div className="loader"></div>
        </div> :
        <div className="w-full p-10 px-6 text-veryDarkGreenish flex sm:flex-row flex-wrap gap-x-6 " >
          <div className="w-full font-bold bg-adminsideNavColor rounded-sm h-[70px] border-b-4 border-orangeish text-whitish flex items-center px-10 text-2xl">
            Dashboard
          </div>
          <div className="w-full text-whitish bg-transSideNavColor p-10 flex justify-between items-center border-b-2 border-whitish">
            <div className="font-semibold">
              Total Donors
            </div>
            <div className="font-bold text-3xl">
              {donors.length}
            </div>
          </div>
          <div className="w-full text-whitish bg-transSideNavColor p-10 flex justify-between items-center border-b-2 border-whitish">
            <div className="font-semibold">
              Total Beneficiaries
            </div>
            <div className="font-bold text-3xl">
              {beneficiaries.length}
            </div>
          </div>
          <div className="w-full text-whitish bg-transSideNavColor p-10 flex justify-between items-center border-b-2 border-whitish">
            <div className="font-semibold">
              Total Providers
            </div>
            <div className="font-bold text-3xl">
              {providers.length}
            </div>
          </div>
          <div className="w-full text-whitish bg-transSideNavColor p-10 flex justify-between items-center border-b-2 border-whitish">
            <div className="font-semibold">
              Total Admins
            </div>
            <div className="font-bold text-3xl">
              {admins.length}
            </div>
          </div>
          <div className="w-full text-whitish bg-transSideNavColor p-10 flex justify-between items-center border-b-2 border-whitish">
            <div className="font-semibold">
              Total Amount Donated
            </div>
            <div className="font-bold text-3xl">
              {amount} XRP
            </div>
          </div>
          <div className="w-full text-whitish bg-transSideNavColor p-10 flex justify-between items-center border-b-2 border-whitish">
            <div className="font-semibold">
              Total Amount Donations
            </div>
            <div className="font-bold text-3xl">
              {donationCount}
            </div>
          </div>
        </div>
      }

    </div>);
};

export default Dashboard;
