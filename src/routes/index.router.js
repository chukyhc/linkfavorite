const express = require("express");

const router  = express.Router();

router.get("/",(req,resp)=>{
    resp.send("hola mundo ");
});



module.exports    = router;