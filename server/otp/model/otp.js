const { Schema, model } = require("mongoose");

const otpSch = Schema(
  {
    username:{
      type:String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 300 }
    }
  },
  { timestamps: true } // Auto remove after 5 minutes
);

module.exports.Otp = model("Otp", otpSch);
