module.exports={

   isLoggedIn(req,resp,next)
    {
        if(req.isAuthenticated())
        {
            return next();
        }
        return resp.redirect("/signin")
    } ,
    isNoLoggedIn(req,resp,next)
    {
        if(!(req.isAuthenticated()))
        {
            return next();
        }
        return resp.redirect("/profile");
    } 

};