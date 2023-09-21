import Backend from "../constants/backend";

async function signIn(user) {
    const response = await fetch(Backend.Auth.signIn, {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
    });

    return await response.json();
}

async function me(userToken) {
    const response = await fetch(Backend.Auth.me, {
        method: "POST",
        headers: { authorization: `Bearer ${userToken}` },
    });

    return await response.json();
}

export const Auth = { signIn, me };
