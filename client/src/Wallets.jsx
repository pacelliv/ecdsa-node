import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { AiOutlineCheck } from "react-icons/ai";
import { MdOutlineContentCopy } from "react-icons/md";
import { useEffect, useState } from "react";
import { handleClick } from "../lib/utils";

export default function Wallets({ profiles, connected, setConnected }) {
  const [windowWith, setWindowWidth] = useState(0);

  /**
   * This function add commas to a number using the `Intl.NumberFormat()` method.
   * @param num Number to format.
   * @returns The formatted number with commas.
   */
  function addCommas(num) {
    const numFor = Intl.NumberFormat("en-US");
    return numFor.format(num);
  }

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return function () {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="container">
      <h2>Accounts</h2>
      {profiles.map(({ balance, address, publicKey, privateKey }) => (
        <>
          <div key={address} className="container-addresses">
            <div
              onClick={() => setConnected(address)}
              className={`container-address ${
                connected === address ? "connected" : ""
              }`}
            >
              <Jazzicon diameter={25} jsNumberForAddress={address} />
              {`0x${
                windowWith < 725
                  ? address.slice(0, 7) + "..." + address.slice(-7)
                  : address
              }`}
            </div>
            <div>
              <button
                id={`${address}`}
                onClick={(event) => {
                  navigator.clipboard.writeText(`0x${address}`);
                  handleClick(event, address);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <MdOutlineContentCopy className="icon show" />
                <AiOutlineCheck className="icon hidden" />
              </button>
            </div>
          </div>
          <div className="container-balance">
            Token balance: {addCommas(balance)}
          </div>
        </>
      ))}
    </div>
  );
}
