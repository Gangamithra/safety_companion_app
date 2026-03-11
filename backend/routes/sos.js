const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Contact = require("../models/Contact");
const mongoose = require("mongoose");
const twilio = require("twilio");
const User = require("../models/User");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

/* -------- TWILIO SETUP -------- */

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/* -------- AUTH MIDDLEWARE -------- */

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
    res.status(401).json({message:"Invalid token"});
  }

}


/* -------- SOS ROUTE -------- */

router.post("/", authMiddleware, async (req,res)=>{

    try{
  
      const {lat,lng} = req.body;
  
      const contacts = await Contact.find({
        userId:req.user.id
      });
  
      if(contacts.length === 0){
        return res.json({
          message:"No emergency contacts found"
        });
      }
  
      /* GET USER NAME */
  
      const user = await User.findById(req.user.id);
  
      /* GOOGLE MAPS LINK */
      const locationLink =
      `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}`;
  
      /* SMS MESSAGE */
  
      const message =
  `🚨 EMERGENCY ALERT
  
  ${user.name} needs help!
  
  Location:
  ${locationLink}`;
  
      for(const contact of contacts){
  
        await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE,
          to: contact.phone
        });
  
      }
  
      res.json({
        message:"SOS alert sent to all contacts"
      });
  
    }
    catch(err){
      console.log(err);
      res.status(500).json({error:err.message});
    }
  
  });
module.exports = router;