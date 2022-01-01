require('dotenv').config();
const User = require('../model/UserModel');
const jwt = require('jsonwebtoken');
const CatchAsyncError = require('../../utils/CatchAsyncError');
const AppError = require('../../utils/AppError');
const SendEmail = require('../../utils/SendEmail');
const ResetMsg = require('../../utils/ResetMaterial');
const { promisify } = require('util');
const crypto = require('crypto');


const createAndSendToken = require('../../utils/CreateAndSendJwt');

const selectUpdateFields = (obj, ...selectedFields) => {
    let filterFields = {};
    // Algo 1
    // Object.keys(obj).forEach(key =>{
    //     if(selectedFields.includes(key)) filterFields[key] = obj[key];
    // })

    // Algo 2 (Algo is more faster than algo 1)
    selectedFields.forEach(el => {
        if (obj[el]) filterFields[el] = obj[el];
    });

    return filterFields;
}


const AuthController = {

    signup: CatchAsyncError(async (req, res, next) => {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirm_password: req.body.confirm_password,
            role: req.body.role
        });

        createAndSendToken(newUser, 201, res);
    }),

    login: CatchAsyncError(async (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password)
            return next(new AppError("Please enter email or password", 400));

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password, user.password)))
            return next(new AppError("Email or Password is not valid", 401));

        createAndSendToken(user, 200, res);

    }),

    updateMe: CatchAsyncError(async (req, res, next) => {
        if (req.body.password)
            return next(new AppError("You can't update on this route, follow /update-password route for update the password"));

        const updatedFields = selectUpdateFields(req.body, 'name', 'email');

        const UpdatedUser = await User.findByIdAndUpdate(req.user._id, updatedFields, { new: true, runValidators: true });

        res.status(200).json({
            status: "success",
            data: {
                UpdatedUser
            }
        });
    }),

    deleteMe: CatchAsyncError(async (req, res, next) => {

        const UpdatedUser = await User.findByIdAndUpdate(req.user._id, { active: false }, { new: true, runValidators: true });

        res.status(204).json({
            status: "success",
            data: null
        });
    }),

    updatePassword: CatchAsyncError(async (req, res, next) => {
        const user = await User.findOne({ email: req.user.email }).select('+password');

        if (!await user.matchPassword(req.body.password, user.password))
            return next(new AppError('Password is not correct', 404));

        user.password = req.body.newPassword;
        user.confirm_password = req.body.newConfirmPassword;

        // User findByIdAndUpdate will not work as intended !
        const updatedUser = await user.save();

        createAndSendToken(updatedUser, 200, res);
    }),

    // Protect routes if user is not logged in
    protect: CatchAsyncError(async (req, res, next) => {
        // Token existing
        let jwtToken;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
            jwtToken = req.headers.authorization.split(' ')[1];

        if (!jwtToken)
            return next(new AppError('User is not logged in, Please login for access', 401));

        // Varification of Token
        const decodeToken = await promisify(jwt.verify)(jwtToken, process.env.APP_SECRET_KEY);

        // Check if user still exists (Many of the developer don't know about this but it's imp😎😎)
        const freshUser = await User.findById(decodeToken.id);
        if (!freshUser) return next(new AppError("User belonging to this token, no longar exists", 401));

        // Check if user changed the password, then we have to logout him from all the deviecs
        // This is also very important as a security measures
        
        if (freshUser.checkPasswordChange(decodeToken.iat)) {
            return next(new AppError("User recentely changed the password, please login to continue", 401));
        }

        // ACCESS GRANTED
        req.user = freshUser;
        next();
    }),

    // This function can't have any promise & don't have any attachment to catch, That's why he is not in CatchAsyncError function
    access: function (...roles) {
        return (req, res, next) => {
            if (!roles.includes(req.user.role))
                return next(new AppError("You don't have access for this", 403));
            next();
        }
    },

    forgetPassword: CatchAsyncError(async (req, res, next) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) return next(new AppError("User not exists with this email", 404));

            // Create reset token for user (Fatty Model, thin Controller)
            const resetToken = user.reset_TokenGenerate();

            // Confirm Password field is set to be required true, but we are also unmounting field once the password match middleware run in model, So here we have ignore this validation rule to prevent from validation error of confirm_password field.

            await user.save({ validateBeforeSave: false });

            // Send it to users emails
            const options = {
                email: user.email,
                subject: "Your password change token is valid for 10 min",
                msg: ResetMsg(resetToken)
            }

            // Sent mail to client
            await SendEmail(options);

            return res.status(200).json({
                status: 'success',
                msg: 'Reset link send successfully to the following email'
            });

        }
        catch (err) {
            user.passwordResetExpires = undefined;
            user.passwordResetToken = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(504).send({
                status: 'error',
                error: err
            })
        }
    }),

    resetPassword: CatchAsyncError(async (req, res, next) => {
        const passwordResetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');;

        // Check if token exists & valid
        const user = await User.findOne({
            passwordResetToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) return next(new AppError("Token is expired due to time limit", 404));

        user.password = req.body.password;
        user.confirm_password = req.body.confirm_password;
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;

        // Password reset successfully
        const updatedUser = await user.save();

        createAndSendToken(updatedUser, 200, res);
    }),

}

module.exports = AuthController;