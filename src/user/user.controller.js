import { errorMessage } from "../utils/errorMesage.js";
import { sucessMessage } from "../utils/sucessMesage.js";
import {
  getUsers,
  updateUsers,
  getUserById,
  deleteUsers,
  updatedUserRole,
  createUser,
  updateUserstatus,
  changePassword,
  getUserCredentialsById
} from "./user.service.js";
import argon2 from "argon2";

export const getUserController = async (req, res, next) => {
  try {
    const pageNumber = Number(req.query.page) || 1;
    const limitNumber = Math.min(Number(req.query.limit) || 10, 100);

    const users = await getUsers(limitNumber, pageNumber);

    return res.status(200).json({
      status: true,
      message: "User fetched successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
export const getUserByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return errorMessage(res, 404, "User not found ");
    }

    const { password, ...safeUser } = user;

    return sucessMessage(res, 200, "User fetched successfully", safeUser);
  } catch (error) {
    console.error("check error", error);
    next(error);
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Users not found",
      });
    }
    const deletedUser = await deleteUsers(id);
    return res.status(200).json({
      status: true,
      message: "User deleted sucessfuly",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    const data = { name, email };
    const updatedUser = await updateUsers(id, data);
    return res.status(200).json({
      status: false,
      message: "User updatedd Sucessfuly",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error ",
    });
  }
};
export const createUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return errorMessage(res, 400, "Name Email and Password are required ");
    }
    if (!["ADMIN", "USER"].includes(role)) {
      return errorMessage(res, 400, "Role must be Admin or User ");
    }
    const user = await createUser(name, email, password, role);
  } catch (error) {
    next(error);
  }
};
export const updateUserRoleController = async (req, res, next) => {
  try {
    const { role } = req.body;
    const { id } = req.params;
    if (!["ADMIN", "USER"].includes(role)) {
      return errorMessage(res, 400, "Role must be Admin or User ");
    }

    const user = await getUserById(id);


    if (!user) {
      return errorMessage(res, 404, "User not found");
    }

    await updatedUserRole(id, role);
    const updatedUser = await getUserById(id);
    const { password, ...safeUser } = updatedUser;

    return sucessMessage(
      res,
      200,
      "User role updated successfully",
      safeUser
    );
  } catch (error) {
    console.error("Update user role error:", error);
    next(error);
  }
};

export const updateUserstatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await getUserById(id);

    if (!user) {
      return errorMessage(res, 404, "User not found");
    }

    const activeUser = await updateUserstatus(id, {
      isActive: isActive,
    });

    if (!activeUser) {
      return errorMessage(res, 404, "Active user not found");
    }
  const { password, ...safeUser } = activeUser;

    return sucessMessage(res, 200, "User deactivated sucessfully ", safeUser);
  } catch (error) {
    console.error("check error", error);
    next(error);
  }
};

export const changePasswordController = async (req, res, next) => {
  try {
    const id = req.user.userId;

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return errorMessage(res, 400, "All password fields are required");
    }

    if (typeof currentPassword !== "string" ||
        typeof newPassword !== "string" ||
        typeof confirmPassword !== "string") {
      return errorMessage(res, 400, "Passwords must be strings");
    }

    if (newPassword.length < 8) {
      return errorMessage(res, 400, "Password must be at least 8 characters");
    }

    if (newPassword !== confirmPassword) {
      return errorMessage(res, 400, "Password does not match");
    }

    const user = await getUserCredentialsById(id);

    if (!user) {
      return errorMessage(res, 404, "User not found");
    }

    const isValidPassword = await argon2.verify(
      user.password,
      currentPassword
    );

    if (!isValidPassword) {
      return errorMessage(res, 401, "Current password is incorrect");
    }

    await changePassword(id, newPassword);

    res.clearCookie("access_token");

    return sucessMessage(res, 200, "Password updated successfully", null);

  } catch (error) {
    console.error("Password change error:", error);
    next(error);
  }
};

