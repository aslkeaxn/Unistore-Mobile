import { useNavigation, useRoute } from "@react-navigation/native";
import ScreenContainer from "../../components/ScreenContainer";
import { useEffect, useState } from "react";
import { Input, Layout, Modal, Text } from "@ui-kitten/components";
import Toast from "react-native-root-toast";
import API from "../../api";
import { useAuth } from "../../contexts/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Query from "../../constants/query";
import {
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback,
} from "react-native";
import Screen from "../../constants/screen";
import Button, { ButtonType } from "../../components/Button";
import { Feather } from "@expo/vector-icons";
import { Menu, Provider, DefaultTheme } from "react-native-paper";
import AdvertisementType from "../../constants/advertisement-type";
import STOREIDS from "../../constants/store-id";

const PLACEHOLDER_IMAGE = require("../../../assets/res/placeholder.png");

export default function ScreenAdvertisementDetails() {
    const route = useRoute();

    const [state, setState] = useState({
        advertisement: route.params.advertisement,
        controlId: route.params.userId,
        category: null,
        showDeleteModal: false,
        showMessageModal: false,
    });

    return (
        <ScreenContainer>
            <View style={{ paddingHorizontal: 10, flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <AdvertisementControls state={state} setState={setState} />
                    <AdvertisementDetails state={state} setState={setState} />
                    <ContactControls state={state} setState={setState} />
                    <MessageModal state={state} setState={setState} />
                    <AdvertisementDeleteModal
                        state={state}
                        setState={setState}
                    />
                </ScrollView>
            </View>
        </ScreenContainer>
    );
}

function AdvertisementDetails({ state, setState }) {
    const { advertisement, category } = state;

    const {
        _id: advertisementId,
        title,
        description,
        images,
        price,
        stock,
        categoryId,
        type,
        date,
    } = advertisement;

    useAdvertisementDetails(advertisementId, setState);
    useAdvertisementCategory(categoryId, setState);

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const renderDescription = () => {
        if (isExpanded) {
            return <Text style={styles.description}>{description}</Text>;
        } else {
            return (
                <Text numberOfLines={3} style={styles.description}>
                    {description}
                </Text>
            );
        }
    };

    const adDate = new Date(date);

    return (
        <Layout>
            {images.length > 0 && type == "Product" ? (
                <View style={{ backgroundColor: "#D3D3D3", height: 390 }}>
                    <>
                        <AdvertisementImages images={images} />
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            {category && (
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        paddingTop: 5,
                                        paddingLeft: 5,
                                        textAlign: "left",
                                        fontFamily: "poppins",
                                    }}
                                >
                                    {category}
                                </Text>
                            )}
                            {date && (
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        paddingTop: 5,
                                        paddingRight: 5,
                                        textAlign: "right",
                                        fontFamily: "poppins",
                                    }}
                                >
                                    {adDate.toLocaleString()}
                                </Text>
                            )}
                        </View>
                    </>
                </View>
            ) : (
                <AdvertisementImages images={images} />
            )}
            <Text
                style={{
                    fontSize: 24,
                    paddingTop: 10,
                    fontFamily: "poppins",
                    marginBottom: 30
                }}
            >
                {title}
            </Text>

            {type === AdvertisementType.Product && (
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "baseline",
                        marginBottom: 30
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            fontFamily: "poppins",
                        }}
                    >
                        QAR {price}
                    </Text>
                    <Text style={{ fontSize: 16, fontFamily: "poppins" }}>
                        (available: {stock})
                    </Text>
                </View>
            )}


            <Text style={{ fontSize: 20, marginBottom: 5, fontFamily: 'poppins' }}>Description</Text>
            {renderDescription()}



            {!isExpanded && description.length > 130 && (
                <Feather
                    name="chevron-down"
                    size={18}
                    color="black"
                    onPress={toggleExpansion}
                    style={styles.expandButton}
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
                    style={styles.expandButton}
                />
            )}
        </Layout>
    );
}

