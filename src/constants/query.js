const Query = {
    Categories: "Categories",
    Product: "Product",
    Service: "Service",
    Request: "Request",
    Stores: "Stores",
    Store: (storeId) => `${storeId}`,
    StoreProduct: (storeId) => `${storeId}-product`,
    Advertisement: (advertisementId) => `${advertisementId}`,
    Conversations: (userId) => `${userId}-conversations`,
    Conversation: (interlocutorId) => `${interlocutorId}-conversation`,
    UnreadMessagesCount: "unread-messages-count",
    LatestStudentProducts: "LatestStudentProducts",
    LatestStudentServices: "LatestStudentServices",
    LatestStudentRequests: "LatestStudentRequests",
    LatestPartnerProducts: "LatestPartnerProducts",
};

export default Query;
