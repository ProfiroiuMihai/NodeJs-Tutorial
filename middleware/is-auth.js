const jwt = require("jsonwebtoken");
const secret = require("../middleware/secret");

module.exports = (req, res, next) => {
  try {
    const token = req.get("Authorization").split(" ")[1];
    decodedToken = jwt.decode(token, secret);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }

  if (!decodedToken) {
    return res.status(401).json({ message: "Unathorizated" });
  }

  req.userId = decodedToken.userId;
  next();
};
