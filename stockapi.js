import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app=express();
const port=3200;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

// app.get("/",(req,res)=>{
//     res.render("profile.ejs");
// });
var stocksymbol1="";
var stocksymbol2="";
var stocksymbol3="";


app.get("/",(req,res)=>{
   res.render("profile.ejs");

 });
app.post("/submit",async(req,res)=>{
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
app.post("/",async(req,res)=>{
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
 app.post("/",async(req,res)=>{
    try{
        stocksymbol2=req.body["stock2"];
       
   const response2=await axios.get("https://api.twelvedata.com/price?symbol="+stocksymbol2+"&apikey=7ac0710db5b34e2ba2fbef2d65679600");
     res.render("profile.ejs",{Symbol2:stocksymbol2,data2:response2.data});
     }
    
     catch(error)     {
         console.log("failed to make request:",error.message);
         res.status(500).send("Failed to fetch activity,Please try again");
     }
 });
 app.post("/",async(req,res)=>{
     try{
        stocksymbol3=req.body["stock3"];
       
    const response3=await axios.get("https://api.twelvedata.com/price?symbol="+stocksymbol3+"&apikey=7ac0710db5b34e2ba2fbef2d65679600");
     res.render("profile.ejs",{Symbol3:stocksymbol3,data3:response3.data});
     }
    
     catch(error)
     {
         console.log("failed to make request:",error.message);
         res.status(500).send("Failed to fetch activity,Please try again");
     }
 });
app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
});