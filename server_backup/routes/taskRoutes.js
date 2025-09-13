const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Protect all routes
router.use(authMiddleware);

// 🔹 Inline admin log route (must be above /:id routes)
router.get("/logs/all", roleMiddleware("admin"), taskController.getAllLogs);

// Task CRUD routes
router.post("/", taskController.createTask);
router.get("/", taskController.getTasks);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
