import { apiSlice } from "./apiSlice";
import { CHANNEL_URL } from "../constants";

export const channelSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createChannel: builder.mutation({
            query: (channelData) => ({
                url: `${CHANNEL_URL}/createchannel`,
                method: "POST",
                body: channelData,
            }),
        }),
        getChannels: builder.query({
            query: () => ({
                url: `${CHANNEL_URL}/getchannels`,
                method: "GET",
            }),
        }),
        joinChannel: builder.mutation({
            query: (channelId) => ({
                url: `${CHANNEL_URL}/${channelId}/join`,
                method: "POST",
            }),
        }),
        leaveChannel: builder.mutation({
            query: (channelId) => ({
                url: `${CHANNEL_URL}/${channelId}/leave`,
                method: "POST",
            }),
        }),
        updateChannel: builder.mutation({
            query: ({ channelId, channelData }) => ({
                url: `${CHANNEL_URL}/${channelId}`,
                method: "PUT",
                body: channelData,
            }),
        }),
        deleteChannel: builder.mutation({
            query: (channelId) => ({
                url: `${CHANNEL_URL}/${channelId}`,
                method: "DELETE",
            }),
        }),
        listChannelMembers: builder.query({
            query: (channelId) => ({
                url: `${CHANNEL_URL}/${channelId}/members`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useCreateChannelMutation,
    useGetChannelsQuery,
    useJoinChannelMutation,
    useLeaveChannelMutation,
    useUpdateChannelMutation,
    useDeleteChannelMutation,
    useListChannelMembersQuery,
} = channelSlice;
