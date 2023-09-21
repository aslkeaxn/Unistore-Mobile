import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Input, Layout, Text } from "@ui-kitten/components";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-root-toast";
import API from "../../api";
import ScreenContainer from "../../components/ScreenContainer";
import SearchBar from "../../components/SearchBar";
import AdvertisementType from "../../constants/advertisement-type";
import STYLES from "../../constants/design";
import Query from "../../constants/query";
import Screen from "../../constants/screen";
import { useAuth } from "../../contexts/auth";
import Button, { ButtonType } from "../../components/Button";
import MaterialInput, { InputType } from "../../components/Input";
import { Picker } from "@react-native-picker/picker";
import SortMode from "../../constants/sort-mode";
import NoItems from "../../components/NoItems";

const PLACEHOLDER_IMAGE = require("../../../assets/res/placeholder.png");

export default function ScreenAdvertisementCatalogue() {
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [advertisements, setAdvertisements] = useState([]);

    const route = useRoute();
    const { userId, type } = route.params;

    useListAdvertisements(setAdvertisements);

    const [searchText, setSearchText] = useState("");
    const [maxPrice, setMaxPrice] = useState(Infinity);
    const [categoryId, setCategoryId] = useState(null);
    const [sortMode, setSortMode] = useState(SortMode.NewestFirst);

    let filteredAdvertisements = userId
        ? advertisements.filter(
            (advertisement) => advertisement.userId === userId
        )
        : advertisements;

    filteredAdvertisements = useMemo(
        () =>
            filteredAdvertisements.sort((a, b) => {
                switch (sortMode) {
                    case SortMode.LeastExpensiveFirst:
                        return a.price - b.price;
                    case SortMode.MostExpensiveFirst:
                        return b.price - a.price;
                    case SortMode.OldestFirst:
                        return a.date - b.date;
                    case SortMode.NewestFirst:
                        return b.date - a.date;
                }
            }),
        [advertisements, sortMode]
    );

    const options = { keys: ["title", "description"] };

    const fuse = new Fuse(filteredAdvertisements, options);

    if (searchText) {
        const matches = fuse.search(searchText);
        filteredAdvertisements = matches.map((match) => match.item);
    }

    filteredAdvertisements = filteredAdvertisements.filter((advertisement) => {
        if (advertisement.type !== AdvertisementType.Product) {
            return true;
        }

        const categoryPredicate =
            categoryId === null || categoryId === advertisement.categoryId;

        const pricePredicate = advertisement.price <= maxPrice;

        return categoryPredicate && pricePredicate;
    });

    if (advertisements.length === 0) {
        return (
            <ScreenContainer>
                <Layout>
                    <HeaderAdvertisementCatalogue />
                    <Text style={{ paddingHorizontal: 10, fontSize: 14, fontFamily: "poppins" }}>
                        No advertisements to show for now...
                    </Text>
                </Layout>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <HeaderAdvertisementCatalogue />
            <Layout style={{ flex: 1, flexDirection: "column" }}>
                <SearchBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    showFilterModal={showFilterModal}
                    setShowFilterModal={setShowFilterModal}
                    type={type}
                />
                <ListAdvertisements advertisements={filteredAdvertisements} />
            </Layout>
            <FilterModal
                showFilterModal={showFilterModal}
                setShowFilterModal={setShowFilterModal}
                setMaxPrice={setMaxPrice}
                setCategoryId={setCategoryId}
                advertisements={advertisements}
                setSortMode={setSortMode}
            />
        </ScreenContainer>
    );
}

function HeaderAdvertisementCatalogue() {
    const route = useRoute();
    const navigation = useNavigation();
    const { type, userId } = route.params;

    const text = !userId ? `${type}s Catalogue` : `My ${type}s Catalogue`;
    return (
        <Layout style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 5 }}>
            {type !== "partner" ? <Feather
                name="chevron-left"
                size={24}
                color="black"
                onPress={() => { navigation.goBack(); }}
                style={styles.expandButton} /> : <></>}
            <Text style={STYLES.screen_header}>{text}</Text>
        </Layout>);
}

