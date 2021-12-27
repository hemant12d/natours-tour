const mongoose = require('mongoose');
const emailValidator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "User name is required"]
    },
    email: {
        type: String,
        required: [true, "A user must have a email"],
        unique: true,
        validate: [emailValidator.isEmail, 'Entered email is not valid']
    },
    photo: {
        type: String,
        default: "defaultuser.png"
    },
    role: {
        type: String,
        enum: ["Admin", "Lead-Guide", "Guide", "User"],
        default: "User",
    },
    password: {
        type: String,
        required: [true, "Password field is required"],
        select: false
    },
    confirm_password: {
        type: String,
        required: [true, "Confirm password field is required"],
        // This only work on create & save
        validate: {
            validator: function (c_password) {
                return c_password === this.password;
            },
            message: "Password not match with confirm password"
        }
    },
    active: {
        type: Boolean,
        default: true
    },
    passwordChangeAt: {
        type: Date
    },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date }


});

// Hash the password
UserSchema.pre('save', async function (next) {
    // only run this function if the password was actully modified
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);

    // delete the confirm_password field
    this.confirm_password = undefined;
    next();
});

// Run on change password or forget password
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangeAt = Date.now() - 2000;
});

// Get only active users
UserSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

// Match hash password
UserSchema.methods.matchPassword = async function (password, hashPassword) {
    return await bcrypt.compare(password, hashPassword);
}

// CheckPassword change (check if jwtToken is created after checkPasswordChange or not)
UserSchema.methods.checkPasswordChange = function (tokenCreatedTime) {
    // If Password is not changed
    if (!this.passwordChangeAt)
        return false;

    // Check if token is expired or not
    password_Change_Time_Seconds = parseInt(this.passwordChangeAt.getTime() / 1000);
    return (password_Change_Time_Seconds > tokenCreatedTime);
}

// Reset & Incrypted Token for Forget-Password functionality
UserSchema.methods.reset_TokenGenerate = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Output be Like => ec065ab4a37b300ad9c03141bb10ed497f09cd225d9064cd7d80cc05b40ef23d

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // Output be Like => 2184e84e5993f28a1419cf2ef9dde6ce02d62a4d5d724bc1d51c1f31faad8aaa

    const tenMin = (1000 * 60 * 10);
    this.passwordResetExpires = Date.now() + tenMin;

    return resetToken;
}


UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;

