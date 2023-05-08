const bcrypt =require("bcryptjs");


const helpers ={};

helpers.encryptPasseord = async function(password)
{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async function (password,savepassword)
{
    try{
       return await bcrypt.compare(password,savepassword);
    }
    catch(e)
    {
            console.log(e);
    }


};

module.exports=helpers;