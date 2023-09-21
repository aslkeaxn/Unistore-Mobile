import { useNavigation, useRoute } from "@react-navigation/native";
import ScreenContainer from "../../components/ScreenContainer";
import { useEffect, useRef, useState } from "react";
import Toast from "react-native-root-toast";
import API from "../../api";
import { useAuth } from "../../contexts/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Query from "../../constants/query";
import { Button, Layout, Text } from "@ui-kitten/components";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import MessageStatus from "../../constants/message-status";
import Input, { InputType } from "../../components/Input";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";

export default function ScreenStudentConversation() {
    return (
        <ScreenContainer padding={15}>
            <HeaderStudentConversation />
            <ListMessages />
            <FormMessage />
        </ScreenContainer>
    );
}

function HeaderStudentConversation() {
    const route = useRoute();
    const { interlocutorUsername } = route.params;
    const navigation = useNavigation();
    return (
        <Layout style={{ flexDirection: "row", alignItems: "baseline", gap: 10 }}>
            <Feather
                name="chevron-left"
                size={20}
                color="black"
                onPress={() => { navigation.goBack(); }} />
            <Text style={{ fontWeight: "bold", fontSize: 24, marginBottom: 15, fontFamily: "poppins" }}>
                {interlocutorUsername}
            </Text>
        </Layout>);
}

function ListMessages() {
    const route = useRoute();
    const navigation = useNavigation();
    const {
        user: { token: userToken },
    } = useAuth();

    const { interlocutorId, userId } = route.params;

    const [conversation, setConversation] = useState([]);
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

    async function readConversation() {
        try {
            const { conversation, error } = await API.Chat.readConversation(
                userToken,
                interlocutorId
            );

            if (error) {
                Toast.show(error, Toast.durations.SHORT);
                return navigation.goBack();
            }

            return conversation;
        } catch (error) {
            Toast.show("Could not load conversation", Toast.durations.SHORT);
            navigation.goBack();
        }
    }

    const { data } = useQuery({
        queryKey: [Query.Conversation(interlocutorId)],
        queryFn: readConversation,
        refetchInterval: 2000,
        enabled,
    });

    useEffect(() => {
        if (!data) {
            return;
        }

        setConversation(data);
    }, [data]);

    const scrollViewRef = useRef();

    return (
        <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() =>
                scrollViewRef.current.scrollToEnd({ animated: true })
            }
            style={{ marginBottom: 10 }}
            showsVerticalScrollIndicator={false}
        >
            <Layout style={{ gap: 10 }}>
                {conversation.map((message) => (
                    <ListMessagesItem
                        key={message._id}
                        message={message}
                        userId={userId}
                    />
                ))}
            </Layout>
        </ScrollView>
    );
}

function ListMessagesItem({ message, userId }) {
    const { _id: messageId, text, senderId, status, date } = message;

    const lastMessageDate = new Date(date);
    const localeDate = lastMessageDate.toDateString();
    const localeTime = lastMessageDate.toLocaleTimeString().substring(0, 5);

    const {
        user: { token: userToken },
    } = useAuth();

    const queryClient = useQueryClient();

    async function updateStatus() {
        try {
            const { error } = await API.Chat.updateMessageStatus(
                userToken,
                messageId
            );

            if (error) {
                return console.error(error);
            }

            queryClient.invalidateQueries({
                queryKey: [Query.Conversation(senderId)],
            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (senderId === userId) {
            return;
        }

        if (status === MessageStatus.Read) {
            return;
        }

        updateStatus();
    }, []);

    return (
        <Layout
            style={{
                gap: 5,
                padding: 12,
                width: "80%",
                borderRadius: 16,
                backgroundColor:
                    userId !== senderId
                        ? "rgba(243, 243, 243, 1)"
                        : "rgba(97, 79, 224, 1)",
                alignSelf: senderId === userId ? "flex-end" : "flex-start",
            }}
        >
            <Text style={{ color: userId === senderId ? "white" : "black", fontFamily: "poppins" }}>
                {text}
            </Text>
            <View
                style={{
                    alignSelf: "flex-end",
                    fontSize: 12,
                    flexDirection: "row",
                }}
            >
                <Text
                    style={{
                        color:
                            userId !== senderId
                                ? "rgba(87, 87, 88, 1)"
                                : "white",
                        fontSize: 12,
                        fontFamily: "poppins"
                    }}
                >{`${localeDate}, ${localeTime}${userId === senderId ? `, ${status}` : ""
                    }`}</Text>
            </View>
        </Layout>
    );
}

function FormMessage() {
    const [state, setState] = useState({ text: "", loading: false });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={60}
        >
            <Layout
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <FormMessageInputMessage state={state} setState={setState} />
                <FormMessageButtonSendMessage state={state} setState={setState} />
            </Layout>
        </KeyboardAvoidingView>
    );
}

function FormMessageInputMessage({ state, setState }) {
    const placeholder = "Message";
    const { text, loading } = state;

    function onChange(text) {
        setState((state) => ({ ...state, text }));
    }

    return (

        <Input
            type={InputType.MaterialOutlined}
            placeholder={placeholder}
            value={text}
            onChangeText={onChange}
            disabled={loading}
            style={{ flex: 1 }}
            multiline
        />

    );
}

function FormMessageButtonSendMessage({ state, setState }) {
    const route = useRoute();
    const {
        user: { token: userToken },
    } = useAuth();
    const queryClient = useQueryClient();

    const { interlocutorId } = route.params;
    const { text, loading } = state;
    const message = { text };

    async function sendMessage() {
        try {
            setState((state) => ({ ...state, loading: true }));

            const { error } = await API.Chat.sendMessage(
                userToken,
                interlocutorId,
                message
            );

            if (error) {
                return Toast.show(error, Toast.durations.SHORT);
            }

            setState((state) => ({ ...state, text: "" }));

            queryClient.invalidateQueries({
                queryKey: [Query.Conversation(interlocutorId)],
            });
        } catch (error) {
            console.error(error);
            Toast.show(
                "Could not send message, try later",
                Toast.durations.SHORT
            );
        } finally {
            setState((state) => ({ ...state, loading: false }));
        }
    }

    const disabled = loading || text.length === 0;

    return (
        <Ionicons
            name="send"
            onPress={sendMessage}
            disabled={disabled}
            style={{ color: disabled ? "grey" : "rgba(97, 79, 224, 1)" }}
            size={25}
        />
    );
}
