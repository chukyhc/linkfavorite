const express = require("express");
const passport = require("passport");

const router  = express.Router();

router.get("/signup",(req,resp)=>{

    resp.render("auth/signup");


});

/*router.post("/signup",(req,resp)=>{

   passport.authenticate('local.signup',{
    successRedirect:"/profile",
    failureRedirect:"/signup",
    failureFlash:true
    
   });

});*/

router.post("/signup",passport.authenticate('local.signup',{
     successRedirect:"/profile",
     failureRedirect:"/signup",
     failureFlash:true
     
    })
);

router.get("/signin",(req,resp)=>{
    
    resp.render("auth/signin");

});
router.post("/signin",(req,resp,next)=>{


    passport.authenticate('local.signin',{
    successRedirect:"/profile",
    failureRedirect:"/signin",
    failureFlash:true
    
   })(req,resp,next);
});

router.get("/profile",(req,resp)=>{

    resp.send("ok");
});

module.exports    = router;