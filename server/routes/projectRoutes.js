const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createProject,
  getProjects,
} = require("../controllers/projectController");


// CREATE PROJECT (ADMIN ONLY)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createProject
);


// GET PROJECTS
router.get(
  "/",
  authMiddleware,
  getProjects
);

module.exports = router;