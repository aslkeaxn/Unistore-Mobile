import { Layout, Text } from "@ui-kitten/components";
import ScreenContainer from "../../components/ScreenContainer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Modal,
} from "react-native";
import Screen from "../../constants/screen";
import { useAuth } from "../../contexts/auth";

import { AntDesign } from "@expo/vector-icons";
import API from "../../api";
import Toast from "react-native-root-toast";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Query from "../../constants/query";
import AdvertisementType from "../../constants/advertisement-type";
import UserType from "../../constants/user-type";
import StoreType from "../../constants/store-type";
import { useStore } from "../../contexts/store";
import { Feather } from "@expo/vector-icons";

export default function ScreenStoreDetails() {
    const route = useRoute();

    const [state, setState] = useState({
        store: route.params.store,
        controlId: route.params.userId,
        showDeleteModal: false,
    });

    return (
        <ScreenContainer>
            <Layout style={styles.container}>
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <StoreDetails
                        state={state}
                        setState={setState}
                    ></StoreDetails>
                    <StoreAdvertisements
                        state={state.store}
                    ></StoreAdvertisements>
                </ScrollView>
            </Layout>
            <DeleteModal state={state} setState={setState}></DeleteModal>
        </ScreenContainer>
    );
}

function StoreDetails({ state, setState }) {
    const { store } = state;

    const { _id: storeId, image, name, description } = store;
    const [isExpanded, setIsExpanded] = useState(false);

    useStoreDetails(storeId, setState);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const renderDescription = () => {
        if (isExpanded) {
            return <Text style={styles.description}>{description}</Text>;
        } else {
            return (
                <Text numberOfLines={3} style={styles.truncatedDescription}>
                    {description}
                </Text>
            );
        }
    };

    return (
        <>
            <Image source={{ uri: image.url }} style={styles.image}></Image>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <Text style={styles.name}>{name}</Text>
                <StoreControls
                    state={state}
                    setState={setState}
                ></StoreControls>
            </View>
            {renderDescription()}

            {!isExpanded && description.length > 130 && (
                <Feather
                    name="chevron-down"
                    size={18}
                    color="black"
                    onPress={toggleExpansion}
                    style={styles.expand_Button}
                />
            )}
            {description.length < 130 && (
                <View style={{ paddingBottom: 40 }}></View>
            )}
            {isExpanded && (
                <Feather
                    name="chevron-up"
                    size={18}
                    color="black"
                    onPress={toggleExpansion}
                    style={styles.expand_Button}
                />
            )}
        </>
    );
}

function useStoreDetails(storeId, setState) {
    const {
        user: { token: userToken },
    } = useAuth();

    const navigation = useNavigation();

    async function getStore() {
        try {
            const { store, error } = await API.Store.getStore(
                userToken,
                storeId
            );

            if (error) {
                return Toast.show(error, Toast.durations.SHORT);
            }

            return store;
        } catch (error) {
            Toast.show("Could not load advertisement", Toast.durations.SHORT);
            navigation.goBack();
        }
    }

    const { data } = useQuery({
        queryKey: [Query.Store(storeId)],
        queryFn: getStore,
    });

    useEffect(() => {
        if (!data) {
            return;
        }

        const { name, description, image } = data;
        setState((prevState) => ({
            ...prevState,
            store: {
                ...prevState.store,
                description,
                image,
                name,
            },
        }));
    }, [data]);
}

function DeleteModal({ state, setState }) {
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { showDeleteModal } = state;
    const {
        store: { _id: storeId, type },
    } = state;
    const navi = useNavigation();
    const queryClient = useQueryClient();

    const {
        user: { token: userToken },
    } = useAuth();
    const { setStore } = useStore();

    async function deleteStore() {
        try {
            setDeleteLoading(true);

            const { error, message } = await API.Store.deleteStore(
                userToken,
                storeId
            );

            if (error) {
                return Toast.show(error, Toast.durations.SHORT);
            }

            if (type === StoreType.Partner) {
                return setStore(null);
            }

            if (message) {
                queryClient.invalidateQueries({
                    queryKey: [Query.Stores],
                });

                Toast.show(message, Toast.durations.SHORT);
            }

            navi.goBack();
        } catch (error) {
            Toast.show("Unable to delete, try later");
        } finally {
            setDeleteLoading(false);
        }
    }

    const handleCancel = () => {
        setState((state) => ({ ...state, showDeleteModal: false }));
    };

    const handleDelete = async () => {
        deleteStore();
        setState((state) => ({ ...state, showDeleteModal: false }));
    };

    return (
        <Modal
            animationType="fade"
            visible={showDeleteModal}
            transparent={true}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                }}
            >
                {showDeleteModal && (
                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 16,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "poppins" }}>
                            Are you sure want to delete this store?
                        </Text>
                        {deleteLoading ? (
                            LoadingIndicator
                        ) : (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    marginTop: 18,
                                }}
                            >
                                <TouchableOpacity
                                    TouchableOpacity
                                    onPress={handleCancel}
                                    style={{ marginRight: 8 }}
                                >
                                    <Text
                                        style={{
                                            color: "red",
                                            fontWeight: "bold",
                                            fontSize: 18,
                                            fontFamily: "poppins"
                                        }}
                                    >
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleDelete}>
                                    <Text
                                        style={{
                                            color: "green",
                                            fontWeight: "bold",
                                            fontSize: 18,
                                            fontFamily: "poppins"
                                        }}
                                    >
                                        Delete
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </Modal>
    );
}

