import Backend from "../constants/backend";

async function getStore(userToken, storeId) {
    const response = await fetch(Backend.Store.getStore(storeId), {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    });

    return await response.json();
}

async function getStores(userToken, type) {
    let storesURL;
    type === "user"
        ? (storesURL = Backend.Store.getUserStores)
        : type === "partner"
        ? (storesURL = Backend.Store.getPartnerStores)
        : (storesURL = Backend.Store.getStores);
    const response = await fetch(storesURL, {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    });

    return await response.json();
}

async function getOwnStore(userToken) {
    const response = await fetch(Backend.Store.getOwnStore, {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
    });

    return await response.json();
}

async function createStore(userToken, store) {
    const formData = createFormData(store);

    const response = await fetch(Backend.Store.createStore, {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
        },
        method: "POST",
        body: formData,
    });

    return await response.json();
}

async function updateStore(userToken, storeId, store) {
    const formData = createFormData(store);

    const response = await fetch(Backend.Store.updateStore(storeId), {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
        },
        method: "PUT",
        body: formData,
    });

    return await response.json();
}

async function deleteStore(userToken, storeId) {
    const response = await fetch(Backend.Store.deleteStore(storeId), {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
        method: "DELETE",
    });

    return await response.json();
}

function createFormData(store) {
    const { image } = store;
    delete store.image;

    const formData = new FormData();

    Object.keys(store).forEach((key) => {
        formData.append(key, store[key]);
    });

    const uri = image?.uri;
    const url = image?.url;

    const imageResource = url || uri;

    if (!imageResource) {
        throw new Error("No Store Image");
    }

    const imageResourceArray = imageResource?.split(".");

    const fileType = imageResourceArray[imageResourceArray?.length - 1];

    formData.append("image", {
        uri: imageResource,
        name: fileType,
        type: `image/${fileType}`,
    });

    return formData;
}

export const Store = {
    getStore,
    getStores,
    getOwnStore,
    createStore,
    updateStore,
    deleteStore,
};
