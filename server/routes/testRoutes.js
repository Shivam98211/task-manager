const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");


// ALL USERS
router.get(
  "/dashboard",
  authMiddleware,
  (req, res) => {

    res.status(200).json({
      message: "Welcome to dashboard",
      user: req.user,
    });

  }
);


// ADMIN ONLY
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {

    res.status(200).json({
      message: "Welcome Admin",
    });

  }
);


// MEMBER ONLY
router.get(
  "/member",
  authMiddleware,
  roleMiddleware("member"),
  (req, res) => {

    res.status(200).json({
      message: "Welcome Member",
    });

  }
);

module.exports = router;