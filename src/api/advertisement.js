import Backend from "../constants/backend";

async function createAdvertisement(userToken, advertisement) {
    const formData = createFormData(advertisement);

    const response = await fetch(Backend.Advertisement.createAdvertisement, {
        headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
        },
        method: "POST",
        body: formData,
    });

    return await response.json();
}

async function getAdvertisement(userToken, advertisementId) {
    const response = await fetch(
        Backend.Advertisement.getAdvertisement(advertisementId),
        {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        }
    );

    return await response.json();
}

async function getAdvertisements(userToken, storeId) {
    const response = await fetch(
        Backend.Advertisement.getAdvertisements(storeId),
        {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        }
    );

    return await response.json();
}

async function readLatestAdvertisements(userToken, type, userType) {
    const response = await fetch(
        Backend.Advertisement.readLatest(type, userType),
        {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        }
    );

    return await response.json();
}

async function updateAdvertisement(userToken, advertisementId, advertisement) {
    const formData = createFormData(advertisement);

    const response = await fetch(
        Backend.Advertisement.updateAdvertisement(advertisementId),
        {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "multipart/form-data",
            },
            method: "PUT",
            body: formData,
        }
    );

    return await response.json();
}

async function deleteAdvertisement(userToken, advertisementId) {
    const response = await fetch(
        Backend.Advertisement.deleteAdvertisement(advertisementId),
        {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
            method: "DELETE",
        }
    );

    return await response.json();
}

function createFormData(advertisement) {
    const formData = new FormData();

    const { images, imagesToKeep, imagesToDelete } = advertisement;
    advertisement.imagesToDelete = JSON.stringify(imagesToDelete);
    delete advertisement.images;

    if (imagesToKeep) {
        delete advertisement.imagesToKeep;
    }

    Object.keys(advertisement).forEach((key) =>
        formData.append(key, advertisement[key])
    );

    images.forEach((image) => {
        const { uri } = image;
        const uriArray = uri.split(".");
        const fileType = uriArray[uriArray.length - 1];

        formData.append("images", {
            uri,
            name: fileType,
            type: `image/${fileType}`,
        });
    });

    return formData;
}

export const Advertisement = {
    createAdvertisement,
    getAdvertisement,
    updateAdvertisement,
    getAdvertisements,
    deleteAdvertisement,
    readLatestAdvertisements,
};
