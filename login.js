import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app=express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


const url=mongoose.connect("mongodb://127.0.0.1:27017/USERDATA");
var db=mongoose.connection;
const userSchema=new mongoose.Schema({Name:String,Email:String,Username:String,Password:String,Age:Number,Gender:String});
const User=mongoose.model("User",userSchema);

// const userSchema=new mongoose.Schema({Name:String,Email:String,Username:String,Password:String,Age:Number,Gender:String});
// const User=mongoose.model("User",userSchema);
 
 app.post("/login",async(req,res)=>{
    
    var email=req.body["emailadd"];
    var password=req.body["pass"];
    console.log(password);
    
   let doc = await User.find({Email:email}).exec();
  
   console.log(doc);
        
       if(doc[0].Password===password){
       return res.redirect("/home.html");
      }
       else{ 
       return res.redirect("/index (1).html");
       }
    });

    app.get("/",(req,res)=>{
        res.set({"Allow-access-Allow-Origin":'*'})
       return res.redirect("/index (1).html");
    });

