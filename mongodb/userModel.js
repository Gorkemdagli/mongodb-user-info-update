const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true,
        autoIncrement: true
    },
  firstName: {
    type: String,
    maxlength: 30
  },
  lastName: {
    type: String,
    maxlength: 30
  },
  userName: {
    type: String,
    maxlength: 30
  },
  password: {
    type: String,
    maxlength: 50
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function(v) {
        return /^0[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} geçersiz telefon numarasıdır.`
    }
  },
  email: {
    type: String,
    maxlength: 50,
    validate: {
      validator: function(v) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: props => `${props.value} geçersiz e-posta adresidir.`
    }
  },
  bio: {
    type: String,
    maxlength: 50
  }
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
