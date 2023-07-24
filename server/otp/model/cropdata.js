const { Schema, model } = require("mongoose");

const cropSch = Schema(
  {
    company : {
      type: String,
      required: true
    },
    GST : {
      type: String,
      required: true
    },
    dname : {
      type: String,
      required: true
    },
    crop : {
      type: String,
      required: true
    },
    cropname : {
      type: String,
      required: true
    },
    rate : {
      type: String,
      required: true
    },
    quantype : {
      type: String,
      required: true
    },
    // note : {
    //   type: String,
    //   required: true
    // },
    image : {
      type: String,
      required: true
    },
    quan : {
      type: String,
      required: true
    }
  }
//   { timestamps: true }
);

module.exports.Cropdata = model("Cropdata", cropSch);
 