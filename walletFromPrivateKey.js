import fs from 'fs';
import { collections } from './utils.js'
import { web3 } from "@project-serum/anchor";
import bs58 from 'bs58'

const MY_SECRET_KEY = process.env.MY_SECRET_KEY.split(",")
console.log(MY_SECRET_KEY)

const wallet = web3.Keypair.fromSecretKey(
    new Uint8Array(MY_SECRET_KEY)
)

console.log(wallet.publicKey.toString())

const decoded = bs58.decode('3EdEBPhy1hx8C5JajJ9u9jBCqbKj6VNEk9jBsAERYPdU9i9tgNiqXj6oiGmVKxvTfS9weR6b1vgLRc3bBn1ZvFM8');

console.log(Uint8Array.from(decoded))

const byteArray = Uint8Array.from(decoded)

let string = ''

for (let i=0; i<byteArray.length; i++) {
    string += byteArray[i] + ","
}

console.log(string)
