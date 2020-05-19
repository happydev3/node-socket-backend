// routes/auth.routes.js

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const userSchema = require("../models/User");
const chatroomSchema = require("../models/ChatRooms");
const authorize = require("../middlewares/authjwt");
const { check, validationResult } = require('express-validator');
const sesClient = require('../config/ses-client');
// var nodemailer = require('nodemailer');
// var smtpTransport = require('nodemailer-smtp-transport');

let multer = require('multer');
const path = require('path');

const DIR = './public/images';
let fileuploadname;
const Blockuser = require("../models/blockuser");

// Setting up the storage element
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        fileuploadname = file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname);
        cb(null, fileuploadname);
    }
});
let upload = multer({ storage: storage });

// Route for refresh message
router.get('/refresh/:id', (req, res) => {
    userSchema.findByIdAndUpdate(req.params.id, {
        $set: { refresh: Date.now() }
    }, (error, data) => {
        if (error) {
            console.log(error);
            res.status(500).json({
                success: false
            })
        } else {
            console.log(" image update...")
                // chatroomSchema.findOneAndUpdate({ userId: req.params.id }, { $set: { photoUrl: req.params.imageName } });
                // chatroomSchema.updateMany({ userId: req.params.id }, { $set: { photoUrl: req.params.imageName } });
            res.status(200).json({
                success: true,
            })
            console.log('User successfully updated!')
        }
    })
})

// Route for account confirm
router.get('/confirm/:id', (req, res) => {
    userSchema.findOneAndUpdate({ email: req.params.id }, { $set: { state: 1 } }, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log(res);
    })

})

// Route for file upload
router.post('/upload', upload.single('photo'), function(req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });

    } else {
        console.log('file received');
        return res.send({
            success: true,
            fileName: fileuploadname
        })
    }
});

// Route for the get the uploaded image
router.get('/image/:id', (req, res) => {

});
// Route for the update the image path in db
router.get('/photo/:id/:imageName', (req, res) => {
    userSchema.findByIdAndUpdate(req.params.id, {
        $set: { photoUrl: req.params.imageName }
    }, (error, data) => {
        if (error) {
            console.log(error);
            res.status(500).json({
                success: false
            })
        } else {
            console.log(" image update...")
                // chatroomSchema.findOneAndUpdate({ userId: req.params.id }, { $set: { photoUrl: req.params.imageName } });
                // chatroomSchema.updateMany({ userId: req.params.id }, { $set: { photoUrl: req.params.imageName } });
            res.status(200).json({
                success: true,
            })
            console.log('User successfully updated!')
        }
    })
})


// let transporter = nodemailer.createTransport(smtpTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     secure: true,
//     port: 465,
//     auth: {
//         user: 'wifball.pro@gmail.com',
//         pass: 'Rubixcub004!'
//     }
// }));

// Sign-up
router.post("/register-user", [
        check('name')
        .not()
        .isEmpty()
        .isLength({ min: 1 })
        .withMessage('Name must be atleast 3 characters long'),
        check('email', 'Email is required')
        .not()
        .isEmpty(),
        check('password', 'Password should be between 3 to 10 characters long')
        .not()
        .isEmpty()
        .isLength({ min: 3, max: 40 })
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        console.log('*******sign up req.body********', req.body);

        if (!errors.isEmpty()) {
            console.log(errors);
            // return res.status(422).jsonp(errors.array());
            res.status(201).json({
                error: error
            });
        } else {
            bcrypt.hash(req.body.password, 10).then((hash) => {
                const user = new userSchema({
                    name: req.body.name,
                    email: req.body.email,
                    pseduo: req.body.pseduo,
                    password: hash,
                    days_15: "",
                    days_30: "",
                    pay_count: "",
                    pay_cost: "",
                    res_day: "",
                    state: 0,
                    refresh: "0",
                    register_time: Date.now(),
                    img_state: 1
                });
                let emailString = '<p>Welcome to winorball and thank you for your registration,<br> please confirm your account to discuss football with all the community:<br><br><a href="http://192.162.69.178/wifball/login?verify=' + req.body.email + '">Confimation link</a><br><br>';
                user.save().then((response) => {
                    console.log(response);

                    sesClient.sendEmail(req.body.email, 'Welcome, winorball!', emailString);

                    // var mailOptions = {
                    //     from: 'wifball.pro@gmail.com',
                    //     to: req.body.email,
                    //     subject: 'From the Wifball',
                    //     html: emailString,
                    //     attachments: [{
                    //         filename: 'wifball.png',
                    //         path: __dirname + '/wifball.png',
                    //     }]
                    // };

                    // transporter.sendMail(mailOptions, function(error, info) {
                    //     if (error) {
                    //         console.log('mailing error:', error);
                    //     } else {
                    //         console.log('Email sent: ' + info.response);
                    //     }
                    // });

                    res.status(201).json({
                        message: "User successfully created!",
                        result: response
                    });
                }).catch(error => {
                    res.status(201).json({
                        error: error
                    });
                });
            });
        }
    });

