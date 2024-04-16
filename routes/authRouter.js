import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email }, { _id: 1 }).lean();

  if (user) {
    return res.status(409).json({ message: "Email already taken" });
  }

  try {
    const newUser = new User({ username, email });
    await newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "No such user" });
  }

  const isPassportValid = await user.validatePassword(password);
  if (isPassportValid) {
    // payload to dane, które chcemy przekazać w tokenie
    const payload = { id: user._id, username: user.username };

    // podpisanie tokena
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: "Invalid password" });
  }
});

export default router;
