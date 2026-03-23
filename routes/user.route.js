import { sosHistory, sosTriggered } from "../controller/sos.controller.js";
import {
  userLogin,
  userSignup,
  emergencyUpdate,
  sendData,
} from "../controller/user.controller.js";
import express from "express";

const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/profile/:id", sendData);
router.get("/sosRecords/:id", sosHistory);
router.post("/sos", sosTriggered);
router.put("/emergecyUpdate", emergencyUpdate);

export default router;
