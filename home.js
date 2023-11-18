import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const url=mongoose.connect("mongodb://127.0.0.1:27017/USERDATA");
const itemSchema=new mongoose.Schema({email:String,sno:Number,amount:Number,category:String,account:String,date:String});
const Item=new mongoose.model("Item",itemSchema);
const app=express();
const port=3200;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
var cnt=1;
var today= new Date();   
var dd=today.getDate();
var mm=today.getMonth()+1;
var yyyy=today.getFullYear();
if(mm<10)
mm='0'+mm;
if(dd<10)
dd='0'+10;
var date=dd+'-'+mm+'-'+yyyy;

app.get("/",async(req,res)=>{
   
   let items = await Item.find({date:date}).exec();
   res.render("home.ejs",{newList:items,count:1,Date:date});

});

// app.post("/",async(req,res)=>{
//      date=req.body["date"];
//      console.log(date);
//     let items = await Item.find({date:date}).exec();
//     console.log(items);
//     res.render("home.ejs",{newList:items,count:1,Date:date});
// });
var currDate="";


app.post("/",async(req,res)=>{
    date=req.body["date"];
    var amt=req.body["amount"];
    
    var category=req.body["category"];
   
    var accnt=req.body["acc"];
    
     if(!date){
        console.log("yes");
        if(currDate==="")
      date=dd+"-"+mm+"-"+yyyy;
    else
    date=currDate;
     }
     currDate=date;
     
    
    const item=new Item({
        sno:cnt,
        amount:amt,
        category:category,
        account:accnt,
        date:date,
    });
    
    if(item.amount)
    item.save();


   let items = await Item.find({date:date}).exec();
   res.render("home.ejs",{newList:items,newItem:item,count:1});

});

 app.post("/delete",async(req,res)=>{
    var value=req.body["trash"];
    let d=await Item.find({_id:value}).exec();
    console.log(d);
  let doc= await Item.deleteOne({_id:value});
  
   res.redirect("/");
   

});
app.listen(3200,()=>{
    console.log("Listening to port 3200");
});