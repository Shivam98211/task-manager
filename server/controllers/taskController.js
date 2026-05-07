const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, project, dueDate } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        message: "Task title must be at least 3 characters",
      });
    }

    if (!assignedTo || !project) {
      return res.status(400).json({
        message: "Task must have a project and assignee",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      assignedTo,
      project,
      dueDate,
    });

    const populatedTask = await task.populate([
      { path: "assignedTo", select: "name email role" },
      { path: "project", select: "title" },
    ]);

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email role")
      .populate("project", "title");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("assignedTo", "name email role")
      .populate("project", "title");

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
