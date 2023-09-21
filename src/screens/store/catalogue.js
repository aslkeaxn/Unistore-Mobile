import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Layout, Text } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";
import API from "../../api";
import ScreenContainer from "../../components/ScreenContainer";
import Query from "../../constants/query";
import Screen from "../../constants/screen";
import { useAuth } from "../../contexts/auth";
import SearchBar from "../../components/SearchBar";
import Fuse from "fuse.js";
import STYLES from "../../constants/design";
import StoreType from "../../constants/store-type";
import { Feather } from "@expo/vector-icons";

export default function ScreenStoreCatalogue() {
    const [showFilterModal, setShowFilterModal] = useState(false);

    return (
        <ScreenContainer>
            <HeaderStoreCatalogue />
            <ListStores
                showFilterModal={showFilterModal}
                setShowFilterModal={setShowFilterModal}
            ></ListStores>
        </ScreenContainer>
    );
}

function HeaderStoreCatalogue() {
    const route = useRoute();
    const navigation = useNavigation();
    const userId = route.params ? route.params.userId : undefined;
    const type = route.params?.type;

    const text = userId
        ? "My Small Business"
        : type
            ? type === StoreType.Partner || type === "partner"
                ? "Partners Catalogue"
                : "Small Businesses Catalogue"
            : "Small Businesses Catalogue";

    return (
        <Layout style={{ flexDirection: "row", alignItems: "baseline", paddingHorizontal: 5 }}>
            {
                type !== "partner" ?
                    <Feather
                        name="chevron-left"
                        size={24}
                        color="black"
                        onPress={() => { navigation.goBack(); }}
                    /> : <></>}
            <Text style={STYLES.screen_header}>{text}</Text>
        </Layout>);
}

function ListStores({ showFilterModal, setShowFilterModal }) {
    const route = useRoute();
    const userId = route.params ? route.params.userId : undefined;

    const [stores, setStores] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [fetchLoading, setFetchLoading] = useState(true);

    useListStores(setStores, setFetchLoading);

    let filteredStores = userId
        ? stores.filter((store) => store.userId._id === userId)
        : stores;

    const options = {
        keys: ["name", "description", "userId.username"],
    };

    const fuse = new Fuse(filteredStores, options);

    if (searchText) {
        const matches = fuse.search(searchText);
        filteredStores = matches.map((match) => match.item);
    }

    if (stores.length === 0 && !userId) {
        return (
            <Text style={{ fontFamily: "poppins", paddingLeft: 10 }}>
                No stores at the moment...
            </Text>
        );
    }

    return (
        <ScrollView>
            {!userId && (
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    showFilterModal={showFilterModal}
                    setShowFilterModal={setShowFilterModal}
                ></SearchBar>
            )}
            {filteredStores.length > 0 &&
                filteredStores.map((store) => (
                    <ListStoreItem key={store._id} store={store} />
                ))}
            {filteredStores.length === 0 && (
                <Text style={{ paddingLeft: 10, fontFamily: "poppins" }}>
                    You do not own a small business
                </Text>
            )}
        </ScrollView>
    );
}

function useListStores(setStores, setFetchLoading) {
    const navigation = useNavigation();
    const route = useRoute();
    const type = route.params?.type;

    const {
        user: { token: userToken },
    } = useAuth();

    async function getStores() {
        try {
            const { error, stores } = await API.Store.getStores(
                userToken,
                type
            );

            if (error) {
                Toast.show(error, Toast.durations.SHORT);
                navigation.goBack();
            }

            return stores;
        } catch (error) {
            Toast.show(error, Toast.duration.SHORT);
            navigation.goBack();
        }
    }

    const { data } = useQuery({
        queryKey: [Query.Stores, type],
        queryFn: getStores,
    });

    useEffect(() => {
        if (!data) {
            return;
        }
        setStores(data);
        setFetchLoading(false);
    }, [data]);
}

function ListStoreItem({ store }) {
    const { name, description, image } = store;
    const {
        userId: { username: ownerUsername },
    } = store;

    const onPress = useStoreDetailNavigation(store);

    return (
        <Layout>
            <TouchableOpacity onPress={onPress} style={{ padding: 8 }}>
                <View
                    style={{
                        flexDirection: "row",
                    }}
                >
                    <View
                        style={{
                            width: 151,
                            height: 151,
                            borderRadius: 20,
                            overflow: "hidden",
                            borderWidth: 0.5,
                        }}
                    >
                        <Image
                            source={{ uri: image.url }}
                            style={{
                                width: 150,
                                height: 150,
                                borderRadius: 20,
                            }}
                        />
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    width: "60%",
                                    fontFamily: "poppins",
                                }}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {name}
                            </Text>
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    fontFamily: "poppins",
                                }}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                @{ownerUsername}
                            </Text>
                        </View>
                        <View style={{ height: 5 }}></View>
                        <Text
                            style={{ color: "gray", fontFamily: "poppins" }}
                            numberOfLines={6}
                            ellipsizeMode="tail"
                        >
                            {description}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Layout>
    );
}

function useStoreDetailNavigation(store) {
    const navigation = useNavigation();

    const route = useRoute();
    const userId = route.params ? route.params.userId : undefined;
    const type = route.params?.type;

    const onPress = () => {
        !userId && type === "user"
            ? navigation.navigate(Screen.StudentHomeStoreDetails, {
                store,
            })
            : userId && type === "user"
                ? navigation.navigate(Screen.StudentProfileStoreDetails, {
                    store,
                    userId,
                })
                : navigation.navigate(Screen.StudentPartnersStoreDetails, {
                    store,
                    utype: "studentpartner",
                });
    };

    return onPress;
}
