import Backend from "../constants/backend";

async function validateVerificationCode(registrationVerificationCode, email) {
    const response = await fetch(
        Backend.Verification.registrationVerification,
        {
            method: "POST",
            body: JSON.stringify({ registrationVerificationCode, email }),
            headers: { "Content-Type": "application/json" },
        }
    );

    return await response.json();
}

async function requestPasswordReset(email) {
    const response = await fetch(
        Backend.Verification.passwordResetVerification,
        {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: { "Content-Type": "application/json" },
        }
    );

    return await response.json();
}

async function validatePasswordResetCode(passwordResetCode, email) {
    const response = await fetch(
        Backend.Verification.passwordResetVerificationConfirm,
        {
            method: "POST",
            body: JSON.stringify({ passwordResetCode, email }),
            headers: { "Content-Type": "application/json" },
        }
    );

    return await response.json();
}

export const Verification = {
    validateVerificationCode,
    requestPasswordReset,
    validatePasswordResetCode,
};
