const Task = require("../models/Task");
const Log = require("../models/Log");
const mongoose = require("mongoose");

// Helper to safely log actions
const logAction = async ({ userId, action, taskId, details }) => {
  try {
    await Log.create({ userId, action, taskId, details });
  } catch (err) {
    console.error("Logging failed:", err.message);
  }
};

// GET all logs (admin only)
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .populate("userId", "username email")
      .populate("taskId", "title");
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const task = await Task.create({
      title,
      description,
      dueDate,
      status,
      createdBy: req.user.userId,
    });

    await logAction({
      userId: req.user.userId,
      action: "create",
      taskId: task._id,
      details: `Created task "${task.title}"`,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET Tasks
exports.getTasks = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { createdBy: req.user.userId };
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE Task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid task ID" });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && task.createdBy.toString() !== req.user.userId)
      return res.status(403).json({ message: "Forbidden" });

    const { title, description, dueDate, status } = req.body;
    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (status) task.status = status;

    await task.save();

    await logAction({
      userId: req.user.userId,
      action: "update",
      taskId: task._id,
      details: `Updated task "${task.title}"`,
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid task ID" });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && task.createdBy.toString() !== req.user.userId)
      return res.status(403).json({ message: "Forbidden" });

    // ✅ Fix: use deleteOne instead of remove
    await task.deleteOne();

    await logAction({
      userId: req.user.userId,
      action: "delete",
      taskId: task._id,
      details: `Deleted task "${task.title}"`,
    });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

