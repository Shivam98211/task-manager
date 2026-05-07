const Project = require("../models/Project");


// CREATE PROJECT
exports.createProject = async (req, res) => {

  try {

    const { title, description } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        message: "Project title must be at least 3 characters",
      });
    }

    const project = await Project.create({
      title: title.trim(),
      description,
      createdBy: req.user.id,
    });

    res.status(201).json(project);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// GET ALL PROJECTS
exports.getProjects = async (req, res) => {

  try {

    const projects = await Project.find()
      .populate("createdBy", "name email");

    res.status(200).json(projects);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};
