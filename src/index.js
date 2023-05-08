const expres = require("express");
const session =  require("express-session");
const exphbs = require("express-handlebars");
const dotenv= require("dotenv");
const  morgan = require("morgan");
const router = require("./routes/index.router");
const path = require("path");
const exp = require("constants");
const flash = require("connect-flash");
// configurando la session
const pgsStore=require("connect-pg-simple")(session);
const pooldb = require("./database");

const passport = require("passport");


//inicializaciones
const app = expres();
dotenv.config();
require("./lib/passport");


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



//middleware.
// configuracion de una session con un pool cd postgres
app.use(session({
    secret: 'apppgnodesession',
    resave:false,
    saveUninitialized:false,
    store:new pgsStore({
       pool:pooldb,
       tableName:'users_sessions',
       createTableIfMissing:true
    })
}));


app.use(flash());

app.use(morgan("dev"));
app.use(expres.urlencoded({extended:false}));
app.use(expres.json());
// inicializando el metodo massport
app.use(passport.initialize());
app.use(passport.session());

app.use((req,resp,next)=>{

    resp.locals.success = req.flash("success");
    resp.locals.message = req.flash("message");
    resp.locals.user = req.user || null;
    
    
    next();
})




// variables globales 



// router
app.use(require("./routes/index.router"));
app.use(require("./routes/authentication.router"));
app.use("/links",require("./routes/link.router"));
app.use("/users",require("./routes/user.router"));




//archivos publicos
app.use(expres.static(path.join(__dirname,"public")));




// inicializacion del servidor
app.listen(app.get("port"),()=>console.log(" Servidor corriendo port ", app.get("port") ) );





