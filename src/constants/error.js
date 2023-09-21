const Error = {
    VerificationCodeError:
        "A verification code has already been sent to the email",
    UserUnverifiedError: "Account verification is incomplete",
    ExpiredVerificationCodeError:
        "Verification code expired, please sign up again",
    ExpiredPasswordResetCodeError:
        "Password reset code expired, please start again",
};

export default Error;
