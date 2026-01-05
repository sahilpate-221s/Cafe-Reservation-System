exports.getUserContext = (req) => {
  return {
    userId: req.headers["x-user-id"] || null,
    role: req.headers["x-user-role"] || "USER",
  };
};
