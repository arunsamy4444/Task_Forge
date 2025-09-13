const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/admin-only", authMiddleware, roleMiddleware("admin"), (req, res) => {
  res.send("Welcome Admin ✅");
});

router.get("/user-only", authMiddleware, (req, res) => {
  res.send("Welcome User ✅");
});

module.exports = router;
