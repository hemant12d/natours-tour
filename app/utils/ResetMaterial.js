module.exports = resetToken => {
    return `Forget password ? Submit a patch request with new password & confirm password to the following url < http://127.0.0.1:8000/users/reset-password/${resetToken} > .\n If you not Forget the password then ignore this email`
}


