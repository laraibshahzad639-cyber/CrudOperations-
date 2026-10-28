import jwt from "jsonwebtoken";

export const authenticationMiddleware = (req, res, next) => {
  const accessToken = req.cookies?.access_token;

  if (!accessToken) {
    return res.status(401).json({
      status: false,
      message: "Authentication required",
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");

    return res.status(500).json({
      status: false,
      message: "Server configuration error",
    });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    return next();
  } catch (error) {
    console.error("JWT verification error:", error.message);

    return res.status(401).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Logged in but not allowed" });
    }

    next();
  };
};
