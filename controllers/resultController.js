const dbResults = require('../models/results')

module.exports = {
    create: function (result) {
        const newResult = {
            userId: result.userId,
            interviewId: result.interviewId,
            testType: result.testType,
            severity: result.severity,
            category: result.category,
            diagnosis: result.diagnosis,
            confidence: result.confidence,
            precision: result.precision,
            probability: result.probability,
            percentile: result.percentile
        }
        dbResults.create(newResult)
        .then(dbResult => {
            console.log('new result successfully added')
            res.json({ dbresult: dbResult })
        })
        .catch(err => console.log(err))

    },
    getAllResults: function (req, res) {
        console.log("hitting getAllResults in resultController")
        dbResults.find({userId: req.body.upi}, {testType: req.body.testType})
        .then(db_Results => res.json(db_Results))
    }
}