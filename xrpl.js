"use client"
import Header from "../components/indexNav";
import { useState, useEffect } from "react";
const xrpl = require("xrpl")

const getTransactions = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/transactions", { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch transactions")
    }
    const txs = res.json()
    return txs;
  } catch (error) {
    console.log("Error loading transactions: ", error);
  }
}

async function sendXRP(amount) {
  try {
    if (amount <= 0) {
      alert("Amount can't be less than or equal to 0")
      return;
    }
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    // const fund_result = await client.fundWallet()
    // const test_wallet = fund_result.wallet
    // console.log(fund_result)
    // const test_wallet = xrpl.Wallet.generate()
    const test_wallet = xrpl.Wallet.fromSeed("sEdS7oeAQ5j5aUjhwemgPe4kKaoDnqi")
    // console.log(test_wallet)
    // Prepare transaction -------------------------------------------------------    
    const prepared = await client.autofill({
      "TransactionType": "Payment",
      "Account": test_wallet.address,
      "Amount": xrpl.xrpToDrops(amount),
      "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
    })

    // // Sign prepared instructions ------------------------------------------------
    const signed = test_wallet.sign(prepared)
    // // console.log("Identifying hash:", signed.hash)
    // // console.log("Signed blob:", signed.tx_blob)
    // // Submit signed blob --------------------------------------------------------
    const tx = await client.submitAndWait(signed.tx_blob);

    console.log(tx.result.hash);
    console.log(tx)
    if (tx.result.meta.TransactionResult === "tesSUCCESS") {
      try {
        const res = await fetch("http://localhost:3000/api/transactions", {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({ transaction_hash: tx.result.hash, amount: amount, from: test_wallet.address, to: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe" })
        });

        if (!res.ok) {
          throw new Error("Failed to record transaction");
        }
        console.log(res);
        alert("TX recorded successfully!");
      } catch (error) {
        console.log("Error fetching transactions: ", error);
      }
    } else {
      console.error("Transaction failed with result:", tx.result.meta.TransactionResult);
    }


    // // Check transaction results -------------------------------------------------
    // console.log("Transaction result:", tx.result.meta.TransactionResult)
    // console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))


    // let response = await client.request({
    //   "command": "account_info",
    //   "account": test_wallet.address,
    //   "ledger_index": "validated"
    // })
    // console.log(response)

    await client.disconnect()
  } catch (err) {
    console.log(err)
  }
}

async function createEscrow(sender_address, sendAmount, escrow_cancel_date, destination_address, condition) {
  const escrowTx = await client.autofill({
    "TransactionType": "EscrowCreate",
    "Account": sender_address,
    "Amount": xrpl.xrpToDrops(sendAmount),
    "Destination": destination_address,
    "CancelAfter": escrow_cancel_date,
    "Condition": condition
  })
  const signed = standby_wallet.sign(escrowTx)
  const tx = await client.submitAndWait(signed.tx_blob)
  //then store this in db: tx.result.Sequence
}



export default function Home() {

  const [amount, setAmount] = useState(0);
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };
  useEffect(() => {
    async function fetchAndLogTransactions() {
      try {
        const transactions = await getTransactions();
        console.log(transactions.transactions[1].transaction_hash);
        // FETCHING SPECIFIC TRANSACTION
        const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
        await client.connect()
        const response = await client.request({
          command: "tx",  // Specify the command as "tx"
          transaction: transactions.transactions[1].transaction_hash,
        });
        console.log(response);
        client.disconnect()
      } catch (error) {
        console.error("Error fetching transactions: ", error);
      }
    }

    // Call the async function only once on component mount
    fetchAndLogTransactions();
  }, []); // Empty dependency array to run only once on mount

  return (
    <>
      <Header />
      <div className="m-6 p-3 flex flex-col gap-2 min-h-screen">
        <div>
          <label className="font-bold text-2xl">My Project</label>
          <p>This is a test project description and you can just ignore this. Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, inventore?</p>
          <input className="p-3 text-black rounded" onChange={handleAmountChange} type="number" placeholder="XRP Amount" min={0} />
          <button className="ml-4 p-3 bg-darkGreenish rounded" onClick={() => sendXRP(amount)}>Send</button>
        </div>
      </div>
    </>
  );
}
