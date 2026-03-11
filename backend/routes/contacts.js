const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;


// AUTH MIDDLEWARE
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


// GET CONTACTS (ONLY USER CONTACTS)

router.get("/", authMiddleware, async (req,res)=>{

  const contacts = await Contact.find({
    userId: req.user.id
  });

  res.json(contacts);
});


// ADD CONTACT

router.post("/", authMiddleware, async (req,res)=>{

  const {name,phone} = req.body;

  const newContact = new Contact({
    name,
    phone,
    userId: req.user.id
  });

  await newContact.save();

  res.json(newContact);
});


// DELETE CONTACT

router.delete("/:id", authMiddleware, async (req,res)=>{

  await Contact.findOneAndDelete({
    _id:req.params.id,
    userId:req.user.id
  });

  res.json({message:"Deleted"});
});


// UPDATE CONTACT

router.put("/:id", authMiddleware, async (req,res)=>{

  const {name,phone} = req.body;

  const updated = await Contact.findOneAndUpdate(
    {
      _id:req.params.id,
      userId:req.user.id
    },
    {name,phone},
    {new:true}
  );

  res.json(updated);
});


module.exports = router;