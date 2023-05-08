const pooldb =  require ("../database");
const bcrypt =require("bcryptjs");


const contollerUser= {

    async getUserId(id)
    {
        const result = await pooldb.query("SELECT * FROM users WHERE id = $1",[id]);
        if(result.rowCount>0)
        {
            return result.rows[0];
        }
        else 
        {
            return null;
        }

    },


    async  getListUsers (req,resp)
    {
        try {
            
            const users = (await pooldb.query("SELECT * FROM users ORDER BY id")).rows;
            resp.render("users/list",{users});
        } catch (error) {
            req.flash("message","Erros al consultar usuario" + error);
        }
    },

    async userLoggin(req,username,password)
    {
        try {

         const  ses_log = await this.session_logActiva(username);
          if( !ses_log )
          {
          const result =  await pooldb.query("SELECT * FROM users WHERE username=$1 ",[username]);
            if(result.rowCount>0)
            {   
               const user=result.rows[0];                      
                const validPassword = await this.matchPassword(password,user.password);
                if(validPassword)
                {
                    const id_ses = await this.session_logOpen({
                        id:user.id,
                        ip:req.ip,
                        agente:req.headers['user-agent']});     
                    if(id_ses)
                    {
                        user.id_ses=id_ses;
                        return {user, error:null};
                    }
                    else
                    {
                        return {user:null, error:"Error al generear resistro de SESSION LOG"};
                    }
                }
                else
                {
                    return {user:null, error:"Password Inconrrecto"};
                }
                
            }
            else{
               
                return {user: null,error: "Usuario no existe"};
            }
            
    }
    else
        return {user: null,error: "Existe una Session Activa en la maquila" + ses_log.ip};
    }
    catch (error) {
            return {user:null, error:"Error al conectar con la base de datos "+ error}
    }


  },
  async userAdd(username,password,fullname)
  {
    
            password= await this.ecryptPasseord(password);            
            const newUser=[username,password,fullname];
            const result =  await pooldb.query("INSERT INTO users(username,password,fullname) values($1,$2,$3) RETURNING id ",newUser);
            const id= result.rows[0].id;
            return {id,username, password, fullname};
       
  },

 async ecryptPasseord(password)
{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
},

 async matchPassword (password,savepassword)
{
    try{
       return await bcrypt.compare(password,savepassword);
    }
    catch(e)
    {
            console.error("matchPassword",e);
    }


},

async session_logOpen(ses)
{
    try{
       const result= await pooldb.query("INSERT INTO session_log(id_user,ip,agente,activa) VALUES($1,$2,$3,true) RETURNING id",[ses.id,ses.ip,ses.agente]);
        return result.rows[0].id;
    }
    catch(e)
    {
        return false;
    }
},
async session_logClose(id_ses)
{
    try{
        await pooldb.query("UPDATE session_log SET activa = false WHERE id = $1",[id_ses]);
        return true;
    }
    catch(e)
    {
        return false;
    }
},

async session_logActiva(username)
{
   const  result = await  pooldb.query(`SELECT * FROM users, session_log WHERE users.username=$1 
   and users.id =session_log.id_user and  session_log.activa = true`,[username] );
   if(result.rowCount > 0)
        return result.rows[0];
    else
        return false;

}


}
module.exports= contollerUser;