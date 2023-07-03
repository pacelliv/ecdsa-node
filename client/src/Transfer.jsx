import { useState } from "react";
import server from "./server";
import { getHashedMsgAndSignature } from "../lib/sign";

function Transfer({ connected, setProfiles, profiles }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      let tx = {
        sender: sender.startsWith("0x") ? sender.slice(2) : sender,
        recipient: recipient.startsWith("0x") ? recipient.slice(2) : recipient,
        amount: parseInt(sendAmount),
      };

      const { hashMsg, signature } = getHashedMsgAndSignature(
        tx,
        profiles,
        connected
      );

      signature.addRecoveryBit(); // the signature's recovery bit is not included by default, this method will get it

      tx.profiles = profiles;
      tx.hashMsg = hashMsg;

      // Due to the type of the signature, we need to transform the signature outputs to string
      // and then the server can reconstruct the signature.
      tx.signature = {
        r: signature.r.toString(),
        s: signature.s.toString(),
        recovery: signature.recovery.toString(),
      };

      const {
        data: { updatedProfiles },
      } = await server.post("/send", tx);
      setProfiles(updatedProfiles);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h2>Send Transaction</h2>

      <label>
        Sender
        <input
          placeholder="Type an address, for example: 0x91fd84a3e0..."
          value={sender}
          onChange={setValue(setSender)}
          required
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x91fd84a3e0..."
          value={recipient}
          onChange={setValue(setRecipient)}
          required
        ></input>
      </label>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
          required
        ></input>
      </label>

      <input
        type="submit"
        className="button"
        value="Transfer"
        disabled={!connected}
      />
    </form>
  );
}

export default Transfer;
