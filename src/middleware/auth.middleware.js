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
