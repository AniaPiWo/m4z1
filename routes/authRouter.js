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
    const accessToken = jwt.sign(payload, process.env.SECRET, {
      //expiresIn: "40s", // czas do testow
      expiresIn: "12h", //legitny czas
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return res.json({ accessToken, refreshToken });
  } else {
    return res.status(401).json({ message: "Invalid password" });
  }
});

router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.headers.authorization;

  if (!refreshToken) {
    return res.status(401).json({ message: "Token missing" });
  }

  // oddzielamy slowo "Bearer" od tokena i zapisujemy sam token
  const splitToken = refreshToken.split(" ")[1];

  jwt.verify(
    splitToken,
    process.env.REFRESH_SECRET,
    async (error, decodedToken) => {
      console.log("decodedToken:", decodedToken);
      if (error) {
        // jesli token jest niepoprawny, ktos przy nim "grzebal"
        return res.status(403).json({ message: "Invalid token" });
      }

      const user = await User.findOne({ _id: decodedToken.id });
      if (!user) {
        return res.status(401).json({ message: "No such user" });
      }

      //tworzymy nowy payload - obiekt ktory zapiszemy w tokenie
      const payload = { id: user._id, username: user.username };

      // na nowo tworzymy short token i podpisujemy token
      const accessToken = jwt.sign(payload, process.env.SECRET, {
        //expiresIn: "40s", // czas do testow
        expiresIn: "12h", //czas legitny
      });

      const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
        // user nie bedzie musial sie logowac ponownie przez 30 dni
        expiresIn: "30d",
      });

      return res.status(200).json({ accessToken, refreshToken });
    }
  );
});

export default router;
