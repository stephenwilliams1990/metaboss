import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import fetch from "node-fetch";
import { web3 } from '@project-serum/anchor';
import fs from 'fs';

(async function () {
    const candyMachine = 'A6XTVFiwGVsG6b6LsvQTGnV5LH3Pfa3qW3TGz8RjToLp'

    const data = fs.readFileSync(`snapshot/${candyMachine}_holders.json`)
    const json = JSON.parse(data)

    const connection = new Connection(clusterApiUrl('mainnet-beta'))
    let collection;

    for (let i=0; i<json.length; i++) {
        const metadata = json[i].metadata_account

        const tokenMetadata = await Metadata.load(connection, metadata);

        const Id = tokenMetadata.data.data.name;
        collection = Id.substring(0, Id.indexOf('#')).trim()
        json[i]['Collection'] = collection
        json[i]['ID'] = Id
        
        let numTries = 3;            
        let uri;

        while (true) {
            try {
                await fetch(tokenMetadata.data.data.uri)
                    .then(response => response.json())
                    .then(data => uri = data) // img
                break;
            } catch (err) {
                setTimeout(() => {  console.log('Failed to fetch metadata'); }, 10000);
                if (--numTries == 0) throw err;
            }
        }

        const img = uri.image
        const attributes = uri.attributes

        json[i]['imgUrl'] = img

        for (let a=0; a<attributes.length; a++) {
            json[i][(attributes[a].trait_type)] = attributes[a].value
        }
        
        if (i % 100 === 0) {
            console.log(i)
        }
    }

    const jsonContent = JSON.stringify(json)
    fs.writeFileSync(`${collection}.json`, jsonContent, 'utf-8')
})()





