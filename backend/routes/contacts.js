import express from "express";
import Contact from "../models/Contact.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ADD CONTACT */

router.post("/add", authMiddleware, async (req, res) => {

  try {

    const { name, phone, relationship } = req.body;

    const contact = new Contact({
      userId: req.user.userId,
      name,
      phone,
      relationship
    });

    await contact.save();

    res.json({ msg: "Contact added", contact });

  } catch (error) {

    res.status(500).json({ msg: "Server error" });

  }

});

/* GET CONTACTS */

router.get("/", authMiddleware, async (req, res) => {

  try {

    const contacts = await Contact.find({
      userId: req.user.userId
    });

    res.json(contacts);

  } catch (error) {

    res.status(500).json({ msg: "Server error" });

  }

});

export default router;