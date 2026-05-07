const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createTask,
  getTasks,
  updateTaskStatus,
} = require("../controllers/taskController");


// CREATE TASK (ADMIN ONLY)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createTask
);


// GET TASKS
router.get(
  "/",
  authMiddleware,
  getTasks
);


// UPDATE STATUS
router.put(
  "/:id",
  authMiddleware,
  updateTaskStatus
);

module.exports = router;