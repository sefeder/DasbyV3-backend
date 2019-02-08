const router = require("express").Router();
const resultController = require("../../controllers/resultController");

// router.route("/create-new-result")
//     .post(resultController.create)

router.route("/get-all-results")
    .post(resultController.getAllResults)

module.exports = router;
