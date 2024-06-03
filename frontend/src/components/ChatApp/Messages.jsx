import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Image, Form, Button, Dropdown } from 'react-bootstrap';
import { io } from 'socket.io-client';
import {
  useGetMessagesByChannelQuery,
  useCreateMessageMutation,
  useDeleteMessageMutation,
} from '../../slices/messageSlice';
import Loader from '../Loader/Loader';
import Message from '../Message/Message';
import { toast } from 'react-toastify';

const Messages = ({ channelId }) => {
  const {
    data: messages,
    isLoading,
    error,
    refetch,
  } = useGetMessagesByChannelQuery(channelId);

  console.log(messages)

  const [content, setContent] = useState('');
  const [createMessage, { isLoading: creatingMessage }] =
    useCreateMessageMutation();
  const [deleteMessage, { isLoading: deletingMessage }] =
    useDeleteMessageMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const currentUserId = userInfo._id;

  useEffect(() => {
    const socket = io('http://localhost:5000'); // Replace with your backend URL

    // Join the channel room
    socket.emit('join', channelId);

    // Listen for new messages
    socket.on('new message', (newMessage) => {
      if (newMessage.channelId === channelId) {
        refetch(); // Refetch messages when a new message is received
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [channelId, refetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const socket = io('http://localhost:5000'); // Define socket here

      const messageData = { channelId, content, user: { _id: currentUserId } };
      await createMessage(messageData);
      setContent(''); // Clear the input field after message is sent
      refetch(); // Refetch messages after sending a new message

      // Emit the new message event to the server
      socket.emit('new message', messageData);
    } catch (error) {
      console.error('Error creating message:', error);
    }
  };

  useEffect(() => {
    if (channelId) {
      refetch();
    }
  }, [channelId, refetch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  const handleEditMessage = (messageId) => {
    // Add logic for editing a message
    console.log('Edit message:', messageId);
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm == "Delete message??") {
      try {
        await deleteMessage(messageId).unwrap()
        toast.success('Deleted successfully')
        refetch()
        console.log('Delete message:', messageId);
      } catch (error) {
        console.error('Failed to delete message', error);
      }
    }
    
  };

  const handleReplyMessage = (messageId) => {
    // Add logic for replying to a message
    console.log('Reply to message:', messageId);
  };

  const handleReactMessage = (messageId) => {
    // Add logic for reacting to a message
    console.log('React to message:', messageId);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant='danger'>{error.message}</Message>;
  }

  return (
    <div style={{ height: 'calc(100vh - 200px)' }}>
      <div
        id='messages-container'
        style={{
          overflowY: 'auto',
          height: '100%',
          padding: '10px',
          scrollbarWidth: 'none',
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
                display: 'flex',
                justifyContent:
                  message.user._id === currentUserId
                    ? 'flex-end'
                    : 'flex-start',
                marginBottom: '10px',
              }}
            >
              {message.user._id !== currentUserId && (
                <div>
                  <div>
                    <h5>{message.user.username}</h5>
                  </div>
                  <Image
                    src={message.user.profilePicture}
                    alt={message.user.username}
                    width={35}
                    height={35}
                    roundedCircle
                    className='mr-3'
                  />
                </div>
              )}
              <div>
                <p>{message.content}</p>
                <Dropdown>
                  <Dropdown.Toggle id='dropdown-basic'>
                    ...
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {message.user._id === currentUserId ? (
                      <>
                        <Dropdown.Item
                          onClick={() => handleEditMessage(message._id)}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleDeleteMessage(message._id)}
                        >
                          Delete
                        </Dropdown.Item>
                      </>
                    ) : (
                      <>
                        <Dropdown.Item
                          onClick={() => handleReplyMessage(message._id)}
                        >
                          Reply
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleReactMessage(message._id)}
                        >
                          React
                        </Dropdown.Item>
                      </>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          ))
        ) : (
          <p>No messages available</p>
        )}
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='messageContent' className='mb-0'>
          <Form.Control
            type='text'
            placeholder='Type your message...'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>
        <Button type='submit' disabled={creatingMessage} className='mt-2'>
          {creatingMessage ? 'Sending...' : 'Send'}
        </Button>
      </Form>
    </div>
  );
};

export default Messages;
