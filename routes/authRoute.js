const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getUserById,
  deleteUserById,
  updatedUser,
  blockedUser,
  unblockedUser,
  handleRefreshToken,
  logout,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/logout", logout);
router.get("/refresh", handleRefreshToken);
router.get("/users",getAllUsers );
router.get("/:id",authMiddleware,isAdmin,getUserById);
router.delete("/:id",authMiddleware,isAdmin,deleteUserById);
router.put("/edit-user",authMiddleware,updatedUser);
router.patch("/blocked-user/:id", authMiddleware,isAdmin,blockedUser);
router.patch("/unblocked-user/:id", authMiddleware,isAdmin,unblockedUser);

module.exports = router;
