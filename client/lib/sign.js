import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

/**
 * @description This function takes a transactions, wallets and the address
 * of the connected wallet to create the hashed message to be signed.
 * @param {*} tx Object with the transaction payload
 * @param {*} profiles List of wallets
 * @param {*} connected The address of the wallet sending the transaction
 * @returns An object with the hashed message and the signature
 */
export function getHashedMsgAndSignature(tx, profiles, connected) {
  const stringifiedTx = JSON.stringify(tx); // transform the tx object to a string
  const hashMsg = keccak256(utf8ToBytes(stringifiedTx)); // hash the stringified tx
  const signer = profiles.find((profile) => profile.address === connected); // find the profile for the `connected` account
  const signature = secp256k1.sign(toHex(hashMsg), signer.privateKey); // sign the hashed message using `connected` private key
  return { hashMsg, signature };
}
