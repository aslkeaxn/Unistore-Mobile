import BASE from "./base";

const AUTH_URL = `${BASE}/auth`;

const USER_URL = `${BASE}/users`;

const VERIFICATION_URL = `${BASE}/verification`;

const CATEGORY_URL = `${BASE}/category`;

const ADVERTISEMENT_URL = `${BASE}/advertisement`;

const CHAT_URL = `${BASE}/chat`;

const STORE_URL = `${BASE}/store`;

const Backend = {
    Auth: {
        signIn: `${AUTH_URL}/signIn`,
        me: `${AUTH_URL}/me`,
    },
    User: {
        createUser: USER_URL,
        updateUser: USER_URL,
        getUser: USER_URL,
        resetPassword: `${USER_URL}/password-reset`,
        getPhoneNumber: (userId) => `${USER_URL}/${userId}/phone-number`,
    },
    Verification: {
        registrationVerification: `${VERIFICATION_URL}/registration-verification`,
        passwordResetVerification: `${VERIFICATION_URL}/password-reset-verification`,
        passwordResetVerificationConfirm: `${VERIFICATION_URL}/password-reset-verification-confirm`,
    },
    Category: {
        getCategories: `${CATEGORY_URL}`,
        getCategory: (categoryId) => `${CATEGORY_URL}/${categoryId}`,
    },
    Advertisement: {
        createAdvertisement: `${ADVERTISEMENT_URL}`,
        getAdvertisement: (advertisementId) =>
            `${ADVERTISEMENT_URL}/${advertisementId}`,
        getAdvertisements: (storeId) => `${ADVERTISEMENT_URL}/store/${storeId}`,
        updateAdvertisement: (advertisementId) =>
            `${ADVERTISEMENT_URL}/${advertisementId}`,
        deleteAdvertisement: (advertisementId) =>
            `${ADVERTISEMENT_URL}/${advertisementId}`,
        readLatest: (type, userType) =>
            `${ADVERTISEMENT_URL}/recent?type=${type}&userType=${userType}`,
    },
    Chat: {
        readUnreadMessagesCount: `${CHAT_URL}/unread`,
        readConversations: `${CHAT_URL}/`,
        readConversation: (interlocutorId) => `${CHAT_URL}/${interlocutorId}`,
        sendMessage: (receiverId) => `${CHAT_URL}/${receiverId}`,
        updateMessageStatus: (messageId) =>
            `${CHAT_URL}/${messageId}/update-status`,
    },
    Store: {
        getStores: `${STORE_URL}`,
        getUserStores: `${STORE_URL}?type=user`,
        getPartnerStores: `${STORE_URL}?type=partner`,
        getOwnStore: `${STORE_URL}/me`,
        createStore: `${STORE_URL}`,
        getStore: (storeId) => `${STORE_URL}/${storeId}`,
        updateStore: (storeId) => `${STORE_URL}/${storeId}`,
        deleteStore: (storeId) => `${STORE_URL}/${storeId}`,
    },
};

export default Backend;
