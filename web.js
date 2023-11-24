
             
import express from "express";
import bodyParser  from "body-parser";
import mongoose from "mongoose";
import axios from "axios";
import session from "express-session";






const app=express();
app.use(express.static('public'));

  app.use(bodyParser.urlencoded({extended:true}));
  app.use(session({
    secret: 'your-secret-key',
    resave: false, // Only save the session if a change has been made
    saveUninitialized: true, // Save uninitialized sessions (new sessions)
    cookie: {
        maxAge: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
     }
  }));


const url=mongoose.connect("mongodb://127.0.0.1:27017/USERDATA");
var db=mongoose.connection;

const userSchema=new mongoose.Schema({Name:String,Email:String,Username:String,Password:String,Age:Number,Gender:String});
const User=mongoose.model("User",userSchema);
const itemSchema=new mongoose.Schema({email:String,sno:Number,amount:Number,category:String,account:String,date:String,month:String,year:String,sumd:Number,summ:Number});
const Data=new mongoose.model("Data",itemSchema);
const dailySchema=new mongoose.Schema({email:String,date:String,sum:Number});
const Day=new mongoose.model("Day",dailySchema);
const monthSchema=new mongoose.Schema({email:String,month:String,sum:Number});
const Month=new mongoose.model("Month",monthSchema);
const yearSchema=new mongoose.Schema({email:String,year:String,sum:Number});
const Year=new mongoose.model("Year",yearSchema);

var ans=false;
var data;
var cnt=1;

 
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
        return res.redirect("/sign_up.html");

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
    app.get("/sign_up",(req,res)=>{
        res.set({"Allow-access-Allow-Origin":'*'})
       return res.redirect("/sign_up.html");});
       
    
    // app.post("/login",async(req,res)=>{
    
    //     var email=req.body["emailadd"];
    //     var password=req.body["pass"];
        
    //    let doc = await User.find({Email:email}).exec();
    //    let doc2=await Data.find({Email:email}).exec();

      
            
    //        if(doc[0].Password===password){
    //         let items = await Data.find({email:email,date:date}).exec();
    //         res.render("home.ejs",{newList:items,count:1,Date:date});
         
    //       }
    //        else{ 
    //        return res.redirect("/index (1).html");
    //        }
    //     });
    
    //     app.get("/",(req,res)=>{
    //         res.set({"Allow-access-Allow-Origin":'*'})
    //        return res.redirect("/index (1).html");
    //     });
    
     
    //     console.log(Email);
    app.get("/",async(req,res)=>{
        res.render("login.ejs");
    });
   
    app.post("/transactions",async(req,res)=>{
        var today= new Date();   
        var dd=today.getDate();
        var mm=today.getMonth()+1;
        var yyyy=today.getFullYear();
               if(mm<10)
                 mm='0'+mm;
                if(dd<10)
                 dd='0'+10;
                 var date=dd+'-'+mm+'-'+yyyy;
                 var email=req.body["emailadd"];
                 req.session.email=email;
                var password=req.body["pass"];
                
               let doc = await User.find({Email:email}).exec();
               console.log(doc);
                
              
                    
                   if(doc[0].Password===password){
                    let items = await Data.find({email:email,date:date}).exec();
                    res.render("home.ejs",{newList:items,count:1,Date:date});
                 
                  }
                   else{ 
                   return res.redirect("/index (1).html");
                   }
        
        });
        app.get("")
        



var currDate="";



var Email;

app.post("/home",async(req,res)=>{
     if(req.session.email)
     {
     Email=req.session.email;
     console.log(Email);
     req.session.email=Email;
    
     }
     var date=req.body["date"];
     
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
     var month=date.slice(3,10);
    var year=date.slice(6,10);
    
     req.session.date=date;
     var datax=await Day.find({email:Email,date:date}).exec();
     var s1=0;
     var s2=0;
     var s3=0;
     if(datax.length!=0)
     {
        if(datax[datax.length-1].sum)
        s1=s1+datax[datax.length-1].sum;
     }
     const it1=new Day({
        email:Email,
        date:date,
        sum:s1,
     });
     it1.save();
     var datay=await Month.find({email:Email,month:month}).exec();
     if(datay.length!=0)
     {
        if(datay[datay.length-1].sum)
        s2=s2+datay[datay.length-1].sum;
     }
     const it2=new Month({
        email:Email,
        month:month,
        sum:s2,
     });
     it2.save();
     var dataz=await Year.find({email:Email,year:year}).exec();
     if(dataz.length!=0)
     {
        if(dataz[dataz.length-1].sum)
        s3=s3+dataz[dataz.length-1].sum;
     }
     const it3=new Year({
        email:Email,
        year:year,
        sum:s3,
     });
     it3.save();

     
     
    const item=new Data({
        email:Email,
        amount:amt,
        category:category,
        account:accnt,
        date:date,
        month:month,
        year:year,
         
    });
      
    if(amt)
    item.save();



   let items = await Data.find({email:Email,date:date}).exec();
   res.render("home.ejs",{newList:items,newItem:item,count:1,Date:date});

});

