import Backend from "../constants/backend";

async function getCategories(userToken) {
    const response = await fetch(Backend.Category.getCategories, {
        method: "GET",
        headers: { authorization: `Bearer ${userToken}` },
    });

    return await response.json();
}

async function getCategory(userToken, categoryId) {
    const response = await fetch(Backend.Category.getCategory(categoryId), {
        method: "GET",
        headers: { authorization: `Bearer ${userToken}` },
    });

    return await response.json();
}

export const Category = { getCategories, getCategory };
