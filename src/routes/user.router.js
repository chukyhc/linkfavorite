const express = require("express");
const contollerUser = require("../controller/users.controller");
const {isLoggedIn} = require("../lib/auth");
const router = express.Router();

router.get("/profile",isLoggedIn,(req,resp)=>{

    resp.render("profile");
});

router.get("/", (req,resp)=> {

    contollerUser.getListUsers(req,resp);
});


module.exports =  router;
