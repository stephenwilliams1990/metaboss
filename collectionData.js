import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import fetch from "node-fetch";
import insertCollectionData from "./sql.js"
import { collections } from './utils.js'

async function getFloor(url) {
    const data = await fetch(url).then(
        response => response.json()
        .catch(error => {
            console.log("Error in getFloor")
        })
    );
    
    return([data.results.floorPrice / LAMPORTS_PER_SOL, ( data.results.listedTotalValue / LAMPORTS_PER_SOL ) / data.results.listedCount, data.results.volume24hr / LAMPORTS_PER_SOL, data.results.volumeAll / LAMPORTS_PER_SOL, data.results.avgPrice24hr / LAMPORTS_PER_SOL, data.results.listedCount])

}

for (let j = 0; j < collections.length; j++) {

    console.log("Scraping data for collection:", collections[j].magicEdenSymbol)

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
    let row = [collection, name, listedCount]
    const date = new Date()
    const sqlDate = date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
    row = row.concat(info, sqlDate)

    await insertCollectionData(row)
}
