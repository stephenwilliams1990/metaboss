import { execSync } from 'child_process';  
import fs from 'fs';
import { transfer } from './transfer.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { web3 } from "@project-serum/anchor";
import * as csv from '@fast-csv/parse';

console.log(process.cwd())

function myfun(filePath){
    return fs.readFileSync(filePath, 'utf8')
}

const scrape = async() => {
    const rpc = 'https://summer-snowy-forest.solana-mainnet.quiknode.pro/c9e3fa13ee9f099542ee7e7c3e17992b9f63b44f/'
        
    const data = myfun(`./airdrop.json`)
    
    const tokens = JSON.parse(data);

    // const tokens = json.length
    console.log(tokens[0].Wallet, tokens[0]['Amount to send'])

    
    const TOKEN_ADDRESS = 'GENW9qVvxHMVmRTVokgHRPqSr3syV2AmKoehqrRWiYFu'

    const MY_SECRET_KEY = process.env.MY_SECRET_KEY.split(",")
    const wallet = web3.Keypair.fromSecretKey(
        new Uint8Array(MY_SECRET_KEY)
    )
    console.log(wallet.publicKey.toBase58())

    const connection = new web3.Connection(
        rpc,
        'confirmed',
    );

    for (let i = 0; i < tokens.length; i++) {
        try {
            console.log(`Sending ${tokens[i]['Amount to send']} tokens to ${tokens[i].Wallet}`)
            await transfer(TOKEN_ADDRESS, wallet, tokens[i].Wallet, connection, tokens[i]['Amount to send'] * LAMPORTS_PER_SOL) 
        } catch (err) {
            console.log("error:", err)
        }
        
    }

        //await transfer(TOKEN_ADDRESS, wallet, me, connection, 1 * LAMPORTS_PER_SOL) 

    console.log("Airdrop completed successfully")
}
scrape()