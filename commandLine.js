import { execSync } from 'child_process';  
import fs from 'fs';
import insertData from "./sql.js"
import { collections } from './utils.js'

console.log(process.cwd())

// collections.length
const scrape = async() => {
    for (let j = 0; j < 1; j++) {
        const rpc = 'https://summer-snowy-forest.solana-mainnet.quiknode.pro/c9e3fa13ee9f099542ee7e7c3e17992b9f63b44f/'
        const updateAuthority = collections[j].updateAuthority
    
        console.log("Scraping data for collection:", collections[j].magicEdenSymbol)
    
        const output = execSync(`metaboss -r ${rpc} snapshot holders --update-authority ${updateAuthority} --output ./snapshot`, { encoding: 'utf-8' });  // the default is 'buffer'
        console.log('Call finished, now extracting information from data');
        let tokens
        let unique
    
        fs.readFileSync(`./snapshot/${updateAuthority}_holders.json`, 'utf8', function(err, data){
            
            const json = JSON.parse(data);
    
            tokens = json.length
    
            let a = []
    
            for (let i=0; i < json.length; i++){
                a.push(json[i].owner_wallet)
            }
            console.log("a", a)
            unique = a.filter((item, i, ar) => ar.indexOf(item) === i)
        });
    

        console.log("Token", tokens)
        console.log("Holders", unique)

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
        console.log(row)
        //await insertData(row)
    }
}
scrape()