//forget
router.post('/forget', (req, res, next) => {
    let getUser;
    userSchema.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
	let HelperOptions = {
            from: 'wifball.com',
            to: req.body.email,
            subject: 'Verify Notification',
            text: 'Verfiy Code : x739dasl;klc03;21k'
        };
        transporter.sendMail(HelperOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            // console.log('bbb');
        })
        return res.send(user);
        // return bcrypt.compare(req.body.password, user.password);
    })

});
// Sign-in
router.post("/signin", (req, res, next) => {
    console.log('*******sign in req.body********', req.body);
    let getUser;
    if (req.params.verify) {
        console.log("to verify");
        console.log(req.params.verify);
    }
    userSchema.findOne({
        email: req.body.email,
        state: 1
    }).then(user => {
        if (!user) {
            return res.status(200).json({
                error: "Authentication failed"
            });
        }
        getUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        if (!response) {
            return res.status(200).json({
                error: "Authentication failed"
            });
        }
        let jwtToken = jwt.sign({
            email: getUser.email,
            userId: getUser._id
        }, "longer-secret-is-better", {
            expiresIn: "1h"
        });
        const io = req.app.get('io');
        io.emit('user name added', 'sss');
        res.status(200).json({
            token: jwtToken,
            expiresIn: 3600,
            _id: getUser._id
        });
    }).catch(err => {
        return res.status(200).json({
            error: "Authentication failed"
        });
    });
});

// Get Users
router.route('/').get((req, res) => {
    userSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
})

// Get Single User
router.route('/user-profile/:id').get(authorize, (req, res, next) => {
    userSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})
router.route('/userProfile/:id').get((req, res, next) => {
        userSchema.findById(req.params.id, (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.status(200).json({
                    msg: data
                })
            }
        })
    })
    // Update User
router.route('/update-user/:id').put((req, res, next) => {
    console.log("this is the update user");
    console.log(req);
    bcrypt.hash(req.body.password, 10).then((hash) => {
        console.log("-----this is the update passsword--------" + hash);
        userSchema.findByIdAndUpdate(req.params.id, {
            password: hash
        }, (err, data) => {
            if (err) {
                return next(err);
                console.log(err);
            } else {
                res.json(data)
                console.log('User successfully updated!')
            }
        })
    })
})
router.route('/updatePassword').post((req, res, next) => {
        console.log("this is the update user");
        console.log(req);
        bcrypt.hash(req.body.password, 10).then((hash) => {
            console.log("-----this is the update passsword--------" + hash);
            userSchema.findByIdAndUpdate(req.body._id, {
                password: hash
            }, (err, data) => {
                if (err) {
                    return next(err);
                    console.log(err);
                } else {
                    res.json(data)
                    console.log('User successfully updated!')
                }
            })
        })
    })
    // Delete User
router.route('/delete-user/:id').delete((req, res, next) => {
        userSchema.findByIdAndRemove(req.params.id, (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.status(200).json({
                    msg: data
                })
            }
        })
    })
    // update user subscription15
