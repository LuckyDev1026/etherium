import { useState } from "react";
import { ethers } from "ethers";
import FunToken from "./abis/erc20.json";
import { useAccount } from "wagmi";

const tokenAddress = "0xeE0D7578e8BE7a0868cF54b2b29AF71C01d08468";

let signer = null;

let provider;
if (window.ethereum == null) {
  console.log("MetaMask not installed; using read-only defaults");
  provider = ethers.getDefaultProvider();
} else {
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
}

const tokenContract = new ethers.Contract(tokenAddress, FunToken.abi, signer);

export function SendTransaction() {
  const { address } = useAccount();
  const [balance, setBalance] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [isPending, setIsPending] = useState(false);

  tokenContract.balanceOf(address).then((result) => {
    setBalance(result.toString());
  });

  async function submit(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const to = formData.get("address");
    const value = formData.get("value");

    setIsPending(true);
    const tx = await tokenContract.transfer(
      to,
      ethers.parseUnits(value?.toString() ?? "0.0", 18)
    );
    console.log(tx)
    setTransactionHash(tx.hash);
    await tx.wait();
    setIsPending(false);
  }

  const Mint = () => {
    tokenContract.mint(
      "0x8743F8Fccc7abEB47037d825CcaFbE2E36d2ef5E",
      BigInt(100 * 10 ** 18)
    );
  };

  return (
    <>
      <form onSubmit={(e) => submit(e)}>
        <div>Balance: {balance}</div>
        <input name="address" placeholder="0xA0Cf…251e" required />
        <input name="value" placeholder="0.05" required />
        <button disabled={isPending} type="submit">
          {isPending ? "Confirming..." : "Send"}
        </button>
        {transactionHash && <div>Transaction Hash: {transactionHash}</div>}
      </form>
      <button onClick={Mint}>Mint</button>
    </>
  );
}
