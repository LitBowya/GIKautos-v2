import { apiSlice } from "./apiSlice";
import { MESSAGE_URL } from "../constants";

export const messageSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createMessage: builder.mutation({
            query: (messageData) => ({
                url: `${MESSAGE_URL}/createmessage`,
                method: "POST",
                body: messageData,
            }),
        }),
        getMessagesByChannel: builder.query({
            query: (channelId) => ({
                url: `${MESSAGE_URL}/getmessages/${channelId}`,
                method: "GET",
            }),
        }),
        editMessage: builder.mutation({
            query: ({ messageId, messageData }) => ({
                url: `${MESSAGE_URL}/editmessage/${messageId}`,
                method: "PUT",
                body: messageData,
            }),
        }),
        deleteMessage: builder.mutation({
            query: (messageId) => ({
                url: `${MESSAGE_URL}/deletemessage/${messageId}`,
                method: "DELETE",
            }),
        }),
        pinMessage: builder.mutation({
            query: (messageId) => ({
                url: `${MESSAGE_URL}/${messageId}/pin`,
                method: "POST",
            }),
        }),
        starMessage: builder.mutation({
            query: (messageId) => ({
                url: `${MESSAGE_URL}/${messageId}/star`,
                method: "POST",
            }),
        }),
        searchMessages: builder.query({
            query: (searchQuery) => ({
                url: `${MESSAGE_URL}/search`,
                method: "GET",
                params: {
                    query: searchQuery,
                },
            }),
        }),
        markMessageAsUnread: builder.mutation({
            query: (messageId) => ({
                url: `${MESSAGE_URL}/${messageId}/unread`,
                method: "PUT",
            }),
        }),
        reactToMessage: builder.mutation({
            query: ({ messageId, reactionData }) => ({
                url: `${MESSAGE_URL}/${messageId}/react`,
                method: "POST",
                body: reactionData,
            }),
        }),
        replyToMessage: builder.mutation({
            query: ({ messageId, replyData }) => ({
                url: `${MESSAGE_URL}/${messageId}/reply`,
                method: "POST",
                body: replyData,
            }),
        }),
    }),
});

export const {
    useCreateMessageMutation,
    useGetMessagesByChannelQuery,
    useEditMessageMutation,
    useDeleteMessageMutation,
    usePinMessageMutation,
    useStarMessageMutation,
    useSearchMessagesQuery,
    useMarkMessageAsUnreadMutation,
    useReactToMessageMutation,
    useReplyToMessageMutation,
} = messageSlice;
