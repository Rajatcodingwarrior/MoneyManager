
             
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
const recurringSchema=new mongoose.Schema({
    billName:String,
    amount:Number,
    recurringDate:Number,
    pay:Number
});
const RecurringBills=mongoose.model("RecurringBills",recurringSchema);

var ans=false;
var data;
var cnt=1;

app.get("/",(req,res)=>{
    res.render("first.ejs");
});
app.get("/login",(req,res)=>{
    res.render("login.ejs");
});
app.get("/sign_up",(req,res)=>{
    res.render("sign_up.ejs");
})

 app.post("/login",async(req,res)=>{
    var today= new Date();   
    var dd=today.getDate();
    var mm=today.getMonth()+1;
    var yyyy=today.getFullYear();
           if(mm<10)
             mm='0'+mm;
            if(dd<10)
             dd='0'+10;
             var date=dd+'-'+mm+'-'+yyyy;
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
            return res.redirect("/sign_up");
        }
        else if(data.Username.length<6|| data.Password.length<6)
        return res.redirect("/sign_up");

        else if(password===confpassword && name!="" && username!="" && (gender==="Male"||gender==="Female"||gender==="Other") && age!="" && email!="")
        {
         var user=new User(data);
         user.save();
          ans=true;
        res.render("login.ejs");
       
        }
        else
        return res.redirect("/sign_up");
        
    });
    app.get("/sign_up",(req,res)=>{
        res.set({"Allow-access-Allow-Origin":'*'})
       return res.redirect("/sign_up");});
       
   
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

var currDate="";