function StoreControls({ state, setState }) {
    const { store, controlId } = state;
    let { type, _id: storeId, userId: ownerId } = store;

    if (typeof ownerId === "object") {
        ownerId = ownerId._id;
    }

    const {
        user: {
            details: { userId },
        },
    } = useAuth();

    if (userId !== ownerId) {
        return;
    }

    const navigation = useNavigation();

    function onEdit() {
        if (type === StoreType.Partner) {
            return navigation.navigate(Screen.PartnerHomeStoreForm, {
                type,
                storeId,
            });
        }

        !controlId
            ? navigation.navigate(Screen.StudentHomeStoreForm, {
                type,
                storeId,
            })
            : navigation.navigate(Screen.StudentProfileStoreForm, {
                type,
                storeId,
            });
    }

    function onDelete() {
        setState((state) => ({ ...state, showDeleteModal: true }));
    }

    return (
        <View style={{ flexDirection: "row", gap: 10 }}>
            <Feather name="edit-2" size={22} color="black" onPress={onEdit} />
            <Feather name="trash" size={22} color="red" onPress={onDelete} />
        </View>
    );
}

function StoreAdvertisements({ state }) {
    let { _id: storeId, userId: ownerId } = state;

    if (typeof ownerId === "object") {
        ownerId = ownerId._id;
    }

    const [advertisements, setAdvertisements] = useState([]);

    useStoreAdvertisements(storeId, setAdvertisements);

    const {
        user: {
            details: { userId },
        },
    } = useAuth();

    const onPress = useNavigateToAddAdvertisementForm(storeId);
    const onPressMore = useNavigateToStoreProductsCatalogue(storeId);

    return !advertisements ? (
        <LoadingIndicator />
    ) : (
        <View style={{ flex: 1, rowGap: 5 }}>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                    }}
                >
                    <Text style={styles.title__small}>Products</Text>
                    {userId === ownerId && (
                        <Feather
                            name="plus"
                            size={22}
                            color="black"
                            onPress={onPress}
                        />
                    )}
                </View>
                {advertisements.length != 0 && (
                    <TouchableOpacity onPress={onPressMore}>
                        <Text style={styles.header__smallButton}>All</Text>
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView
                horizontal
                style={{ flex: 1 }}
                showsHorizontalScrollIndicator={false}
            >
                {advertisements.length == 0 && <Text style={{ fontFamily: "poppins" }}>No Items added</Text>}
                <View style={{ flexDirection: "row", gap: 40 }}>
                    {advertisements.map((ad) => (
                        <AdvertisementItem
                            key={ad._id}
                            advertisement={ad}
                        ></AdvertisementItem>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

function useStoreAdvertisements(storeId, setAdvertisements) {
    const {
        user: { token: userToken },
    } = useAuth();

    const fetchStoreAdvertisements = async () => {
        try {
            const { error, advertisements } =
                await API.Advertisement.getAdvertisements(userToken, storeId);

            if (error) {
                Toast.show(error, Toast.durations.SHORT);
            }

            return advertisements;
        } catch (error) {
            Toast.show(error, Toast.durations.SHORT);
        }
    };

    const { data } = useQuery({
        queryKey: [Query.StoreProduct(storeId)],
        queryFn: fetchStoreAdvertisements,
    });

    useEffect(() => {
        if (!data) {
            return;
        }
        setAdvertisements(data);
    }, [data]);
}

const AdvertisementItem = ({ advertisement }) => {
    const imageUri = advertisement.images && advertisement.images[0].url;
    const { title, price } = advertisement;

    const onPress = useListAdvertisementItemNavigation(advertisement);
    return (
        <View style={styles.advertisement_container}>
            <TouchableOpacity
                onPress={onPress}

            >
                <View style={styles.borderStyle}>
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.advertisement_image}
                    />
                </View>
                <Text numberOfLines={2} lineBreakMode="tail" style={{ fontFamily: "poppins", }}>{title}</Text>
                <Text style={{ fontFamily: "poppins" }}>QAR {price}</Text>
            </TouchableOpacity>
        </View>
    );
};

const useNavigateToStoreProductsCatalogue = (storeId) => {
    const navigation = useNavigation();
    const route = useRoute();
    const userId = route.params?.userId;
    const utype = route.params?.utype;

    const {
        store: { type },
    } = route.params;

    if (type === StoreType.Partner) {
        onPress = () => {
            utype
                ? navigation.navigate(
                    Screen.StudentPartnersAdvertisementCatalogue,
                    {
                        type: AdvertisementType.Product,
                        storeId,
                        utype: "studentpartneradvertisement",
                    }
                )
                : navigation.navigate(
                    Screen.PartnerHomeAdvertisementCatalogue,
                    {
                        utype: "partneradvertisement",
                        type: AdvertisementType.Product,
                        storeId,
                    }
                );
        };

        return onPress;
    }

    onPress = () => {
        !userId
            ? navigation.navigate(Screen.StudentHomeAdvertisementCatalogue, {
                type: AdvertisementType.Product,
                storeId,
            })
            : navigation.navigate(Screen.StudentProfileAdvertisementCalogue, {
                type: AdvertisementType.Product,
                storeId,
                userId,
            });
    };

    return onPress;
};

const useNavigateToAddAdvertisementForm = (storeId) => {
    const navigation = useNavigation();
    const route = useRoute();

    let onPress;

    const {
        store: { type },
    } = route.params;

    if (type === StoreType.Partner) {
        onPress = () => {
            navigation.navigate(Screen.PartnerHomeAdvertisementForm, {
                type: AdvertisementType.Product,
                storeId,
            });
        };

        return onPress;
    }

    const userId = route.params.userId ? route.params.userId : undefined;

    onPress = () => {
        !userId
            ? navigation.navigate(Screen.StudentHomeAdvertisementForm, {
                type: AdvertisementType.Product,
                storeId,
            })
            : navigation.navigate(Screen.StudentProfileAdvertisementForm, {
                type: AdvertisementType.Product,
                storeId,
            });
    };

    return onPress;
};

function useListAdvertisementItemNavigation(advertisement) {
    const navigation = useNavigation();
    const route = useRoute();

    let onPress;

    const {
        store: { type },
    } = route.params;
    const utype = route.params?.utype;

    if (utype === "studentpartner") {
        onPress = () => {
            navigation.navigate(Screen.StudentPartnersAdvertisementDetails, {
                advertisement,
            });
        };

        return onPress;
    } else if (type === StoreType.Partner) {
        onPress = () => {
            navigation.navigate(Screen.PartnerHomeAdvertisementDetails, {
                advertisement,
                utype: type,
            });
        };

        return onPress;
    }

    const userId = route.params.userId ? route.params.userId : undefined;

    onPress = () => {
        !userId
            ? navigation.navigate(Screen.StudentHomeAdvertisementDetails, {
                advertisement,
            })
            : navigation.navigate(Screen.StudentProfileAdvertisementDetails, {
                advertisement,
            });
    };

    return onPress;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        padding: 10,
    },
    image: {
        width: "100%",
        height: 300,
        resizeMode: "cover",
        marginBottom: 16,
        borderRadius: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "left",
        fontFamily: "poppins"
    },
    description: {
        fontSize: 18,
        marginBottom: 10,
        fontFamily: "poppins"
    },
    truncatedDescription: {
        fontSize: 18,
        textAlign: "left",
        lineHeight: 24,
        marginBottom: 10,
        fontFamily: "poppins"
    },
    expand_Button: {
        fontWeight: "light",
        color: "gray",
        marginBottom: 5,
        textAlign: "center",
    },
    title__small: {
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "poppins",
        textAlign: "left",
    },
    advertisement_container: {
        flex: 1,
        rowGap: 5,
        maxWidth: 151
    },
    borderStyle: {
        borderWidth: 0.5,
        borderRadius: 20,
    },
    advertisement_image: {
        width: 150,
        height: 150,
        borderRadius: 20,
    },
    header__smallButton: {
        fontSize: 12,
        color: "red",
        fontWeight: "bold",
        fontFamily: "poppins"
    },
});
