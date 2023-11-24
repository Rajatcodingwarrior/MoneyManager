import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app=express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect('mongod:://');
var db=mongoose.connection;
db.on('error',()=>console.log("Error in connecting to Database"));
db.once('open',()=>console.log("Connected to Database"));
app.post("/sign_up",(req,res)=>{
    var name=req.body.name;
    var email=req.body.email;
    var username=req.body.username;
    var password=req.body.password;
    var age=req.body.age;
    var gender=req.body.gender;

    var data={
        "name":name,"email":email,"username":username,"password":password,"age":age,"gender":gender}
        db.collection('User').insertOne(data,(err,collection)=>{
            if(err)
            throw err;
        console.log("record added successfully");
        });
        return res.redirect('/home.html');
    });

app.get("/",(req,res)=>{
    res.set({"Allow-access-Allow-Origin":'*'})
    return res.redirect('/sign_up.html');
}).listen(3000);

console.log("Listening on port 3000");