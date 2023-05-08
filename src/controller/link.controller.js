const pooldb = require("../database");
const pooldbdb = require("../database");

const controllerLink={

    async addlink(req,resp)
    {
        const {title,url,descripcion}=req.body;
        const newlink ={title,url,descripcion};
    
        await pooldb.query("INSERT INTO link(title,url,descripcion,user_id) values($1,$2,$3,$4)",[title,url,descripcion,req.user.id]);
        req.flash("success", "Enlace Guardado sastifastoriamente");
        resp.redirect("/links");
    },

    async getlinks(req,resp)
    {
        id=req.user.id;
        console.log("usuario ",id);
        const links = (await pooldb.query("SELECT * FROM link WHERE user_id=$1",[id])).rows;
        resp.render("links/list",{links});
    },

    async deletelink(req,resp)
    {
        const id = req.params.id;
        await pooldb.query("DELETE FROM link where id= "+id);
        req.flash("success","enlace eliminado sastifactoriamente");
        resp.redirect("/links");
    },

    async geteditlink(req,resp)
    {
        const {id}=req.params;
        const link = (await pooldb.query("SELECT * FROM link WHERE id = $1",[id])).rows;
        console.log(link)
        resp.render("links/edit", {link:link[0]});
    },

    async editlink(req,resp)
    {
        const {id}=req.params;
        const {title,url,descripcion}=req.body;


        sql=`UPDATE link SET title = '${title}', url = '${url}', descripcion = '${descripcion}' WHERE id =${id}` 
        result =await pooldb.query(sql);
        resp.redirect("/links");
    }

        

};





module.exports = controllerLink;