
const mongoose = require("mongoose");
const { use } = require("react");

const sessionSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    token: String,
    createdAt: {type: Date, default: Date.now, expires: 3600} // expira en 1h
});
module.exports=mongoose.model("Session",sessionSchema);