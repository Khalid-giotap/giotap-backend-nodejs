const errorHandler = (err, req, res, next) => {
  try {
    let error = { ...err };

    error.message = err.message;
    
    // Mongoose Validation Error
    // if (err.name === "ValidationError") {
    //   const message = Object.values(err.errors || {})
    //     .map((val) => val.message)
    //     .join(", ");
    //   error = new Error(message);
    //   error.statusCode = 400;
    // }

    // JWT Invalid / Expired
    if (err.name === "JsonWebTokenError") {
      error = new Error("Invalid token");
      error.statusCode = 401;
    }

    if (err.name === "TokenExpiredError") {
      error = new Error("Token expired");
      error.statusCode = 401;
    }

    // MongoDB Duplicate Key
    if (err.code === 11000) {
      error = new Error("Duplicate key error");
      error.statusCode = 400;
    }

    // Mongoose CastError (Invalid ObjectId)
    if (err.name === "CastError") {
      error = new Error("Resource not found! Invalid Id");
      error.statusCode = 400;
    }

    res
      .status(error.statusCode || 500)
      .json({
        success: false,
        message: error.message || "Internal Server Error",
      });
  } catch (error) {
    console.log("we get here");
    next(error);
  }
};

export default errorHandler;
