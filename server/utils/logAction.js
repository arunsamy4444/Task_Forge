const Log = require("../models/Log");

const logAction = async ({ userId, action, taskId, details }) => {
  try {
    await Log.create({ userId, action, taskId, details });
  } catch (err) {
    console.error("Logging failed:", err);
  }
};

module.exports = logAction;
