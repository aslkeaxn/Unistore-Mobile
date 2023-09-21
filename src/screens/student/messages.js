import React, { useEffect, useState } from "react";
import ScreenContainer from "../../components/ScreenContainer";
import API from "../../api/index";
import { useAuth } from "../../contexts/auth";
import { useQuery } from "@tanstack/react-query";
import Query from "../../constants/query";
import Toast from "react-native-root-toast";
import { Layout, Text } from "@ui-kitten/components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Screen from "../../constants/screen";
import { Badge, Divider } from "react-native-paper";

export default function ScreenStudentMessages() {
    return (
        <ScreenContainer padding={15}>
            <ChatHeader />
            <ListConversations />
        </ScreenContainer>
    );
}

function ChatHeader() {
    return (
        <Text
            style={{ fontWeight: "bold", fontSize: 24, fontFamily: "poppins" }}
        >
            Chats
        </Text>
    );
}

function ListConversations() {
    const [conversations, setConversations] = useState([]);
    const [enabled, setEnabled] = useState(true);

    const navigation = useNavigation();

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

    const {
        user: {
            token: userToken,
            details: { userId, username },
        },
    } = useAuth();

    async function readConversations() {
        try {
            const { conversations, error } = await API.Chat.readConversations(
                userToken
            );

            if (error) {
                Toast.show(error, Toast.durations.SHORT);
            }

            return conversations;
        } catch (error) {
            console.error(error);
            Toast.show("Could not load conversations", Toast.durations.SHORT);
        }
    }

    const { data } = useQuery({
        queryKey: [Query.Conversations(userId)],
        queryFn: readConversations,
        refetchInterval: 2000,
        enabled,
    });

    useEffect(() => {
        if (!data) {
            return;
        }

        setConversations(data);
    }, [data]);

    const conversationCount = conversations.length;

    if (conversationCount === 0) {
        return (
            <Text style={{ marginTop: 15, fontFamily: "poppins" }}>
                No chats started yet
            </Text>
        );
    }

    return (
        <Layout style={{ gap: 20, marginTop: 15 }}>
            {conversations
                .sort(
                    (conversationA, conversationB) =>
                        conversationB.unreadMessagesCount -
                        conversationA.unreadMessagesCount
                )
                .map((conversation, i) => (
                    <React.Fragment key={conversation.interlocutorId}>
                        <ListConversationsItem
                            conversation={conversation}
                            userId={userId}
                            username={username}
                        />
                        {i < conversationCount - 1 && <Divider />}
                    </React.Fragment>
                ))}
        </Layout>
    );
}

function ListConversationsItem({ conversation, userId, username }) {
    const {
        interlocutorUsername,
        unreadMessagesCount,
        lastMessage: { text, date, senderId, receiverId },
    } = conversation;

    const lastMessageDate = new Date(date);
    const localeDate = lastMessageDate.toDateString();
    const localeTime = lastMessageDate.toLocaleTimeString().substring(0, 5);

    const senderUsername =
        userId === senderId ? username : interlocutorUsername;
    const interlocutorId = userId === senderId ? receiverId : senderId;

    const navigation = useNavigation();

    const route = useRoute();
    const partner = route.params?.partner;

    function onPress() {
        navigation.navigate(
            partner ? Screen.PartnerConversation : Screen.StudentConversation,
            {
                interlocutorUsername,
                interlocutorId,
                userId,
            }
        );
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <Layout
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <View style={{ width: "70%" }}>
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 18,
                            fontFamily: "poppins",
                        }}
                    >
                        {`${interlocutorUsername}`}
                    </Text>
                    <Text
                        style={{
                            fontWeight:
                                unreadMessagesCount != 0 ? "normal" : "600",
                            color: "rgba(62, 62, 64, 1)",
                            fontFamily: "poppins",
                        }}
                    >{`${senderUsername}: ${text}`}</Text>
                </View>
                <View
                    style={{
                        gap: 5,
                        width: "20%",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            color: "rgba(87, 87, 88, 1)",
                            fontFamily: "poppins",
                        }}
                    >
                        {`${localeDate}, ${localeTime}`}
                    </Text>
                    {unreadMessagesCount > 0 && (
                        <Badge style={{ alignSelf: "center" }}>
                            {unreadMessagesCount}
                        </Badge>
                    )}
                </View>
            </Layout>
        </TouchableOpacity>
    );
}
