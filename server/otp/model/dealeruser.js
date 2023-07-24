const { Schema, model } = require("mongoose");

const delusrSch = Schema(
  {
    name : {
      type: String,
      required: true
    },
    username : {
      type: String,
      required: true
    },
    email : {
      type: String,
      required: true
    },
    address : {
      type: String,
      required: true
    },
    mobile : {
      type: String,
      required: true
    },
    type : {
        type : String,
        required : true
    },
    image : {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

module.exports.Dealeruser = model("Dealeruser", delusrSch);
 