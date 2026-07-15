module.exports = (err, req, res, next) => {
  console.error("ReliefLink error:", err);
  const status = err.status || err.statusCode || 500;
  const dbMessage = err.originalError?.info?.message || err.precedingErrors?.[0]?.message;
  res.status(status).json({
    success: false,
    message: dbMessage || err.message || "Internal server error."
  });
};