router.route('/subscription15/:id').get((req, res, next) => {
        let currentTime = Date.now();
        console.log("...this is the current time...");
        console.log(currentTime);
        userSchema.findById(req.params.id).then((doc) => {
            if (doc.res_day != '' && currentTime < doc.res_day) {
                currentTime = (parseInt(doc.res_day) + 15 * 86400 * 1000);
            } else {
                currentTime = currentTime + 15 * 86400 * 1000;
            }
            console.log("...this is the expired time...");
            console.log(currentTime);
            let days15 = '1';
            let cost = '999';
            let count = '';
            if (doc.pay_count == null || doc.pay_count == '') {
                days15 = '1';
                cost = '999';
                count = '1';
            } else {
                if (doc.days_15 == null || doc.days_15 == '') {
                    days15 = '1';
                    if (doc.days_30 == null || doc.days_30 == '') {
                        cost = '999';
                    } else {
                        cost = (parseInt(doc.pay_cost) + 999).toString();
                    }
                    count = (parseInt(doc.pay_count) + 1).toString();
                } else {
                    days15 = (parseInt(doc.days_15) + 1).toString();
                    cost = (parseInt(doc.pay_cost) + 999).toString();
                    count = (parseInt(doc.pay_count) + 1).toString();
                }
            }
            userSchema.findByIdAndUpdate(doc._id, { days_15: days15, pay_cost: cost, pay_count: count, res_day: currentTime }, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(501).send('failed');
                } else {
                    userSchema.findById(doc._id).then((doc) => {
                        return res.status(200).send(doc);
                    }).catch((e) => {
                        console.log(e);
                        return res.status(200).send(result);
                    })

                }
            });
            // var mailOptions = {
            //     from: 'wifball.pro@gmail.com',
            //     to: doc.email,
            //     subject: 'From the Wifball',
            //     text: 'We confirm the payment and the implementation of your subscription for your account',
            // };

            // transporter.sendMail(mailOptions, function(error, info) {
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         console.log('Email sent: ' + info.response);
            //     }
            // });
        })
    })
    // update user subscription30
router.route('/subscription30/:id').get((req, res, next) => {
    let currentTime = Date.now();
    console.log(currentTime);
    userSchema.findById(req.params.id).then((doc) => {
        if (doc.res_day && currentTime < doc.res_day) {
            currentTime = (parseInt(doc.res_day) + 30 * 86400 * 1000);
        } else {
            currentTime = currentTime + 30 * 86400 * 1000;
        }
        let days30 = '1';
        let cost = '1499';
        let count = '';
        if (doc.pay_count == null || doc.pay_count == '') {
            days30 = '1';
            cost = '1499';
            count = '1';
        } else {
            if (doc.days_30 == null || doc.days_30 == '') {
                days30 = '1';
                if (doc.days_15 == null || doc.days_30) {
                    cost = '1499';
                } else {
                    cost = (parseInt(doc.pay_cost) + 1499).toString();
                }
                count = (parseInt(doc.pay_count) + 1).toString();
            } else {
                days30 = (parseInt(doc.days_30) + 1).toString();
                cost = (parseInt(doc.pay_cost) + 1499).toString();
                count = (parseInt(doc.pay_count) + 1).toString();

            }
        }
        userSchema.findByIdAndUpdate(doc._id, { days_30: days30, pay_cost: cost, pay_count: count, res_day: currentTime }, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(501).send('failed');
            } else {
                userSchema.findById(doc._id).then((doc) => {
                    return res.status(200).send(doc);
                }).catch((e) => {
                    console.log(e);
                    return res.status(200).send(result);
                })

            }
        });
        // var mailOptions = {
        //     from: 'wifball.pro@gmail.com',
        //     to: doc.email,
        //     subject: 'From the Wifball',
        //     text: 'We confirm the payment and the implementation of your subscription for your account',
        // };

        // transporter.sendMail(mailOptions, function(error, info) {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log('Email sent: ' + info.response);
        //     }
        // });


    })
})

// get the block users
router.route('/blockusers/:id').get((req, res, next) => {
    Blockuser.findOne({ 'userId': req.params.id }).then((doc) => {
        console.log("..finding the block user is ok...");
        console.log(doc);
        return res.status(200).send(doc);
    }).catch((e) => {
        console.log("...the blockuser table connection is error...");
        console.log(e);
        return res.status(200).send(null);
    })

});



module.exports = router;