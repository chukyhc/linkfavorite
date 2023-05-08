const passport=require("passport");
const Strategy = require("passport-local").Strategy;
const contollerUser=require("../controller/users.controller");


passport.use('local.signin',new Strategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true
  },
  async (req,username,password,done)=>{
        
    const {user,error} = await contollerUser.userLoggin(req,username,password);
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
             const  id_ses= await contollerUser.session_logOpen({
                user_id:user.id,
                ip: req.ip,
                agente:req.headers["user-agent"]
              });
              user.id_ses=id_ses;
               return  done(null,user);
             }
            

        }
        catch(e)
        {           
            
            return  done(null,null);
        }

       
  }
  ));


  passport.serializeUser((user,done)=>{

        done(null,user);

  });

  passport.deserializeUser(async (user,done)=>{    
        
    const valUser = await contollerUser.getUserId(user.id);
   if(valUser)
      done(valUser.error,user);
    else 
      done(valUser.error,null);

  });

