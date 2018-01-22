const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.pre('save', function(next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.methods.toJSON = function () {
    const user = this;

    return _.pick(user.toObject(), ['_id', 'email']);
};

UserSchema.methods.generateJwt = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toHexString(), access: 'auth' }, 'somesecret').toString();

    user.tokens.push({ access: 'auth', token });

    return user.save()
        .then(() => {
            return token;
        });
};

UserSchema.statics.findByToken = function (token) {
    const User = this;
    let  decoded;

    try {
        decoded = jwt.verify(token, 'somesecret');
    } catch (err) {
        return Promise.reject(err);
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

const User = mongoose.model('user', UserSchema, 'users');

module.exports = User;
