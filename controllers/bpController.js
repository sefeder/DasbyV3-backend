const dbResults = require('../models/bloodPressure')

module.exports = {
    create: function (measurement) {
        const newMeasurement = {
            userId: measurement.userId,
            systolic: measurement.systolic,
            diastolic: measurement.diastolic
        }
        dbResults.create(newMeasurement)
            .then(dbMeasurement => {
                console.log('new result successfully added')
                res.json({ dbMeasurement: dbMeasurement })
            })
            .catch(err => console.log(err))

    },
    getAllMeasurements: function (req, res) {
        console.log("hitting getAllResults in resultController")
        dbResults.find({ userId: req.body.upi })
            .then(db_measuremnts => res.json(db_measuremnts))
    }
}