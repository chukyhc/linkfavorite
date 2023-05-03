const expres = require("express");
const session =  require("express-session");
const exphbs = require("express-handlebars");
const dotenv= require("dotenv");
const  morgan = require("morgan");
const router = require("./routes/index.router");
const path = require("path");
const exp = require("constants");


//inicializaciones
const app = expres();
dotenv.config();


// configuraciones 

app.set("port",process.env.port|| 3000);
app.set("views",path.join(__dirname,"views"));
app.engine(".hbs",exphbs.engine({
    defaultLayout:"main",
    layoutsDir: path.join(app.get("views"),"layouts"),
    partialsDir:path.join(app.get("views"), "partials"),
    extname:".hbs",
    helpers:require('./lib/handlebars')
}))
 app.set("view engine",".hbs");



//middleware
app.use(morgan("dev"));
app.use(expres.urlencoded({extended:false}));
app.use(expres.json());

app.use((req,resp,next)=>{

    next();
})


// variables globales 


// router
app.use(require("./routes/index.router"));
app.use(require("./routes/authentication.router"));
app.use("/links",require("./routes/link.router"));




//archivos publicos
app.use(expres.static(path.join(__dirname,"public")));




// inicializacion del servidor
app.listen(app.get("port"),()=>console.log(" Servidor corriendo port ", app.get("port") ) );





