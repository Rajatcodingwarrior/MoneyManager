import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import mongoose from "mongoose";


const url=mongoose.connect("mongodb://127.0.0.1:27017/USERDATA");
const itemSchema=new mongoose.Schema({email:String,sno:Number,amount:Number,category:String,account:String,date:String,month:String,year:String});
const Data=new mongoose.model("Data",itemSchema);

const app=express();
const port=3200;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

// app.get("/",(req,res)=>{
//     res.render("profile.ejs");
// });
var stocksymbol1="";


app.get("/report",(req,res)=>{
   res.render("profile.ejs");

 });
 app.post("/report",async(req,res)=>{
    var day=req.body["date"];
    var month=req.body["month"];
    var year=req.body["year"];
    console.log(month);
    if(day && !month && !year)
    {
        var items= await Data.find({date:day}).exec();
        res.render("profile.ejs",{newList:items,count:1});

    }
    else if(month && !day && !year){
        var items=await Data.find({month:month}).exec();

        res.render("profile.ejs",{newList:items,count:1});
    }
    else if(year && !day && !month){
        var items=await Data.find({year:year}).exec();
       
        res.render("profile.ejs",{newList:items,count:1});
    }
    res.redirect("/");

 });
app.post("/currency",async(req,res)=>{
try{
    const curr=req.body["currency"];
    const response=await axios.get("https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_kG3X2CqJ0JRhkuENm95Qv83mNz2PsLqyMqvjF1pe&currencies="+curr+"%2CUSD%2CCAD");
    if(curr==="INR")
    res.render("profile.ejs",{value:response.data.data.INR,Curr:curr});
    else if(curr==="EUR")
    res.render("profile.ejs",{value:response.data.data.EUR,Curr:curr});
    else if(curr==="AUD")
    res.render("profile.ejs",{value:response.data.data.AUD,Curr:curr});
   else if(curr==="BGN")
    res.render("profile.ejs",{value:response.data.data.BGN,Curr:curr});
    else if(curr==="HKD")
    res.render("profile.ejs",{value:response.data.data.HKD,Curr:curr});
    else if(curr==="CNY")
    res.render("profile.ejs",{value:response.data.data.CNY,Curr:curr});
}
catch(error)
{
    console.log("failed to make request:",error.message);
    res.status(500).send("Failed to fetch activity,Please try again");

}

});
app.post("/stockprice",async(req,res)=>{
    try{
        stocksymbol1=req.body["stock1"];
    const response=await axios.get("https://api.twelvedata.com/price?symbol="+stocksymbol1+"&apikey=7ac0710db5b34e2ba2fbef2d65679600");
    res.render("profile.ejs",{Symbol1:stocksymbol1,data1:response.data});
    }
    catch(error)
    {
        console.log("failed to make request:",error.message);
        res.status(500).send("Failed to fetch activity,Please try again");
    }
});
app.listen(3200,()=>{
    console.log("Listening to 3200");
});
 