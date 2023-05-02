const PG = require("pg");
const {database}=require("./keys");

const pooldb = new PG.Pool(database);

 
pooldb.connect((err, client, release) => {
  if (err) {
    return console.error('Error conectado cliente pool', err.stack)
  }
  if(client)
  {
    release()   
  }
  return console.log("Cliente Db esta conectado");
  
})