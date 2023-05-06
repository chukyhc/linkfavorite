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
            
            const users = (await pooldb.query("SELECT * FROM users")).rows;
            resp.render("users/list",users);
        } catch (error) {
            req.flash("message","Erros al consultar usuario" + error);
        }
    },

    async userLoggin(username,password)
    {
        try {
        
          const result =  await pooldb.query("SELECT * FROM users WHERE username=$1 ",[username]);
            if(result.rowCount>0)
            {   
               const user=result.rows[0];                      
                const validPassword = await this.matchPassword(password,user.password);
                if(validPassword)
                {
                    
                    return {user, error:null};
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


}

}
module.exports= contollerUser;