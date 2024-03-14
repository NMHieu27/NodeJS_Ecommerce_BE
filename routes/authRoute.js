const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getUserById,
} = require("../controller/userCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/users",getAllUsers );
router.get("/:id",authMiddleware,getUserById);

module.exports = router;
