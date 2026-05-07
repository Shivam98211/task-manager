const Task = require("../models/Task");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();

    const pendingTasks = await Task.countDocuments({
      status: "pending",
    });

    const completedTasks = await Task.countDocuments({
      status: "completed",
    });

    const inProgressTasks = await Task.countDocuments({
      status: "in-progress",
    });

    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
    });

    res.status(200).json({
      totalTasks,
      pendingTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
