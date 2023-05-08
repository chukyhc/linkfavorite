const express = require("express");
const router  = express.Router();
const {isLoggedIn} = require("../lib/auth");
const controllerLink =require("../controller/link.controller");
router.use(isLoggedIn);

router.get("/add",(req,resp)=>{

    resp.render("links/add");

});

router.post("/add",(req,resp)=>{
    
    controllerLink.addlink(req,resp);
});

router.get("/",(req,resp)=>{
       
    controllerLink.getlinks(req,resp);
})

router.get("/delete/:id", (req,resp)=>{
   
    controllerLink.deletelink(req,resp);
});

router.get("/edit/:id",(req,resp)=>{
    controllerLink.geteditlink(req,resp);

});


router.post("/edit/:id",async(req,resp)=>{
    controllerLink.editlink(req,resp);
});

module.exports    = router;