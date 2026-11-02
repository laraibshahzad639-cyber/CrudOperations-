// import { errorMessage } from "../utils/errorMesage.js";

// const PERMISSIONS = {
//   ADMIN: ["READ_USERS", "READ_TASKS"],
//   USER: ["READ_TASKS"],
// };

// export function authorize(requiredPermission) {
//   return (req, res, next) => {
//     if (!req.user || !req.user.role) {
//       return errorMessage(res, 401, "Authentication required");
//     }

//     const userRole = req.user.role;
//     const userPermissions = PERMISSIONS[userRole] || [];

//     if (!userPermissions.includes(requiredPermission)) {
//       return errorMessage(res,403, "Forbidden: Insufficient permissions" );
//     }

//     next();
//   };
// }
export const authorize = () => {
  console.log("check");
};
