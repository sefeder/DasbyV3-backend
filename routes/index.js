const router = require("express").Router();


// Services (twilio, virgil etc.) Routes
const serviceRoutes = require("./services");
router.use("/services", serviceRoutes);

// Database routes
const databaseRoutes = require('./database')
router.use("/database", databaseRoutes)

// Dasby routes
const dasbyRoutes = require('./dasby')
router.use("/dasby", dasbyRoutes)

module.exports = router;