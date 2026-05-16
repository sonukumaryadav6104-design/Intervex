import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "No token found, please login" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId;
    next();

  } catch (error) {
    // jwt.verify throws JsonWebTokenError, TokenExpiredError, etc.
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token, please login again" });
    }
    return res.status(500).json({ message: `isAuth error: ${error.message}` });
  }
};



export default isAuth;