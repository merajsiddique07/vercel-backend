import mongoose from "mongoose";
import { Schema } from "mongoose";

const sosSchema = Schema({
  userId: Schema.Types.ObjectId,
  location: [
    {
      lat: Number,
      lng: Number,
      address: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  videoUrl: [
    {
      frontVideo: String,
      backVideo: String,
    },
  ],
});

export const Sos = mongoose.model("Sos", sosSchema);
