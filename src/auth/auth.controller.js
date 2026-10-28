import { db } from "../prisma/db.ts";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { errorMessage } from "../utils/errorMesage.js";
import { sucessMessage } from "../utils/sucessMesage.js";
import { loginUser, myUser, registerUser } from "./auth.service.js";

export const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorMessage(res, 400, "Name, Email and Password are required");
    }

    const existingEmail = await loginUser(email);

    if (existingEmail) {
      return errorMessage(res, 409, "Email already exists");
    }

    const hashedPassword = await argon2.hash(password);

    const data = {
      name,
      email,
      password: hashedPassword,
    };

    const user = await registerUser(data);

    const { password: _password, ...safeUser } = user;

    return sucessMessage(res, 201, "User created successfully", safeUser);
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorMessage(res, 400, "Email and Password are required");
    }

    const user = await loginUser(email);

    if (!user) {
      return errorMessage(res, 404, "User not found");
    }

    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      return errorMessage(res, 401, "Invalid email or password");
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.cookie("access_token", accessToken, {});

    const { password: _password, ...safeUser } = user;

    return sucessMessage(res, 200, "Login successful", safeUser);
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};
export const logoutController = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    return sucessMessage(res, 200, "Logout sucessfull");
  } catch (error) {
    next(error);
  }
};

export const myUserController = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    console.log("Authenticated user ID:", userId);

    const currentUser = await myUser(userId);

    if (!currentUser) {
      return errorMessage(res, 404, "User not found");
    }

    const { password: _password, ...safeUser } = currentUser;

    return sucessMessage(res, 200, "User fetched successfully", safeUser);
  } catch (error) {
    console.error("My user controller error:", error);
    next(error);
  }
};
