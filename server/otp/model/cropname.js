const { Schema, model } = require("mongoose");

const cropNameSch = Schema(
  {
    name : {
      type: String,
      required: true
    }
  }
//   { timestamps: true }
);

module.exports.Cropname = model("Cropname", cropNameSch);
 