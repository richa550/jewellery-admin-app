const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Example protected dashboard route
router.get("/", auth, (req, res) => {
  res.json({
    message: "Welcome to your dashboard!",
    user: req.user, // comes from decoded JWT
  });
});

module.exports = router;
