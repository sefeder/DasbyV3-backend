const router = require("express").Router();
const bpController = require("../../controllers/bpController");

router.route("/create-new-measurement")
    .post(bpController.create)

router.route("/get-all-measurements")
    .get(bpController.getAllMeasurements)

module.exports = router;
