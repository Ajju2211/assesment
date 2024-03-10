import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import strings from '../utils/strings.js';
import constants from '../utils/constants.json' assert {type: 'json'};
import crypto from "crypto";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: [true, "email already registered"],
      match: [/\S+@\S+\.\S+/, 'invalid email'],
      index: true,
      sparse: true
    },
    salt: String,
    hashedPassword: String,
    passwordEnabled: Boolean,
    isEmailVerified: Boolean,
    isPhoneVerified: Boolean,
    phoneNumber: {
      type: String,
      unique: true,
      match: [/^\+91[1-9]\d{9}$/, 'invalid phone number'],
      index: true,
      sparse: true
    },
    avatar: String,
    roles: {
      type: [String], default: [constants.ROLES.USER]
    },
    fullName: String,
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', function (next) {
  if (strings.isEmpty(this.avatar) || (!this.avatar.startsWith("https://lh3.googleusercontent.com") && this.isModified("fullName"))) {
    if (!strings.isEmpty(this.fullName)) {
      this.fullName = strings.capitalizeSentence(this.fullName);
      this.avatar = `https://source.boringavatars.com/beam/80/${encodeURIComponent(this.fullName)}?colors=595643,4E6B66,ED834E,EBCC6E,EBE1C5`;
    }
  }
  next();
});

userSchema.methods.toJSON = function () {
  return {
    id: this._id,
    email: this.email,
    fullName: this.fullName,
    avatar: this.avatar,
    roles: this.roles,
    passwordEnabled: this.passwordEnabled,
    isPhoneVerified: this.isPhoneVerified,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt,
    phoneNumber: this.phoneNumber
  };
};

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    process.env.JWT_SECRET, {
    expiresIn: '2 days'
  }
  );
  return token;
};



userSchema.methods.encryptPassword = function (password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

userSchema.virtual('password').set(function (password) {
  this._plainPassword = password
  this.salt = crypto.randomBytes(128).toString('hex')
  this.hashedPassword = this.encryptPassword(password)
}).get(function () {
  return this._plainPassword
})

userSchema.methods.checkPassword = function (password) {
  return this.encryptPassword(password) == this.hashedPassword
}

userSchema.statics.validate = (user) => {
  const schema = Joi.object({
    avatar: Joi.any(),
    email: Joi.string().email({ tlds: { allow: false } }),
    fullName: Joi.string().min(2).max(30).required(),
    password: Joi.string().min(6).max(20).allow('').allow(null),
    passwordEnabled: Joi.any().forbidden(),
    hashedPassword: Joi.any().forbidden(),
    salt: Joi.any().forbidden(),
    isEmailVerified: Joi.any().forbidden(),
    roles: Joi.any().forbidden(),
    googleId: Joi.any().forbidden(),
    profilePhoto: Joi.string().uri()
  });

  return schema.validate(user);
};

const User = mongoose.model('User', userSchema);

export default User;