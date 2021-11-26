import { execSync } from 'child_process';  
import fs from 'fs';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import fetch from "node-fetch";
import insertData from "./sql.js"
import { collections } from './utils.js'

for (let j = 0; j < collections.length; j++) {
    const rpc = 'https://summer-snowy-forest.solana-mainnet.quiknode.pro/c9e3fa13ee9f099542ee7e7c3e17992b9f63b44f/'
    const updateAuthority = collections[j].updateAuthority

    console.log("Scraping data for collection:", collections[j].magicEdenSymbol)

    const output = execSync(`metaboss -r ${rpc} snapshot holders --update-authority ${updateAuthority} --output ./snapshot`, { encoding: 'utf-8' });  // the default is 'buffer'
    console.log('Call finished, now extracting information from data');
    let tokens
    let unique
    let listed

    fs.readFile(`./snapshot/${updateAuthority}_holders.json`, 'utf8', function(err, data){
        
        const json = JSON.parse(data);

        tokens = json.length

        let a = []

        for (let i=0; i < json.length; i++){
            a.push(json[i].owner_wallet)
        }

        unique = a.filter((item, i, ar) => ar.indexOf(item) === i)
    });

    const collection = collections[j].magicEdenSymbol
    let name = collection.replace(/_/g, " ");

    const arr = name.split(" ");

    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    name = arr.join(" ");

    console.log("Adding data for the collection:", name)
    const urlFloor = "https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/" + collection;


    const info = await getFloor(urlFloor)
    const listedCount = info.pop()
    listed = listedCount / tokens
    let row = [name, tokens, unique.length, listed * 100]
    const date = new Date()
    const sqlDate = date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
    row = row.concat(info, sqlDate)

    await insertData(row)
}



// could potentially delete the JSON file after successfully uploading