var Email;
app.get("/recurringbills",(req,res)=>{
    var today= new Date();   
var dd=today.getDate();
var mm=today.getMonth()+1;
var yyyy=today.getFullYear();
if(mm<10)
mm='0'+mm;
if(dd<10)
dd='0'+10;
var date=dd+'-'+mm+'-'+yyyy;
    async function readData() {
      try {
        async function showNotification(){
          const date = new Date();
          const todayDate=date.getDate();
          let d=await RecurringBills.find({recurringDate:{$lt :todayDate}}).exec();
          for(var i=0;i<d.length;i++)
          { 
            let upd = await RecurringBills.findOneAndUpdate({_id:d[i]._id}, {pay:0});
            
          }
          return d;
        }
        const recurring_bills = await RecurringBills.find({});
       let d= await showNotification();
      
            console.log(d);
             
              res.render("index.ejs",{newList:recurring_bills,count:1,Date:date,notifications:d});
           
            
         
  
         
      } catch (error) {
        console.error('Error:', error);
      }
    }
      
     readData();
  });
  
  app.post("/add",(req,res)=>{
     
    const recurringBillName= new RecurringBills({
      billName:req.body["recurringBillName"],
      amount:req.body["amount"],
      recurringDate:req.body["recurringdate"],
      pay:0
      
     });
     if(req.body["amount"])
     recurringBillName.save();
     res.redirect("/recurringbills");
     
     
    
  });
  
  app.post("/del",async(req,res)=>{
      var val=req.body["pay"];
      var value=req.body["trash"];
      let d=await RecurringBills.find({_id:val}).exec(); 
      let upd = await RecurringBills.findOneAndUpdate({_id:val}, {pay:1});
      console.log(upd);
       
      // console.log(d);
    let doc= await RecurringBills.deleteOne({_id:value});
    
     res.redirect("/recurringbills");
     
  
  });
  app.get("/front",(req,res)=>{
    res.render("first.ejs");
  })
  

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
     {
        var today= new Date();   
        var dd=today.getDate();
        var mm=today.getMonth()+1;
        var yyyy=today.getFullYear();
               if(mm<10)
                 mm='0'+mm;
                if(dd<10)
                 dd='0'+10;
      date=dd+"-"+mm+"-"+yyyy;
     }
    else
    date=currDate;
     }
     currDate=date;
     req.session.date=date; 
     var month=date.slice(3,10);
    var year=date.slice(6,10);
     console.log(req.session.date);
     var datax=await Day.find({email:Email,date:date}).exec();
     var s1=0;
     var s2=0;
     var s3=0;
     if(amt){
        let datax=await Day.find({email:Email,date:date}).exec();
        var s1=0;
        var s2=0;
        var s3=0;
     if(datax.length===0)
     {
        s1=parseInt(amt,10);

     }
     else
     {
        var x=(datax[datax.length-1].sum);
        s1=parseInt(amt,10)+parseInt(x,10);
        console.log(s1);
     } 
     const it1=new Day({
        email:Email,
        date:date,
        sum:s1,
     });
     it1.save();
     let datay=await Month.find({email:Email,month:month}).exec();
     if(datay.length===0)
        s2=parseInt(amt,10);
        else
        {
            var y=(datay[datay.length-1].sum);
            s2=parseInt(amt,10)+parseInt(y,10);
        }

   
     const it2=new Month({
        email:Email,
        month:month,
        sum:s2,
     });
     it2.save();
     let dataz=await Year.find({email:Email,year:year}).exec();
     if(dataz.length===0) 
        s3=parseInt(amt,10);
    else
    {
        var z=(dataz[dataz.length-1].sum);
        s3=parseInt(amt,10)+parseInt(z,10);
    }
     
     const it3=new Year({
        email:Email,
        year:year,
        sum:s3,
     });
     it3.save();
    } 

     
     
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

                var dt;
                var Em;
 app.post("/delete",async(req,res)=>{
    var value=req.body["trash"];
    if(req.session.email)
     {
     Em=req.session.email;
     req.session.email=Em;
     
     }
     console.log(Em);
      
     if(req.session.date)
     {
        dt=req.session.date;
       

     }
     console.log(dt);
    
   let it=await Data.find({_id:value}).exec();
   var amt=it[0].amount;
   var year=it[0].year;
   var month=it[0].month;
   console.log(amt);
    
  let doc= await Data.deleteOne({_id:value});
  let items=await Data.find({email:Em,date:dt}).exec();
  let itd=await Day.find({email:Em,date:dt}).exec(); 
  let itm=await Month.find({email:Em,month:month}).exec();
  let ity=await Year.find({email:Em,year:year}).exec();
 
  if(itd.length!=0)

  {
  var it1=itd[itd.length-1].sum;  
  console.log(it1);
  var val=parseInt(it1,10)-parseInt(amt,10);
  console.log(val);
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
    var val=parseInt(it2,10)-parseInt(amt,10);
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
    var val=parseInt(it3,10)-parseInt(amt,10); 
    const c=new Year({
        email:Em,
        year:year,  
        sum:val,
      });
      c.save();
     
    
  
  }

res.render("home.ejs",{newList:items,count:1,Date:dt});

   

});
app.get("/categories",(req,res)=>{
    res.render("categories.ejs");
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
     
    if(req.session.day)
    {
        console.log("hello");
        var items= await Data.find({email:em,date:day}).exec();
      
        res.render("profile.ejs",{newList:items,count:1,Info:info,value:Value,xvalue:xvalue,yvalue:yvalue,value:Value});
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
    let info=await User.find({Email:em}).exec();

    

    var xvalue=[];
    var yvalue=[]; 
    console.log(info); 
    if(req.session.day)
    {
        console.log("hello");
        let items= await Data.find({email:em,date:day}).exec();
      
        res.render("profile.ejs",{newList:items,count:1,Info:info,value:Value,xvalue:xvalue,yvalue:yvalue});
    } 
    else if(req.session.month){
       
        let items=await Data.find({email:em,month:month}).exec();
        console.log("hii");
        for(var i=0;i<items.length;i++)
        {
            if(!xvalue.includes(items[i].date))
            {
            let it=await Day.find({email:em,date:items[i].date}).exec();
            yvalue.push(it[it.length-1].sum);
            xvalue.push(items[i].date);
            }
            
        }
         
        console.log(items);

        res.render("profile.ejs",{newList:items,count:1,Info:info,value:Value,xvalue:xvalue,yvalue:yvalue});
    }
    else if(req.session.year){
        let items=await Data.find({email:em,year:year}).exec();
        console.log("hii");
        for(var i=0;i<items.length;i++)
        {
            if(!xvalue.includes(items[i].month))
            {
            let it=await Month.find({email:em,month:items[i].month}).exec();
            yvalue.push(it[it.length-1].sum);
            xvalue.push(items[i].month);
            }
            
        }
        
        res.render("profile.ejs",{newList:items,count:1,Info:info,xvalue:xvalue,yvalue:yvalue});
    }
    else
    res.render("profile.ejs",{Info:info,xvalue:xvalue,yvalue:yvalue});
    

 });
 var e;

app.post("/stockprice",async(req,res)=>{
        if(req.session.email)
        {
            e=req.session.email;
            console.log(e);
    
            
        }
        let xvalue=[];
        let yvalue=[];
        let info=await User.find({Email:e}).exec();
        stocksymbol1=req.body["stock1"];

    const response=await axios.get("https://api.twelvedata.com/price?symbol="+stocksymbol1+"&apikey=7ac0710db5b34e2ba2fbef2d65679600");
    res.render("profile.ejs",{Symbol1:stocksymbol1,data1:response.data,Info:info,xvalue:xvalue,yvalue:yvalue});
 
});


// app.get("/",(req,res)=>{
//     res.set({"Allow-access-Allow-Origin":'*'})
//     return res.sendFile("/sign_up.html");
// });
app.listen(4000,()=>{
    console.log("Listening to port 4000");
});

