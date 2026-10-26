export const notFoundMiddleware = (req, res, next) => {
  return res.status(404).json({
    status: false,
    message: "Not found ",
    method: req.method,
  });
};
