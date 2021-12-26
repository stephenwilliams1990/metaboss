import fs from 'fs';
import { collections } from './utils.js'

function myfun(filePath){
    return fs.readFileSync(filePath, 'utf8')
}

const data = myfun(`./snapshot/BqVYhy5mBuzzdtauSUrEUZDFxuk2ERe9J29ciwTa7fiu_mint_accounts.json`)

const a = JSON.parse(data)
console.log(a[0])
let counts = {}

for (const num of a) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
}   

const unique = a.filter((item, i, ar) => ar.indexOf(item) === i)
const magicEden = 'GUfCR9mK6azb9vcpsxgXyj7XRPAKJd4KMHTTVvtncGgp'

for (let i = 0; i < unique.length; i++) {
    if (unique[i] !== magicEden) {
        console.log(`Sending ${counts[unique[i]] * 15000} tokens to ${unique[i]}`)
        // await transfer(TOKEN_ADDRESS, wallet, unique[i], connection, (counts[unique[i]] * 500) * LAMPORTS_PER_SOL) 
    } else {
        console.log("Magic Eden")
    }
} 
