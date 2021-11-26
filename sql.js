import mysql from 'mysql2/promise';

export default async function insertCollectionData(arr) {
    const db_config = {
        host : "ls-a52bd36cccd550c13fdcca4ffdf5b042c1c3fbe0.cs4nebyia3ui.us-east-2.rds.amazonaws.com",
        user : "dbmasteruser",
        password : "nMkWK0iKFrSk=No,-}z:hcJUcU*{Gp*m",
        port : 3306,
        database: "dbmaster"
    }

    const conn = await mysql.createConnection(db_config);
    const data = [arr]
    const sql = "INSERT INTO ownerStats (Symbol, CollectionName, Tokens, Holders, TimeCreated) VALUES ?"
    let [rows, _fields] = await conn.query(sql, [data])
    console.log("Number of records inserted: ", rows.affectedRows)
    conn.end()
  }
