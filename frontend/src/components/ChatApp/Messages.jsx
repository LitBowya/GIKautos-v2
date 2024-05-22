import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Image, Form, Button } from "react-bootstrap";
import {
  useGetMessagesByChannelQuery,
  useCreateMessageMutation,
} from "../../slices/messageSlice";
import Loader from "../Loader/Loader";
import Message from "../Message/Message";

const Messages = ({ channelId }) => {
  const {
    data: messages,
    isLoading,
    error,
    refetch,
  } = useGetMessagesByChannelQuery(channelId);

  console.log(messages);

  const [content, setContent] = useState("");
  const [createMessage, { isLoading: creatingMessage }] =
    useCreateMessageMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const currentUserId = userInfo._id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await createMessage({ channelId, content });
      setContent(""); // Clear the input field after message is sent
      refetch(); // Refetch messages after sending a new message
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  useEffect(() => {
    if (channelId) {
      refetch();
    }
  }, [channelId, refetch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const messagesContainer = document.getElementById("messages-container");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error.message}</Message>;
  }

  return (
    <div style={{ height: "calc(100vh - 200px)" }}>
      <div
        id="messages-container"
        style={{
          overflowY: "auto",
          height: "100%",
          padding: "10px",
          scrollbarWidth: "none", // Hide the scrollbar for Firefox
          "-ms-overflow-style": "none", // Hide the scrollbar for Internet Explorer and Edge
        }}
      >
        <style>
          {`
      #messages-container::-webkit-scrollbar {
        display: none;
      }
    `}
        </style>
        <h4>Messages for Channel {channelId}</h4>
        {messages && messages.length ? (
          messages.map((message) => (
            <div
              key={message._id}
              style={{
                display: "flex",
                justifyContent:
                  message.user._id === currentUserId
                    ? "flex-end"
                    : "flex-start",
                marginBottom: "10px",
              }}
            >
              {message.user._id !== currentUserId && (
                <div>
                  <Image
                    src={message.user.profilePicture}
                    alt={message.user.username}
                    width={64}
                    height={64}
                    roundedCircle
                    className="mr-3"
                  />
                  <div>
                    <h5>{message.user.username}</h5>
                  </div>
                </div>
              )}
              <div>
                <p>{message.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No messages available</p>
        )}
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="messageContent" className="mb-0">
          <Form.Control
            as="textarea"
            placeholder="Type your message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" disabled={creatingMessage} className="mt-2">
          {creatingMessage ? "Sending..." : "Send"}
        </Button>
      </Form>
    </div>
  );
};

export default Messages;
