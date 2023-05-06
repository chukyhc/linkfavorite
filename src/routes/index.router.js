const express = require("express");

const router  = express.Router();

router.get("/",(req,resp)=>{
    resp.render("index");
});

router.get("/about",(req,resp)=>{
    resp.render("about");
});



module.exports    = router;