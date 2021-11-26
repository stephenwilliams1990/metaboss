import fs from 'fs';

const updateAuthority = "EVbtsbmo7Av16n4ruYQLNTmCbTdcSRwNZbMsCZeCvGg8"

fs.readFile(`./snapshot/${updateAuthority}_holders.json`, 'utf8', function(err, data){
            
    const json = JSON.parse(data);

    const tokens = json.length

    let a = []

    for (let i=0; i < json.length; i++){
        a.push(json[i].owner_wallet)
    }

    const unique = a.filter((item, i, ar) => ar.indexOf(item) === i)

    console.log('Tokens', tokens, 'Holders', unique)
});