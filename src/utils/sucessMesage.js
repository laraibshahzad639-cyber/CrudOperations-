export const sucessMessage = (res, statuscode, message, data = null) => {
  return res.status(statuscode).json({
    sucess: true,
    statuscode,
    message,
    data,
  });
};
