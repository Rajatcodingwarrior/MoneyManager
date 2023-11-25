import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cron from "node-cron";
import nodemailer from "nodemailer";

const app=express();
app.use(express.static("public"));
const port=5000;

app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/RecurringDB");
const recurringSchema=new mongoose.Schema({
    billName:String,
    amount:Number,
    recurringDate:Number,
    pay:Number
});
const RecurringBills=mongoose.model("RecurringBills",recurringSchema);

var today= new Date();   
var dd=today.getDate();
var mm=today.getMonth()+1;
var yyyy=today.getFullYear();
if(mm<10)
mm='0'+mm;
if(dd<10)
dd='0'+10;
var date=dd+'-'+mm+'-'+yyyy;
app.get("/",(req,res)=>{
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
   res.redirect("/");
   
   
  
});

app.post("/delete",async(req,res)=>{
    var val=req.body["pay"];
    var value=req.body["trash"];
    let d=await RecurringBills.find({_id:val}).exec(); 
    let upd = await RecurringBills.findOneAndUpdate({_id:val}, {pay:1});
    console.log(upd);
     
    // console.log(d);
  let doc= await RecurringBills.deleteOne({_id:value});
  
   res.redirect("/");
   

});
// Function to send notifications
// async function showNotification(){
 
//     // Logic to fetch data from the database and check for dates
//     console.log("hello");
//     const date = new Date();
//     const todayDate=date.getDate();
//     console.log(todayDate);
//     let d=await RecurringBills.find({recurringDate:todayDate}).exec();
//     d.forEach(function(item){
//       // console.log(item.amount);
//       if(item.amount){
//         console.log(todayDate);
//        render("index.ejs",{notifications:item});
//       } 
//     });
  //  console.log(d.amount);
    
    // Function to display notifications
  // function displayNotification(message) {
  //   // Create a notification element
  //   const notification = document.createElement('div');
  //   notification.classList.add('notification');
  //   notification.textContent = message;
  
  //   // Append the notification to the container
  //   const container = document.getElementById('notificationContainer');
  //   container.appendChild(notification);
  
  //   // Automatically remove the notification after a few seconds
  //   setTimeout(() => {
  //     container.removeChild(notification);
  //   }, 5000); // Adjust the time (in milliseconds) for how long the notification should be displayed
  // }
  
  // // Example: Trigger a notification
  // displayNotification('This is a notification message!');
  
    // If a matching date is found, send notifications using nodemailer
    // Example: Send email notifications
    // ...
  
  // }


// Schedule the function to run every hour (adjust as needed)
// cron.schedule('* * * * *', (res) => {
//   // sendNotifications();
//   console.log("hi");
//   showNotification();

// });

app.listen(port,()=>{
  console.log(`server is listening on port ${port}`);
});
