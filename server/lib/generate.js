const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { toHex } = require("ethereum-cryptography/utils");

/**
 * @description This function creates three wallets with their:
 * private key, public key, public address and allocate balances
 * to the wallets
 * @returns The created wallets.
 */
function createAccounts() {
  const wallets = [];

  for (let i = 0; i < 3; i++) {
    const obj = {
      privateKey: toHex(secp256k1.utils.randomPrivateKey()),
    }; // create a private key
    obj.publicKey = secp256k1.getPublicKey(obj.privateKey); // derived a public key to set it as a new field in the object
    obj.address = toHex(obj.publicKey).slice(-40); // grab last 40 digits from the public key to derived a public address
    obj.balance = (i + 1) * 10000;
    wallets.push(obj);
  }

  return wallets;
}

createAccounts();

module.exports = createAccounts;
