const express = require("express");
const passport = require("passport");
 const {isLoggedIn,isNoLoggedIn} = require("../lib/auth");


const router  = express.Router();


router.get("/signup",isNoLoggedIn,(req,resp)=>{

    resp.render("auth/signup");


});


router.post("/signup",isNoLoggedIn, passport.authenticate('local.signup',{
     successRedirect:"/users/profile",
     failureRedirect:"/signup",
     failureFlash:true
     
    })
);

router.get("/signin", isNoLoggedIn
,(req,resp)=>{
    
    resp.render("auth/signin");

});
router.post("/signin",isNoLoggedIn,(req,resp,next)=>{


    passport.authenticate('local.signin',{
    successRedirect:"/users/profile",
    failureRedirect:"/signin",
    failureFlash:true
    
   })(req,resp,next);
});

router.get("/logout",isLoggedIn,(req,resp)=>{

    req.logOut(err=>{
        if(err)
        {
            req.flash("message","Error al cerra la session de usuario");
            resp.redirect("/");
        }
    });
    
resp.redirect("/signin");
});

module.exports    = router;