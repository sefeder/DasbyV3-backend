const dbUsers = require('../models/Users')

module.exports = {
    create: function(req, res) {
        const newUser = {
            email: req.body.email,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            hospital: req.body.hospital,
            upi: req.body.upi,
            role: req.body.role
        }
        dbUsers.create(newUser)
        .then(() => {
            dbUsers.findOne({ upi: req.body.upi })
                .then(dbUser => {
                    console.log('new user successfully added')
                    res.json({ user: dbUser })
                })
        })
        .catch(err => console.log(err))
        
    },
    getAllUsers: function(req,res){
        console.log("hitting getAllUsers in userController")
        dbUsers.findAll().then(dbUsers=>res.json(dbUsers))
    },
    authenticateUser: function(req, res) {
        dbUsers.findOne({email:req.body.email})
        .then(function (data) {
            console.log('data: ', data)
            if (!data) {
                res.json({status: false, message: "invalid email"})
                console.log('invalid email')
                return;
            }
            if (data.password !== req.body.password) {
                res.json({ status: false, message: "password does not match" })
                console.log('incorrect password')
                return;
            }
            res.json({ status: true, message: "login successful", user: data })
            
        }).catch(function (error) {
            console.log(error)
            res.send(error);
        })
    },
    update: function (req, res) {
            dbUsers.update(
                {upi: req.body.upi},
                { private_key: JSON.stringify(req.body.privateKey) }
            )
            .then(() => {
                dbUsers.findOne({upi: req.body.upi})
                .then( dbUser => {
                    res.json({user: dbUser})
                })
            })
            .catch(err=>console.log(err))
    },
    getAdmin: function (req, res) {
        dbUsers.findAllWhere({role:"admin"})
        .then(admin => {
            res.json({admin: admin})
        })
    },
    getUser: function (req, res) {
        dbUsers.findOne({upi: req.body.upi})
        .then(user => {
            res.json({ user: user })
        })
    },
    getDasbyUpi: function (req, res) {
        dbUsers.findOne({ first_name: 'Dasby' })
            .then(dasby => {
                res.json({ dasby: dasby })
            })
    }

}