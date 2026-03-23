import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
    },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }, // short life
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
    },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }, // long life
  );
};
