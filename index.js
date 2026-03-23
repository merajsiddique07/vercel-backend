import express, { json } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://vercel-frontend-pi-ten.vercel.app",
    ],
    credentials: true,
  }),
);

main()
  .then(() => {
    console.log("DB connected!");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}
app.listen(PORT, () => {
  console.log("Listening at port ", PORT);
});

//use below

app.get("/", (req, res) => {
  res.send("🚀 Backend Running");
});

app.use("/user", router);
