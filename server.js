const express=require("express")
const mysql=require("mysql2")
const{urlencoded,json}=require("body-parser")
const app=express()
const dotenv =require("dotenv");
const { PrismaClient } = require("@prisma/client");
dotenv.config();
app.use(express.urlencoded({extended:true}))
app.use(json())
const prisma = new PrismaClient()




app.get("/users" ,async(req,res) => {
    try{
    const data=await prisma.user.findMany()
    console.log(data[0]);
    if(data.length===0) return res.status(404).send({message:"users not found"})
    res.status(200).send(data[0]);
    }catch(err){
        res.status(500).send({error:{message:err.message}})
    }
})


//get specific user
app.get("/users/:id" , async(req,res) => {
 try{
    const paramsId =req.params.id;
    const data=await prisma.user.findUnique({where:{id:paramsId}})
    if (!data)return res.status(404).send({error:{message:"user not found"}})
    res.status(200).send(data[0]);
 }catch(err){
    res.status(500).send({error:{message:err.message}})
 }
} )
//create user
app.post("/users",async(req,res) =>{
 try{
      const {username,age,mark,email}=req.body;
      if (!username||!mark||!age)return res.status(400).send({message:"you should pass all the data(id,username,mark,age"})
       await prisma.user.create({data:{username,mark:Number(mark),age:Number(age),email}})
      
      res.status(201).send("created user")
    }catch(err){
        res.status(500).send({error:{message:err.message}})
    }
})
//edit on user
app.put("/users",async(req,res)=>{
    try{
const {id,username,mark,age,email}=req.body
if (!id||!username||!mark||!age) return res.status(400).send({message:"you should pass all the data(age,username,mark,id"})

 const result= await prisma.user.update({where:{id},data:{username,mark:Number(mark),age:Number(age),email}})
 console.log(result);
 if (!result)return res.status(404).send({message:"user id updated"})
res.status(200).send({error:{message:err.message}})
    }catch(err){
        res.status(500).send({error:{message:err.message}})
    }
})
//delete user
app.delete("/users/:id", async(req,res)=>{
    try{
   const result= await prisma.user.delete({where:{id:req.params.id}})
   if (!result)return res.status(404).send({message:"user id updated"})
    res.status(200).send("user is deleted")
    }catch(err){
        res.status(500).send({error:{message:err.message}})
    }
})

app.listen(3000,() =>{
    console.log("listen on port 3000");
})