function AdvertisementImages({ images }) {
    const n = images.length;

    if (n === 0) {
        return (
            <Layout>
                <View style={{
                    marginTop: 10,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderWidth: 1,
                    height: 350,
                }}>
                    <Image
                        source={PLACEHOLDER_IMAGE}
                        style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "cover",
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            borderWidth: 1,
                        }}
                    />
                </View>
            </Layout>
        );
    }

    const [index, setIndex] = useState(0);
    const image = images[index];
    const { url } = image;

    function onPress(d) {
        setIndex((index) => (index + d + n) % n);
    }

    const leftIcon = <Feather name="arrow-left" size={12} color="white" />;
    const rightIcon = <Feather name="arrow-right" size={12} color="white" />;

    return (
        <Layout>
            <View
                style={{
                    marginTop: 10,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                }}
            >
                <Image
                    source={{ uri: url }}
                    style={{
                        width: "100%",
                        height: 350,
                        resizeMode: "cover",
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}
                />
            </View>
            {n > 1 && (
                <View
                    style={{
                        position: "absolute",
                        top: 320,
                        left: "38%",
                        flexDirection: "row",
                        columnGap: 20,
                    }}
                >
                    <Button
                        onPress={() => onPress(-1)}
                        text={leftIcon}
                        style={{ width: 40, height: 40 }}
                        type={ButtonType.RNESolid}
                    ></Button>
                    <Button
                        onPress={() => onPress(+1)}
                        text={rightIcon}
                        style={{ width: 40, borderRadius: 30 }}
                        type={ButtonType.RNESolid}
                    ></Button>
                </View>
            )}
        </Layout>
    );
}

function AdvertisementControls({ state, setState }) {
    const route = useRoute();
    const { advertisement, controlId } = state;
    const { type, _id: advertisementId, userId: ownerId } = advertisement;
    const utype = route.params?.utype;

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
        closeMenu();
        !controlId && !utype
            ? navigation.navigate(Screen.StudentHomeAdvertisementForm, {
                type,
                advertisementId,
            })
            : controlId && !utype
                ? navigation.navigate(Screen.StudentProfileAdvertisementForm, {
                    type,
                    advertisementId,
                })
                : navigation.navigate(Screen.PartnerHomeAdvertisementForm, {
                    type,
                    advertisementId,
                });
    }

    function onDelete() {
        closeMenu();
        setState((state) => ({ ...state, showDeleteModal: true }));
    }

    const [visible, setVisible] = useState(false);
    const openMenu = () => {
        setVisible(true);
    };

    const closeMenu = () => setVisible(false);

    return (
        <View style={{ zIndex: 100 }}>
            <Provider theme={DefaultTheme}>
                <View
                    style={{
                        paddingTop: 10,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                    }}
                >
                    <Menu
                        position="bottom"
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <Feather
                                name="more-horizontal"
                                size={24}
                                color="black"
                                onPress={openMenu}
                                on
                            />
                        }
                    >
                        <Menu.Item title="Edit" onPress={onEdit} />
                        <Menu.Item title="Delete" onPress={onDelete} />
                    </Menu>
                </View>
            </Provider>
        </View>
    );
}

function ContactControls({ state, setState }) {
    const { advertisement } = state;
    const { userId: ownerId } = advertisement;

    const {
        user: {
            details: { userId },
        },
    } = useAuth();

    if (userId === ownerId) {
        return;
    }

    return (
        <Layout
            style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 20,
            }}
        >
            <ContactControlButtonMessage state={state} setState={setState} />
            <ContactControlButtonWhatsapp state={state} setState={setState} />
        </Layout>
    );
}

function ContactControlButtonMessage({ state, setState }) {
    const text = "Message";

    function onPress() {
        setState((state) => ({ ...state, showMessageModal: true }));
    }

    return <Button onPress={onPress} text={text} style={{ flex: 1 }}></Button>;
}

