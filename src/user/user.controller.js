import { errorMessage } from "../utils/errorMesage.js";
import {
  getUsers,
  updateUsers,
  getUserById,
  deleteUsers,
  //   createUser,
} from "./user.service.js";

export const getUserController = async (req, res) => {
  try {
    const { limit } = req.query;
    const { page } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const user = await getUsers(limitNumber, pageNumber);

    res.status(200).json({
      status: true,
      message: "User fetched sucessfully ",
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: "User not found",
    });
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
    if (!["AMIN", "USER"].includes(role)) {
      return errorMessage(res, 400, "Role must be Admin or User ");
    }
    const user = await createUser(name, email, password, role);
  } catch (error) {
    next(error);
  }
};
