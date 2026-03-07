require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET;

// CONNECT MONGODB FROM .ENV
console.log("MONGO URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));


// USER SCHEMA
const UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    contacts:[
        {
            name:String,
            phone:String
        }
    ]
});

const User = mongoose.model("User",UserSchema);



/* ---------------- SIGNUP ---------------- */

app.post("/signup", async (req,res)=>{
    try{

        const {name,email,password} = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({
            name,
            email,
            password:hashedPassword,
            contacts:[]
        });

        await user.save();

        res.json({message:"Signup successful"});

    }
    catch(err){
        res.status(500).json({error:err.message});
    }
});



/* ---------------- LOGIN ---------------- */

app.post("/login", async (req,res)=>{
    try{

        const {email,password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid password"});
        }

        const token = jwt.sign(
            {id:user._id},
            JWT_SECRET,
            {expiresIn:"1h"}
        );

        res.json({
            message:"Login successful",
            token
        });

    }
    catch(err){
        res.status(500).json({error:err.message});
    }
});



/* ---------------- AUTH MIDDLEWARE ---------------- */

function authMiddleware(req,res,next){

    const authHeader = req.headers["authorization"];

    if(!authHeader){
        return res.status(401).json({message:"Token missing"});
    }

    const token = authHeader.split(" ")[1];

    try{

        const decoded = jwt.verify(token,JWT_SECRET);

        req.user = decoded;

        next();

    }
    catch(err){
        res.status(401).json({message:"Invalid Token"});
    }

}



/* ---------------- GET USER INFO ---------------- */

app.get("/api/auth/me", authMiddleware, async (req,res)=>{

    try{

        const user = await User.findById(req.user.id).select("-password");

        res.json(user);

    }
    catch(err){
        res.status(500).json({error:err.message});
    }

});



/* ---------------- ADD EMERGENCY CONTACT ---------------- */

app.post("/api/contacts/add", authMiddleware, async (req,res)=>{

    try{

        const {name,phone} = req.body;

        const user = await User.findById(req.user.id);

        user.contacts.push({name,phone});

        await user.save();

        res.json({message:"Contact added",contacts:user.contacts});

    }
    catch(err){
        res.status(500).json({error:err.message});
    }

});



/* ---------------- GET CONTACTS ---------------- */

app.get("/api/contacts", authMiddleware, async (req,res)=>{

    try{

        const user = await User.findById(req.user.id);

        res.json(user.contacts);

    }
    catch(err){
        res.status(500).json({error:err.message});
    }

});



app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});