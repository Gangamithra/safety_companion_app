const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: String,
  phone: String,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Contact", ContactSchema);