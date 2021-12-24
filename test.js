import fs from 'fs';
import { collections } from './utils.js'

for (let i=0; i<collections.length; i++) {
    if (collections[i].updateAuthority) {
        for (let j=0; j < collections[i].updateAuthority.length; j++) {
            console.log(collections[i].updateAuthority[j])
        }
    } else {
        for (let j=0; j < collections[i].candy.length; j++) {
            console.log(collections[i].candy[j])
        }
    }
}