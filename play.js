import fs from 'fs'

function myfun(filePath){
    return fs.readFileSync(filePath, 'utf8')
}
const data = myfun(`./snapshot/BqVYhy5mBuzzdtauSUrEUZDFxuk2ERe9J29ciwTa7fiu_mint_accounts.json`)
const json = JSON.parse(data);

const tokens = json.length

console.log(tokens)