function ListAdvertisements({ advertisements }) {
    const route = useRoute();
    const { type } = route.params;

    const cataloguesStyle =
        type == AdvertisementType.Product
            ? styles.ProductsCatalogue
            : styles.sandPCatalogue;

    if (advertisements.length === 0) {
        return <NoItems />;
    }

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={cataloguesStyle}>
                {advertisements.map((advertisement) => (
                    <ListAdvertisementsItem
                        key={advertisement._id}
                        advertisement={advertisement}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

function ListAdvertisementsItem({ advertisement }) {
    const [category, setCategory] = useState(null);
    const { title, description, images, categoryId, price, stock, type } =
        advertisement;
    useListAdvertisementItem(categoryId, setCategory);
    const onPress = useListAdvertisementItemNavigation(advertisement);

    const image = images.length === 0 ? null : images[0];

    return (
        <TouchableOpacity onPress={onPress}>
            <Layout
                style={{
                    maxWidth: 180,
                    flex: 1,
                    flexDirection: "row",
                    columnGap: 10,
                }}
            >
                <View style={{
                    width: 151,
                    height: 151,
                    borderRadius: 20,
                    borderWidth: 0.5,
                }}>
                    {image && (
                        <Image
                            source={{ uri: image.url }}
                            style={styles.imageStyle}
                        />
                    )}
                    {!image && (
                        <Image
                            source={PLACEHOLDER_IMAGE}
                            style={styles.imageStyle}
                        />
                    )}
                </View>
                <View style={{}}>
                    <Text
                        style={{ fontSize: 22, marginVertical: 2, fontFamily: "poppins" }}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                    {category && (
                        <Text style={{ marginBottom: 5, fontFamily: "poppins" }}>{category}</Text>
                    )}

                    {type === AdvertisementType.Product && (
                        <Text style={{ marginVertical: 5, fontWeight: "bold", fontFamily: "poppins" }}>
                            QAR {price}
                        </Text>
                    )}
                    {description && (
                        <Text
                            style={{ marginVertical: 5, fontFamily: "poppins" }}
                            ellipsizeMode="tail"
                            numberOfLines={2}
                        >
                            {description}
                        </Text>
                    )}
                </View>
            </Layout>
        </TouchableOpacity>
    );
}

// Hooks, not UI

function useListAdvertisementItemNavigation(advertisement) {
    const navigation = useNavigation();
    const route = useRoute();
    const { userId } = route.params;
    const utype = route.params?.utype;

    function onPress() {
        !userId && !utype
            ? navigation.navigate(Screen.StudentHomeAdvertisementDetails, {
                advertisement,
            })
            : userId && !utype
                ? navigation.navigate(Screen.StudentProfileAdvertisementDetails, {
                    advertisement,
                    userId,
                })
                : utype === "partneradvertisement"
                    ? navigation.navigate(Screen.PartnerHomeAdvertisementDetails, {
                        advertisement,
                        userId,
                        utype,
                    })
                    : navigation.navigate(Screen.StudentPartnersAdvertisementDetails, {
                        advertisement,
                        userId,
                        utype,
                    });
    }

    return onPress;
}

function useListAdvertisementItem(categoryId, setCategory) {
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
                return setCategory("Could not fetch category");
            }

            const { name } = category;

            setCategory(name);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCategory();
    }, []);
}

const useListAdvertisements = (setAdvertisements) => {
    const route = useRoute();
    const navigation = useNavigation();
    const {
        user: { token: userToken },
    } = useAuth();

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

    const { storeId } = route.params;

    async function readAdvertisements() {
        try {
            const { error, advertisements } =
                await API.Advertisement.getAdvertisements(userToken, storeId);

            if (error) {
                Toast.show(error, Toast.durations.SHORT);
                return navigation.goBack();
            }
            return advertisements;
        } catch (error) {
            console.error(error);
            Toast.show("Could not load ads", Toast.durations.SHORT);
            navigation.goBack();
        }
    }

    const { data } = useQuery({
        queryKey: [Query.StoreProduct(storeId)],
        queryFn: readAdvertisements,
        refetchInterval: 10000,
        enabled,
    });

    useEffect(() => {
        if (!data) {
            return;
        }
        setAdvertisements(data);
    }, [data]);
};

const FilterModal = ({
    showFilterModal,
    setShowFilterModal,
    setMaxPrice,
    setCategoryId,
    advertisements,
    setSortMode,
}) => {
    const route = useRoute();
    const { type } = route.params;
    const isProduct = type === AdvertisementType.Product;

    const {
        user: { token: userToken },
    } = useAuth();

    const maxPriceInit = useMemo(
        () =>
            advertisements.reduce((maxPrice, { price }) => {
                if (price > maxPrice) {
                    return price;
                }

                return maxPrice;
            }, 0),
        [advertisements]
    );

    const [maxPrice, setLocalMaxPrice] = useState(maxPriceInit);
    const [categories, setCategories] = useState([]);
    const [categoryId, setLocalCategoryId] = useState(null);
    const [sortMode, setLocalSortMode] = useState(SortMode.NewestFirst);

    async function readCategories() {
        try {
            const { categories, error } = await API.Category.getCategories(
                userToken
            );

            if (error) {
                Toast.show("Could not fetch categories", Toast.durations.SHORT);
                setShowFilterModal(false);
            }

            return categories;
        } catch (error) {
            console.error(error);
            Toast.show("Could not fetch categories", Toast.durations.SHORT);
            setShowFilterModal(false);
        }
    }

    useEffect(() => {
        readCategories().then((categories) => setCategories(categories));
    }, []);

    const handleApplyFilter = () => {
        if (isProduct) {
            setMaxPrice(maxPrice);
            setCategoryId(categoryId);
        }
        setSortMode(sortMode);
        setShowFilterModal(false);
    };

    const handleClose = () => {
        setShowFilterModal(false);
    };

    const handleClear = () => {
        setLocalCategoryId(null);
        setLocalMaxPrice(maxPriceInit);
        setLocalSortMode(SortMode.NewestFirst);
    };

    return (
        <Modal visible={showFilterModal} transparent={true}>
            <View style={styles.modal}>
                <View style={styles.filterContainer}>
                    {isProduct && (
                        <View>
                            <Text style={{ fontFamily: "poppins" }}>Budget</Text>
                            <MaterialInput
                                type={InputType.MaterialOutlined}
                                value={String(maxPrice)}
                                onChangeText={(maxPrice) =>
                                    setLocalMaxPrice(Number(maxPrice))
                                }
                                numeric
                            />
                        </View>
                    )}
                    {isProduct && (
                        <View style={{ gap: 5 }}>
                            <Text style={{ fontFamily: "poppins" }}>Category</Text>
                            <View
                                style={{
                                    borderWidth: 1,
                                    borderColor: "grey",
                                    borderRadius: 4,
                                }}
                            >
                                <Picker
                                    onValueChange={(categoryId) =>
                                        setLocalCategoryId(categoryId)
                                    }
                                    selectedValue={categoryId}
                                >
                                    <Picker.Item label="All" value={null} />
                                    {categories.map((category) => (
                                        <Picker.Item
                                            key={category._id}
                                            label={category.name}
                                            value={category._id}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    )}
                    <View style={{ gap: 5 }}>
                        <Text>Sort By</Text>
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: "grey",
                                borderRadius: 4,
                            }}
                        >
                            <Picker
                                onValueChange={(sortMode) =>
                                    setLocalSortMode(sortMode)
                                }
                                selectedValue={sortMode}
                            >
                                {Object.values(SortMode).map((sortMode) => {
                                    if (type !== AdvertisementType.Product) {
                                        if (
                                            sortMode !== SortMode.NewestFirst &&
                                            sortMode !== SortMode.OldestFirst
                                        ) {
                                            return;
                                        }
                                    }

                                    return (
                                        <Picker.Item
                                            key={sortMode}
                                            label={sortMode}
                                            value={sortMode}
                                        />
                                    );
                                })}
                            </Picker>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            gap: 5,
                        }}
                    >
                        <Button
                            type={ButtonType.MaterialText}
                            text={"Reset"}
                            onPress={handleClear}
                        />
                        <Button
                            type={ButtonType.MaterialText}
                            text={"Close"}
                            onPress={handleClose}
                        />
                        <Button text={"Apply"} onPress={handleApplyFilter} />
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <Modal visible={showFilterModal} transparent={true}>
            <View style={styles.modal}>
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={handleClose}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    <Text style={styles.filterName}>Price Range</Text>
                    <Text style={styles.filterName}>Category</Text>
                    <Input
                        style={styles.input}
                        placeholder="Enter category"
                        value={category}
                    />

                    <Text style={styles.filterName}>Sort by</Text>

                    <View style={styles.filterChipsContainer}>
                        <TouchableOpacity
                            style={styles.sortChip}
                            onPress={handleApplyFilter}
                        >
                            <Text style={styles.applyButtonText}>
                                Most Recent
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.sortChip}
                            onPress={handleApplyFilter}
                        >
                            <Text style={styles.applyButtonText}>
                                Price: low to high
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.sortChip}
                            onPress={handleApplyFilter}
                        >
                            <Text style={styles.applyButtonText}>
                                Price: high to low
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={handleApplyFilter}
                    >
                        <Text style={styles.applyButtonText}>
                            Apply Filters
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    filterContainer: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: "#fff",
        width: "90%",
        gap: 15,
    },
    modal: {
        paddingHorizontal: 20,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    filterName: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 10,
        fontFamily: "poppins"
    },
    slider: {
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
    },
    picker: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    applyButton: {
        backgroundColor: "#4285F4",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    applyButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: "poppins"
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 10,
    },
    closeButtonText: {
        fontFamily: "poppins",
        fontWeight: "bold",
        color: "#4285F4",
        fontSize: 16,
    },
    filterChipsContainer: {
        flexWrap: "wrap",
        width: 290,
        flexDirection: "row",
        rowGap: 10,
        columnGap: 5,
        marginBottom: 20,
    },
    sortChip: {
        width: 140,
        backgroundColor: "#4285F4",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    sandPCatalogue: {
        marginTop: 20,
        flex: 1,
        flexDirection: "column",
        flexWrap: "nowrap",
        rowGap: 20,
        columnGap: 20,
        paddingHorizontal: 10,
    },
    ProductsCatalogue: {
        flex: 1,
        flexDirection: "column",
        flexWrap: "wrap",
        rowGap: 20,
        columnGap: 20,
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    imageStyle: {
        width: 150,
        height: 150,
        resizeMode: "cover",
        borderRadius: 20,
        borderWidth: 0.5,
    }
});