var today= new Date();
        var dd=today.getDate();
        var mm=today.getMonth()+1;
        var yyyy=today.getFullYear();
        if(mm<10)
                 mm='0'+mm;
                if(dd<10)
                 dd='0'+10;
                var dat=dd+'-'+mm+'-'+yyyy;
                var dt;
                var Em;
 app.post("/delete",async(req,res)=>{
    var value=req.body["trash"];
    if(req.session.email)
     {
     Em=req.session.email;
     console.log(Em);
     req.session.email=Em;
     
     }
     console.log(Em);
      
     if(req.session.date)
     {
        dt=req.session.date;
        console.log(dt);

     }
     else{
        dt=dat;
   }
   let it=await Data.find({_id:value}).exec();
   let amt=it.amount;
   let year=it.year;
   let month=it.month;
   
  let doc= await Data.deleteOne({_id:value});
  console.log(doc);
  let items=await Data.find({email:Em,date:dt}).exec();
  let itd=await Day.find({email:Em,date:dt}).exec();
  let itm=await Month.find({email:Em,month:month}).exec();
  let ity=await Year.find({email:Em,year:year}).exec();
  if(itd.length!=0)
  {
  var it1=itd[itd.length-1].sum;
  var val=it1-amt;
  const a=new Day({
    email:Em,
    date:dt,
    sum:val,
  });
  a.save();
}
  if(itm.length!=0)
  {
    var it2=itm[itm.length-1].sum;
    var val=it2-amt;
    const b=new Month({
        email:Em,
        month:month,
        sum:val,
      });
      b.save(); 
  }
  
  if(ity.length!==0)
  {
    var it3=ity[ity.length-1].sum;
    var val=it3-amt;
    const c=new Year({
        email:Em,
        year:year,  
        sum:val,
      });
      c.save();
     
    
  
  }

 
 
 
  

 res.render("home.ejs",{newList:items,count:1,Date:dt});

   

});
var stocksymbol1="";

var em;
var Value;

 app.get("/report",async(req,res)=>{ 
    var day=req.body["date"];  
    req.session.day=day;
    var month=req.body["month"];
    req.session.month=month;
    var year=req.body["year"];
    req.session.year=year;
    var curr=req.body["currency"];
    req.session.curr=curr;
    if(req.session.email)
    {
        em=req.session.email;
        console.log(em);

        
    }
    var xvalue=[];
    var yvalue=[];
    let info=await User.find({Email:em}).exec();
    console.log(info); 
    // const response=await axios.get("https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_kG3X2CqJ0JRhkuENm95Qv83mNz2PsLqyMqvjF1pe&currencies="+req.session.curr+"%2CUSD%2CCAD");
    if(req.session.curr==="INR")
   Value=response.data.data.INR;
    else if(req.session.curr==="EUR")
    Value=response.data.data.EUR;
  
    else if(req.session.curr==="AUD")
    Value=response.data.data.AUD;
    
   else if(req.session.curr==="BGN")
   Value=response.data.data.BGN;
   
    else if(req.session.curr==="HKD")
    Value=response.data.data.HKD;

    else if(req.session.curr==="CNY")
    Value=response.data.data.CNY;
    
    
    if(req.session.day)
    {
        console.log("hello");
        var items= await Data.find({email:em,date:day}).exec();
      
        res.render("profile.ejs",{newList:items,count:1,Info:info,value:Value,xvalue:xvalue,yvalue:yvalue});
    } 
    else if(req.session.month){
       
        var items=await Data.find({email:em,month:month}).exec();
        console.log("hii");
        for(var i=0;i<items.length-1;i++)
        {
            if(items[i].date!=items[i+1].date)
            {
                var it=await Day.find({email:em,date:items[i].date}).exec();
                xvalue.push(it[it.length-1].date);
                yvalue.push(it[it.length-1].sum);

            }
        }
        var it=await Day.find({email:em,date:items[items.length-1]});
        xvalue.push(it[it.length-1].date);
        yvalue.push(items[it.length-1].sum);
        
        console.log(items);

        res.render("profile.ejs",{newList:items,count:1,Info:info,value:Value,xvalue:xvalue,yvalue:yvalue});
    }
    else if(req.session.year){
        var items=await Data.find({email:em,year:year}).exec();
        
        res.render("profile.ejs",{newList:items,count:1,Info:info,value:Value});
    }
    else
    res.render("profile.ejs",{Info:info,xvalue:xvalue,yvalue:yvalue});
    
   
 });
 app.post("/report",async(req,res)=>{
    var day=req.body["date"];  
    req.session.day=day;
    var month=req.body["month"];
    req.session.month=month;
    var year=req.body["year"];
    req.session.year=year;
    var curr=req.body["currency"];
    req.session.curr=curr;
    if(req.session.email)
    {
        em=req.session.email;
        console.log(em);

        
    }
    var xvalue=[];
    var yvalue=[];
    let info=await User.find({Email:em}).exec();
    console.log(info); 
    if(req.session.day)
    {
        console.log("hello");
        var items= await Data.find({email:em,date:day}).exec();
      
        res.render("profile.ejs",{newList:items,count:1,Info:info,value:Value,xvalue:xvalue,yvalue:yvalue});
    } 
    else if(req.session.month){
       
        var items=await Data.find({email:em,month:month}).exec();
        console.log("hii");
        for(var i=0;i<items.length-1;i++)
        {
            if(items[i].date!=items[i+1].date)
            {
                var it=await Day.find({email:em,date:items[i].date}).exec();
                xvalue.push(it[it.length-1].date);
                yvalue.push(it[it.length-1].sum);

            }
        }
        var it=await Day.find({email:em,date:items[items.length-1]});
        xvalue.push(it[it.length-1].date);
        yvalue.push(items[it.length-1].sum);
        
        console.log(items);

        res.render("profile.ejs",{newList:items,count:1,Info:info,value:Value,xvalue:xvalue,yvalue:yvalue});
    }
    else if(req.session.year){
        var items=await Data.find({email:em,year:year}).exec();
        
        res.render("profile.ejs",{newList:items,count:1,Info:info,value:Value});
    }
    else
    res.render("profile.ejs",{Info:info,xvalue:xvalue,yvalue:yvalue});
    

 })

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


// app.get("/",(req,res)=>{
//     res.set({"Allow-access-Allow-Origin":'*'})
//     return res.sendFile("/sign_up.html");
// });
app.listen(4000,()=>{
    console.log("Listening to port 4000");
});

