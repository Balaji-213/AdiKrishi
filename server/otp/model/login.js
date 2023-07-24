const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const loginSch = Schema(
  {
    username : {
      type: String,
      required: true
    },
    mobile : {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

loginSch.methods.generateTkn = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      mobile: this.mobile,
      issuer: "BalajiNK"
    },
    "153426",
    { expiresIn: "1d" }
  );
};

module.exports.Login = model("Login", loginSch);