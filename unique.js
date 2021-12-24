import fs from 'fs';

function myfun(filePath){
    return fs.readFileSync(filePath, 'utf8')
  }

const ids = ['4jrM8jUJhYkS9ZAub51PxNxyMRUVy9pwKsM3iujPAsEb', '5NRDRcSAzcj32t3axyzz44s3p1qkokdP5e3smzyCC4Le']
let a = []

for (let i=0; i < ids.length; i++) {
    const data = myfun(`./snapshot/${ids[i]}_holders.json`)
    const json = JSON.parse(data);

    const tokens = json.length

    for (let i=0; i < json.length; i++){
        a.push(json[i].owner_wallet)
    }

    
}

const unique = a.filter((item, i, ar) => ar.indexOf(item) === i)

console.log(`There are ${unique.length} unique holders in this collection`)