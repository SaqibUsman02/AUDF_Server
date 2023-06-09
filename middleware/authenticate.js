const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const Authenticate = async (req, res, next) => {
  try {

    const token = req.cookies.jwToken;

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "Tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not Found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (err) {
   await res.status(401).send("Unauthorized: No Token Provided");
    console.log(err);
  }
};

module.exports = Authenticate;
