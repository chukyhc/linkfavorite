// se puede utilizar de esta forma 
const timeagoIntance = require("timeago.js");

// o esta forma
const {format}=require("timeago.js");

//timeagoIntance = new timeago();

const helpers ={};

helpers.timeago = function(timestamp){

    return format(timestamp);
    

}
module.exports = helpers;