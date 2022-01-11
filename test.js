import fs from 'fs';
import { collections } from './utils.js'
import { web3 } from "@project-serum/anchor";

const MY_SECRET_KEY = process.env.MY_SECRET_KEY.split(",")
console.log(MY_SECRET_KEY)

const wallet = web3.Keypair.fromSecretKey(
    new Uint8Array(MY_SECRET_KEY)
)

console.log(wallet.publicKey.toString())