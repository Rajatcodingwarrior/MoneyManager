const mongoose=require('mongoose');

const url=mongoose.connect("mongodb://127.0.0.1:27017/UserDB");

const personSchema=new mongoose.Schema({name:String,age:Number});
const User=mongoose.model("User",personSchema);
const user=new User({name:"Shaurya",age:19});
Fruits.find(function(err,persons)){
    if(err)
    console.log(err);
   else
   {
     persons.forEach(function(person) =>{
     console.log(person.name);        
    });
   }
} 