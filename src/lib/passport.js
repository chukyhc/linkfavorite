const passport=require("passport");
const Strategy = require("passport-local").Strategy;
const pool = require("../database");
const helpers = require("../lib/helpers");
const { route } = require("../routes/link.router");
const contollerUser=require("../controller/users.controller");


passport.use('local.signin',new Strategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true
  },
  async (req,username,password,done)=>{
        
    const {user,error} = await contollerUser.userLoggin(username,password);
       if(user){
            done(null,user,req.flash("successs","Bienvenido "+ user.username));
        }
       else
        {
           done(null,false,req.flash("message",error));
        }
            
  }
  ));



passport.use('local.signup',new Strategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true
  },
  async (req,username,password,done)=>{
        
        try
        { 
            const user = await contollerUser.userAdd(username,password,req.body.fullname)        
            if(user)
            {
               return  done(null,user);
             }
            

        }
        catch(e)
        {           
            console.error(e);
            return  done(null,null);
        }

       
  }
  ));


  passport.serializeUser((user,done)=>{

        done(null,user);

  });

  passport.deserializeUser(async (user,done)=>{
    
    
    const valUser = await contollerUser.getUserId(user.id);
    console.log("verificacion1 " , valUser);
    done(null,valUser);

  });

