const { Schema, model } = require("mongoose");

const ordSch = Schema(
  {
    crop : {
      type: String,
      required: true
    },
    rate : {
      type: String,
      required: true
    },
    dname : {
      type: String,
      required: true
    },
    price : {
      type: String,
      required: true
    }
  }
//   { timestamps: true }
);

module.exports.Order = model("Order", ordSch);
 