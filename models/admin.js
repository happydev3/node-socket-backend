// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let Admin = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    photoUrl: {
        type: String
    },
    token: {
        type: String,
        required: false
    }
}, {
    collection: 'admin'
})

Admin.pre("save", async function(next) {
    const admin = this;
    if (admin.isModified("password")) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }
    next();
  });
  
  //this method generates an auth token for the user
  Admin.methods.generateAuthToken = async function() {
    const admin = this;
    const token = jwt.sign({ 
      _id: admin._id, 
      name: admin.name, 
      email: admin.email 
    }, "longer-secret-is-better");
    // user.tokens = user.tokens.concat({ token });
    admin.token = token;
    await admin.save();
    return token;
  };
  
Admin.plugin(uniqueValidator, { message: 'Email already in use.' });
let User = module.exports = mongoose.model('admin', Admin)