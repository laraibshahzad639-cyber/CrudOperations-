import { errorMessage } from "../utils/errorMesage.js";

export const isAdmin = (req, res, next) => {
  console.log("Role", req.user?.role);
  if (req.user?.role !== "ADMIN") {
    return errorMessage(res, 403, "Forbidden: Admin access required");
  }
  next();
};
