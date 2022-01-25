import { execSync } from 'child_process';  
import fs from 'fs';
import insertData from "./sql.js"
import { collections } from './utils.js'

console.log(process.cwd())

function myfun(filePath){
    return fs.readFileSync(filePath, 'utf8')
  }

const scrape = async() => {
    for (let j = 0; j < collections.length; j++) {
        const rpc = 'https://summer-snowy-forest.solana-mainnet.quiknode.pro/c9e3fa13ee9f099542ee7e7c3e17992b9f63b44f/'
    
        console.log("Scraping data for collection:", collections[j].magicEdenSymbol)
        
        let a = []
        let tokens = 0

        for (let k = 0; k < collections[j].ids.length; k++) {
            execSync(`/home/bitnami/metaboss/target/release/metaboss -t 90 -r ${rpc} snapshot holders --${collections[j].type} ${collections[j].ids[k]} --output /home/bitnami/metaboss/snapshot`, { encoding: 'utf-8' }, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
            });  // the default is 'buffer'

            //local copy

            // execSync(`metaboss -r ${rpc} snapshot holders --${collections[j].type} ${collections[j].ids[k]} --output ./snapshot`, { encoding: 'utf-8' }, (error, stdout, stderr) => {
            //     if (error) {
            //         console.log(`error: ${error.message}`);
            //         return;
            //     }
            // });  // the default is 'buffer'

            console.log('Call finished, now extracting information from data');
            
            const data = myfun(`/home/bitnami/metaboss/snapshot/${collections[j].ids[k]}_holders.json`)
            // const data = myfun(`./snapshot/${collections[j].ids[k]}_holders.json`)
            const json = JSON.parse(data);

            // insert code here to deal with boryoku dragonz special case

            // if (collections[j].magicEdenSymbol === "boryoku_dragonz") {
            //     execSync(`metaboss -r ${rpc} snapshot holders --${collections[j].type} ${collections[j].ids[k]} --output ./snapshot`, { encoding: 'utf-8' }, (error, stdout, stderr) => {
            //         if (error) {
            //             console.log(`error: ${error.message}`);
            //             return;
            //         }
            //     }); 
            // }

            tokens += json.length

            console.log(tokens)
    
            for (let i=0; i < json.length; i++){
                a.push(json[i].owner_wallet)
            }
        }
        
        const unique = a.filter((item, i, ar) => ar.indexOf(item) === i)

        const collection = collections[j].magicEdenSymbol
        let name = collection.replace(/_/g, " ");
    
        const arr = name.split(" ");
    
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
    
        name = arr.join(" ");
    
        const date = new Date()
        const sqlDate = date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
        const row = [collection, name, tokens, unique.length, sqlDate]
        
        await insertData(row)
    }
}
scrape()