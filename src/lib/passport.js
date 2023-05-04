const passport=require("passport");
const Strategy = require("passport-local").Strategy;
const pool = require("../database");
const helpers = require("../lib/helpers");
const { route } = require("../routes/link.router");
const { log } = require("console");


passport.use('local.signin',new Strategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true
  },
  async (req,username,password,done)=>{
        try
        {
            const result =  await pool.query("SELECT * FROM users WHERE username=$1 ",[username]);
            if(result.rowCount>0)
            {   
               const user=result.rows[0];      
               console.log("usuario: " ,user);         
                const validPassword = await helpers.matchPassword(password,user.password);
                console.log("validacio: " ,validPassword);
                if(validPassword)
                {
                    done(null,user.id,req.flash("successs","Bienvenido "+ user.username));
                }
                else
                {
                    done(null,false,req.flash("message","Password Inconrrecto"));
                }
                
            }
            else{
               
                done(null,false,req.flash("message","Usuario no existe"));
            }
            

        }
        catch(e)
        {
            console.error(e);
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
            password= await helpers.ecryptPasseord(password);            
            const newUser=[username,password, req.body.fullname];
            const result =  await pool.query("INSERT INTO users(username,password,fullname) values($1,$2,$3) RETURNING id ",newUser);
            const userid= result.rows[0].id;
            done(null,userid);

        }
        catch(e)
        {
            console.error(e);
        }

       
  }
  ));


  passport.serializeUser((id_user,done)=>{
        done(null,id_user);

  });

  passport.deserializeUser(async (id_user,done)=>{
    const rows = (await pool.query("SELECT * FROM users WHERE id = $1",[id_user])).rows;
    //*console.log(rows);
    done(rows.error,rows[0]);


  });

