import fs from 'fs';
import { collections } from './utils.js'
import { web3 } from "@project-serum/anchor";
import bs58 from 'bs58'

const data = fs.readFileSync(`./snapshot/5ymJGvHDdg8xUC6uNVgjAzoQP3aJvnibWwjUoRXFbh88_holders.json`)
const json = JSON.parse(data);

let a = []
for (let i=0; i < json.length; i++) {
    a.push(json[i].owner_wallet)
}

const unique = a.filter((item, i, ar) => ar.indexOf(item) === i)
console.log(unique.length)