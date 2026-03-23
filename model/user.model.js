import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";

const userSchema = Schema({
  fullname: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  avatar: String,
  emergencyContact: {
    name: String,
    phone: String,
    email: String,
  },
  sosHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Sos",
    },
  ],
});

export const User = model("User", userSchema);