function ContactControlButtonWhatsapp({ state, setState }) {
    const text = "Whatsapp";

    const { advertisement } = state;
    const { userId: ownerId } = advertisement;

    const {
        user: { token: userToken },
    } = useAuth();

    async function onPress() {
        try {
            const { error, phoneNumber } = await API.User.getPhoneNumber(
                userToken,
                ownerId
            );

            if (error) {
                return Toast.show(error, Toast.durations.SHORT);
            }

            await Linking.openURL(`whatsapp://send?phone=+974${phoneNumber}`);
        } catch (error) {
            console.error(error);
            Toast.show(
                "An error occurred, please try later",
                Toast.durations.SHORT
            );
        }
    }

    return <Button onPress={onPress} text={text} style={{ flex: 1 }}></Button>;
}

function MessageModal({ state, setState }) {
    const placeholder = "Message";
    const textSend = "Send";
    const textCancel = "Cancel";

    const { showMessageModal } = state;

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    function onChange(message) {
        setMessage(message);
    }

    function onCancel() {
        setState((state) => ({ ...state, showMessageModal: false }));
    }

    const { advertisement } = state;
    const { userId: ownerId } = advertisement;

    const {
        user: { token: userToken },
    } = useAuth();

    async function onSend() {
        try {
            setLoading(true);

            const { error } = await API.Chat.sendMessage(userToken, ownerId, {
                text: message,
            });

            if (error) {
                return Toast.show(error, Toast.durations.SHORT);
            }

            Toast.show("Message sent", Toast.durations.SHORT);
        } catch (error) {
            console.error(error);
            Toast.show(
                "Could not send message, try later",
                Toast.durations.SHORT
            );
        } finally {
            setState((state) => ({ ...state, showMessageModal: false }));
            setLoading(false);
            setMessage("");
        }
    }

    function onBackdropPress() {
        onCancel();
    }

    return (
        <Modal
            visible={showMessageModal}
            style={{ width: "90%" }}
            transparent={true}
            onBackdropPress={onBackdropPress}
            backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0)",
                }}
            >
                <Layout style={{ padding: 30, borderRadius: 8 }}>
                    <Input
                        multiline
                        placeholder={placeholder}
                        value={message}
                        onChangeText={onChange}
                        disabled={loading}
                        size="large"
                    />
                    <Layout
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            marginTop: 20,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                columnGap: 10,
                                marginTop: 18,
                            }}
                        >
                            <TouchableOpacity
                                TouchableOpacity
                                onPress={onCancel}
                                style={{ marginRight: 8 }}
                            >
                                <Text
                                    style={{
                                        color: "red",
                                        fontWeight: "bold",
                                        fontSize: 18,
                                        fontFamily: "poppins",
                                    }}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onSend}>
                                <Text
                                    style={{
                                        color: "green",
                                        fontWeight: "bold",
                                        fontSize: 18,
                                        fontFamily: "poppins",
                                    }}
                                >
                                    Send
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Layout>
                </Layout>
            </View>
        </Modal>
    );
}

function AdvertisementDeleteModal({ state, setState }) {
    const { showDeleteModal, advertisement } = state;

    function onBackdropPress() {
        setState((state) => ({ ...state, showDeleteModal: false }));
    }

    function onPressCancel() {
        setState((state) => ({ ...state, showDeleteModal: false }));
    }

    const onDelete = useAdvertisementDeleteModalButtonDelete(advertisement);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showDeleteModal}
            onBackdropPress={onBackdropPress}
            backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0)",
                    border: "none",
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
                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                            Are you sure want to delete this advertisement?
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginTop: 18,
                                fontFamily: "poppins",
                            }}
                        >
                            <TouchableOpacity
                                TouchableOpacity
                                onPress={onPressCancel}
                                style={{ marginRight: 8 }}
                            >
                                <Text
                                    style={{
                                        color: "red",
                                        fontWeight: "bold",
                                        fontSize: 18,
                                        fontFamily: "poppins",
                                    }}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onDelete}>
                                <Text
                                    style={{
                                        color: "green",
                                        fontWeight: "bold",
                                        fontSize: 18,
                                        fontFamily: "poppins",
                                    }}
                                >
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </Modal>
    );
}

