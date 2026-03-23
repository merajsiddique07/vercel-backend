import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//signup
export const userSignup = async (req, res) => {
  try {
    const { fullname, email, phone, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    const User1 = await User.insertOne({
      fullname,
      email,
      phone,
      password: hashPassword,
    });
    await User1.save();
    return res.status(200).json({ message: "Signed Up successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server error!" });
  }
};

//login
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const userData = {
      id: user._id,
      emerData: user.emergencyContact,
    };
    if (!user) {
      return res.status(404).json({ meassage: "User does not exists!" });
    }
    const hashPassword = await bcrypt.compare(password, user.password);
    if (!hashPassword) {
      return res.status(404).json({ meassage: "Wrong Password!" });
    }
    res.json({ message: "Login successful", userData });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ meassage: "Internal Server error!", err: error });
  }
};
//sending data

export const sendData = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User does not exists!" });
    }
    const userDetails = {
      fullname: user.fullname,
      avatar: user.avatar,
      email: user.email,
      emergencyContacts: {
        email: user.emergencyContact.email,
        phone: user.emergencyContact.phone,
        name: user.emergencyContact.name,
      },
    };
    res.status(201).json({ userDetails });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error!" });
  }
};

//refresh token

export const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newAccessToken = jwt.sign(decoded, process.env.ACCESS_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed" });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

//update
export const emergencyUpdate = async (req, res) => {
  try {
    const { fullname, email, avatar, emergencyContact } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      await User.updateOne(
        { email: email },
        {
          $set: {
            fullname: fullname,
            avatar: avatar,
            "emergencyContact.name": emergencyContact.name,
            "emergencyContact.phone": emergencyContact.phone,
            "emergencyContact.email": emergencyContact.email,
          },
        },
      );

      res.status(200).json({
        message: "Emergency contact updated successfully",
        newEmerg: {
          fullanme: fullname,
          avatar: avatar,
          name: emergencyContact.name,
          email: emergencyContact.email,
          phone: emergencyContact.phone,
        },
      });
    } else {
      return res.status(404).json({ meassage: "User does not exists!" });
    }
  } catch (error) {
    res.status(500).json({ meassage: "Server Error" });
  }
};
