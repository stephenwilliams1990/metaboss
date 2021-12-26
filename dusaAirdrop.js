import { execSync } from 'child_process';  
import fs from 'fs';
import { transfer } from './transfer.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { web3 } from "@project-serum/anchor";

console.log(process.cwd())

function myfun(filePath){
    return fs.readFileSync(filePath, 'utf8')
}

const collections = [
    {
        "candy" : "7yDY84DvQV1bG1vC2ox967bPHSiTiw7KW5P3f1bv2f7P",
        "name" : "Pixel Gorgons",
        "amount" : 500 
    },
    {
        "candy" : "BqVYhy5mBuzzdtauSUrEUZDFxuk2ERe9J29ciwTa7fiu",
        "name" : "HD Gorgons",
        "amount" : 250 
    }
]

const scrape = async() => {
    const rpc = 'https://summer-snowy-forest.solana-mainnet.quiknode.pro/c9e3fa13ee9f099542ee7e7c3e17992b9f63b44f/'
    
    for (let j = 0; j < collections.length; j++) {
        const candy = collections[j].candy

        console.log(`Scraping data for collection: ${collections[j].name}`)
        
        execSync(`/home/bitnami/metaboss/target/release/metaboss -r ${rpc} snapshot holders --candy-machine-id ${candy} --output /home/bitnami/metaboss/snapshot`, { encoding: 'utf-8' }, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
        }); 

        // the below is for the local script

        // execSync(`metaboss -r ${rpc} snapshot holders --candy-machine-id ${candy} --output ./snapshot`, { encoding: 'utf-8' }, (error, stdout, stderr) => {
        //     if (error) {
        //         console.log(`error: ${error.message}`);
        //         return;
        //     }
        // });
        
        console.log('Call finished, now extracting information from data');
        
        const data = myfun(`/home/bitnami/metaboss/snapshot/${candy}_holders.json`)
        // const data = myfun(`./snapshot/${candy}_holders.json`)
        
        const json = JSON.parse(data);

        const tokens = json.length
        console.log(tokens)

        let a = []

        for (let i=0; i < json.length; i++){
            a.push(json[i].owner_wallet)
        }

        const me = 'FaHgKHDGKmoJ3ZFkFGE1cNmHSyfk8Y8z3NsQonDt7eEU'
        a.push(me)

        const TOKEN_ADDRESS = 'GENW9qVvxHMVmRTVokgHRPqSr3syV2AmKoehqrRWiYFu'

        const wallet = web3.Keypair.fromSecretKey(
            new Uint8Array([111,200,137,8,213,159,247,110,232,241,179,157,248,168,146,216,217,24,185,212,179,241,210,0,112,70,56,8,42,185,103,54,115,55,164,139,84,26,226,212,88,17,54,143,95,189,177,18,156,126,54,245,71,182,177,222,31,16,180,233,206,5,221,15])
        )

        const connection = new web3.Connection(
            rpc,
            'confirmed',
        );

        const magicEden = 'GUfCR9mK6azb9vcpsxgXyj7XRPAKJd4KMHTTVvtncGgp'

        const counts = {};

        for (const num of a) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }   

        const unique = a.filter((item, i, ar) => ar.indexOf(item) === i)

        const amount = collections[j].amount

        for (let i = 0; i < unique.length; i++) {
            if (unique[i] !== magicEden) {
                console.log(`Sending ${counts[unique[i]] * amount} tokens to ${unique[i]}`)
                await transfer(TOKEN_ADDRESS, wallet, unique[i], connection, (counts[unique[i]] * amount) * LAMPORTS_PER_SOL) 
            } else {
                console.log("Magic Eden")
            }
            
        }

        //await transfer(TOKEN_ADDRESS, wallet, me, connection, 1 * LAMPORTS_PER_SOL) 
    }
}
scrape()