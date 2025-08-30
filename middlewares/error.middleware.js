const errorHandler = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "MongoBulkWriteError") {
      error = new Error(err.message);
      error.statusCode = 400;
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors || {})
        .map((val) => val.message)
        .join(", ");
      error = new Error(message);
      error.statusCode = 400;
    }

    // JWT Invalid / Expired
    if (err.name === "JsonWebTokenError") {
      error = new Error("Invalid token! You can not be authorized!");
      error.statusCode = 401;
    }

    if (err.name === "TokenExpiredError") {
      error = new Error("Token expired");
      error.statusCode = 401;
    }

    // MongoDB Duplicate Key

    if (err.code === 11000) {
      if (err.keyValue) {
        const field = Object.keys(err.keyValue)[0];
        error = new Error(`${field} already exists`);
        error.statusCode = 400;
      }
    }

    // Mongoose CastError (Invalid ObjectId)
    if (err.name === "CastError") {
      error = new Error("CastError:Invalid Mongodb Id");
      error.statusCode = 400;
    }

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error details:", {
        message: error.message,
        stack: err.stack,
        statusCode: error.statusCode,
      });
    }
console.log('look here saad 55')
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  } catch (error) {
    console.log('lets see')
    next(error);
  }
};

export default errorHandler;
