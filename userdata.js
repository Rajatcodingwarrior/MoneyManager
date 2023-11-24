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
var ans=false;
var data;
 
 app.post("/sign_up",async(req,res)=>{
    var name=req.body["name"];
    var email=req.body["email"];
    var username=req.body["username"];
    var password=req.body["password"];
    var age=req.body["age"];
    var gender=req.body["gender"];
    var confpassword=req.body["conpassword"];

    let doc1 = await User.find({Email:email}).exec();
    let doc2 = await User.find({Username:username}).exec();


     data={
        Name:name,Email:email,Username:username,Password:password,Age:age,Gender:gender};

        // db.collection('User').insertOne(data,(err,collection)=>{
        //     if(err)
        //     throw err;
        // console.log("record added successfully");
        // });
        if(doc1.length>0 || doc2.length>0)
        {
            return res.redirect("/sign_up.html");
        }
        else if(data.Username.length<6|| data.Password.length<6)
        return res.redirect("/sign_up.html")

        else if(password===confpassword && name!="" && username!="" && (gender==="Male"||gender==="Female"||gender==="Other") && age!="" && email!="")
        {
         var user=new User(data);
         user.save();
          ans=true;
        res.render("home.ejs",{Data:data});
       
        }
        else
        return res.redirect("/sign_up.html");
        
    });
    
    app.get("/",(req,res)=>{
        res.set({"Allow-access-Allow-Origin":'*'})
       return res.redirect("/sign_up.html");});

// app.get("/",(req,res)=>{
//     res.set({"Allow-access-Allow-Origin":'*'})
//     return res.sendFile("/sign_up.html");
// });
app.listen(3000,()=>{
    console.log("Listening to port 3000");
});

