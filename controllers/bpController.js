const dbResults = require('../models/bloodPressure')

screenBP = function(syst, diast){
    console.log("syst:", syst, "diast:", diast)
    let diagnosis;

    if (syst < 120 && diast < 80) {
        console.log("Normal")
        diagnosis = 1
    } else if (syst >= 120 && syst < 130 && diast < 80) {
        console.log("Elevated")
        diagnosis = 2
    } else if ((syst >= 130 && syst < 140) || (diast >= 80 && diast < 90)) {
        console.log("Hypertension Stage 1")
        diagnosis = 3
    } else if ((syst >= 140) || (diast >= 90)) {
        console.log("Hypertension Stage 2")
        diagnosis = 4
    }
    return diagnosis
    if ((syst >= 180) || (diast >= 120)) {
        console.log("Hypertension Urgency")
    }
}


module.exports = {
    create: function (req, res) {
        const newMeasurement = {
            upi: req.body.userId,
            systolic: req.body.systolic,
            diastolic: req.body.diastolic
        }
        dbResults.create(newMeasurement)
            .then(dbMeasurement => {
                console.log('new result successfully added')
                const diagnosis = screenBP(req.body.systolic, req.body.diastolic)
                res.json({ dbMeasurement: dbMeasurement, diagnosis })
            })
            .catch(err => console.log(err))

    },
    getAllMeasurements: function (req, res) {
        console.log("hitting getAllResults in resultController")
        dbResults.find({ userId: req.body.upi })
            .then(db_measuremnts => res.json(db_measuremnts))
    }
}