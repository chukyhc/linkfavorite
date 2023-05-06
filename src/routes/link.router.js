const express = require("express");
const router  = express.Router();
const pool = require("../database");
const {isLoggedIn} = require("../lib/auth");
router.use(isLoggedIn);

router.get("/add",(req,resp)=>{

    resp.render("links/add");

});

router.post("/add",async (req,resp)=>{
    const {title,url,descripcion}=req.body;
    const newlink ={title,url,descripcion};
    
    await pool.query("INSERT INTO link(title,url,descripcion,user_id) values($1,$2,$3,$4)",[title,url,descripcion,req.user.id]);
    req.flash("success", "Enlace Guardado sastifastoriamente");
    resp.redirect("/links");
    
});
router.get("/",async(req,resp)=>{
    id=req.user.id;
    console.log("usuario ",id);
    const links = (await pool.query("SELECT * FROM link WHERE user_id=$1",[id])).rows;
    resp.render("links/list",{links});
    

})

router.get("/delete/:id",async (req,resp)=>{
    const id = req.params.id;
    await pool.query("DELETE FROM link where id= "+id);
    req.flash("success","enlace eliminado sastifactoriamente");
    resp.redirect("/links");

});

router.get("/edit/:id",async(req,resp)=>{
    const {id}=req.params;
    const link = (await pool.query("SELECT * FROM link WHERE id = $1",[id])).rows;
    console.log(link)
    resp.render("links/edit", {link:link[0]});

});


router.post("/edit/:id",async(req,resp)=>{
    const {id}=req.params;
    const {title,url,descripcion}=req.body;


    sql=`UPDATE link SET title = '${title}', url = '${url}', descripcion = '${descripcion}' WHERE id =${id}` 
    console.log(sql);
    result =await pool.query(sql);
    console.log(result);
    resp.redirect("/links");
});

module.exports    = router;