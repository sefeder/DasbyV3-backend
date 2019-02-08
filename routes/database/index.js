const router = require("express").Router();
const userRoutes = require("./userRoutes");
const resultRoutes = require("./resultRoutes")
// const dialogueRoutes = require("./dialogueRoutes");

router.use("/users", userRoutes);
// router.use("/dialogue", dialogueRoutes);
router.use("/results", resultRoutes);


module.exports = router;