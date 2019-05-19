const router = require("express").Router();
const userRoutes = require("./userRoutes");
const resultRoutes = require("./resultRoutes")
const bpRoutes = require("./bpRoutes")
// const dialogueRoutes = require("./dialogueRoutes");

router.use("/users", userRoutes);
// router.use("/dialogue", dialogueRoutes);
router.use("/results", resultRoutes);
router.use("/bp", bpRoutes);


module.exports = router;