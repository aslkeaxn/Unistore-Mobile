import Backend from "../constants/backend";

async function createUser(user) {
    const response = await fetch(Backend.User.createUser, {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
    });

    return await response.json();
}

async function getUser(userToken) {
    const response = await fetch(Backend.User.getUser, {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    });

    return await response.json();
}

async function updateUser(userToken, user) {
    const response = await fetch(Backend.User.updateUser, {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${userToken}`,
        },
    });

    return await response.json();
}

async function resetPassword(passwordResetToken, password) {
    const response = await fetch(Backend.User.resetPassword, {
        method: "PUT",
        body: JSON.stringify({ password }),
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${passwordResetToken}`,
        },
    });

    return await response.json();
}

async function getPhoneNumber(userToken, userId) {
    const response = await fetch(Backend.User.getPhoneNumber(userId), {
        headers: {
            authorization: `Bearer ${userToken}`,
        },
    });

    return await response.json();
}

export const User = {
    createUser,
    getUser,
    resetPassword,
    updateUser,
    getPhoneNumber,
};
