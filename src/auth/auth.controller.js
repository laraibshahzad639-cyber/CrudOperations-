import { db } from "../prisma/db.ts";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { errorMessage } from "../utils/errorMesage.js";
import { sucessMessage } from "../utils/sucessMesage.js";
import { loginUser, myUser, registerUser } from "./auth.service.js";
import { getUserById } from "../user/user.service.js";

export const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return errorMessage(res, 400, "Name, Email and Password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingEmail = await loginUser(normalizedEmail);

    if (existingEmail) {
      return errorMessage(res, 409, "Email already exists");
    }

    const hashedPassword = await argon2.hash(password);

    const data = {
      name: name.trim(),
      email: normalizedEmail,
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

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return errorMessage(res, 400, "Email and Password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await loginUser(normalizedEmail);

    if (!user) {
      return errorMessage(res, 401, "Invalid email or password");
    }

    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      return errorMessage(res, 401, "Invalid email or password");
    }

    if (!user.isActive) {
      return errorMessage(res, 403, "Your account has been deactivated");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, isActive: user.isActive },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
        algorithm: "HS256",
      }
    );

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    const { password: _password, ...safeUser } = user;

    return sucessMessage(res, 200, "Login successful", safeUser);
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return sucessMessage(res, 200, "Logout successful");
  } catch (error) {
    next(error);
  }
};

export const myUserController = async (req, res, next) => {
  try {
    const userId = req.user.userId;

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