function AdvertisementDeleteModalButtonCancel({ state, setState }) {
    const text = "Cancel";

    function onPress() {
        setState((state) => ({ ...state, showDeleteModal: false }));
    }

    return (
        <Button onPress={onPress} text={text}>
            {text}
        </Button>
    );
}

function AdvertisementDeleteModalButtonDelete({ state }) {
    const text = "Delete";
    const { advertisement } = state;

    const onDelete = useAdvertisementDeleteModalButtonDelete(advertisement);

    return <Button onPress={onDelete} text={text}></Button>;
}

// Hooks, not UI

function useAdvertisementDeleteModalButtonDelete(advertisement) {
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    const {
        user: { token: userToken },
    } = useAuth();

    const { _id: advertisementId, storeId } = advertisement;

    let invalidateLatest;

    switch (storeId) {
        case STOREIDS.Product:
            invalidateLatest = [Query.LatestStudentProducts];
            break;
        case STOREIDS.Request:
            invalidateLatest = [Query.LatestStudentRequests];
            break;
        case STOREIDS.Service:
            invalidateLatest = [Query.LatestStudentServices];
            break;
        default:
            break;
    }

    async function deleteAdvertisement() {
        try {
            const { error } = await API.Advertisement.deleteAdvertisement(
                userToken,
                advertisementId
            );

            if (error) {
                return Toast.show(error, Toast.durations.SHORT);
            }

            queryClient.invalidateQueries({
                queryKey: [Query.StoreProduct(storeId)],
            });
            queryClient.invalidateQueries({ queryKey: [Query.Store(storeId)] });
            if (invalidateLatest) {
                queryClient.invalidateQueries({ queryKey: invalidateLatest });
            }

            navigation.goBack();
        } catch (error) {
            console.error(error);
        }
    }

    return deleteAdvertisement;
}

function useAdvertisementCategory(categoryId, setState) {
    if (!categoryId) {
        return;
    }

    const {
        user: { token: userToken },
    } = useAuth();

    async function getCategory() {
        try {
            const { error, category } = await API.Category.getCategory(
                userToken,
                categoryId
            );

            if (error) {
                console.error(error);
                return setState((state) => ({
                    ...state,
                    category: "Could not fetch category",
                }));
            }

            const { name } = category;

            setState((state) => ({
                ...state,
                category: name,
            }));
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCategory();
    }, []);
}

function useAdvertisementDetails(advertisementId, setState) {
    const {
        user: { token: userToken },
    } = useAuth();
    const navigation = useNavigation();

    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        const unsubscribe1 = navigation.addListener("blur", () =>
            setEnabled(false)
        );
        const unsubscribe2 = navigation.addListener("focus", () =>
            setEnabled(true)
        );

        function unsubscribe() {
            unsubscribe1();
            unsubscribe2();
        }

        return unsubscribe;
    }, []);

    async function getAdvertisement() {
        try {
            const { advertisement, error } =
                await API.Advertisement.getAdvertisement(
                    userToken,
                    advertisementId
                );

            if (error) {
                return Toast.show(error, Toast.durations.SHORT);
            }

            return advertisement;
        } catch (error) {
            console.error(error);
            Toast.show("Could not load advertisement", Toast.durations.SHORT);
            navigation.goBack();
        }
    }

    const { data } = useQuery({
        queryKey: [Query.Advertisement(advertisementId)],
        queryFn: getAdvertisement,
        refetchInterval: 10000,
        enabled,
    });

    useEffect(() => {
        if (!data) {
            return;
        }

        setState((state) => ({ ...state, advertisement: data }));
    }, [data]);
}

styles = StyleSheet.create({
    description: {
        fontSize: 18,
        textAlign: "left",
        marginBottom: 10,
        fontFamily: "poppins",
    },
    truncatedDescription: {
        fontSize: 18,
        textAlign: "left",
        marginBottom: 10,
        fontFamily: "poppins",
    },
    expandButton: {
        fontWeight: "light",
        color: "gray",
        marginBottom: 5,
        textAlign: "center",
        fontFamily: "poppins",
    },
});
