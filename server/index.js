const express = require("express");
const cors = require("cors");
const createAccounts = require("./lib/generate");
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { toHex } = require("ethereum-cryptography/utils");

const port = 3042;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/accounts", (req, res) => {
  const wallets = createAccounts(); // the created wallets to the client
  res.status(200).send({ wallets });
});

app.post("/send", (req, res) => {
  const { profiles, sender, recipient, amount, hashMsg, signature } = req.body;

  // The Signature loses its embedded methods after being sent from the
  // client to the server, in order to recuperate those methods we need
  // to construct a new Signature.
  const sig = new secp256k1.Signature(
    BigInt(signature.r),
    BigInt(signature.s),
    parseInt(signature.recovery)
  );

  const values = Object.values(hashMsg); // create a new array with the values of the object
  const hash = new Uint8Array(values); // instantiate a new `Uint8Array`
  const publicKey = sig.recoverPublicKey(toHex(hash)).toHex(); // recover the public key
  const recoveredAddress = publicKey.slice(-40); // grab the last 40 digits to derived the address of the sender

  // extract the profiles of the sender and recipient
  const senderProfile = profiles.find((profile) => profile.address === sender);
  const recipientProfile = profiles.find(
    (profile) => profile.address === recipient
  );

  // Check if the recovered address if in reality the sender
  if (recoveredAddress != sender) {
    res.status(400).send({
      message: "You cannot transfer tokens from another account.",
    });
  } else if (senderProfile.balance < amount) {
    // throw if the amount is greater than the sender balance
    res.status(400).send({
      message: "The amount exceeds your account balance.",
    });
  } else if (amount < 0 || amount == 0) {
    // throw if the amount is not valid
    res.status(400).send({
      message: "Invalid amount.",
    });
  } else {
    // update the balances
    senderProfile["balance"] -= amount;
    recipientProfile["balance"] += amount;

    // send the updated profiles to the client
    res.status(201).send({ updatedProfiles: profiles });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
