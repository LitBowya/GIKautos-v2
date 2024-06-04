import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Image, Form, Button, Dropdown } from 'react-bootstrap';
import { io } from 'socket.io-client';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {
  useGetMessagesByChannelQuery,
  useCreateMessageMutation,
  useDeleteMessageMutation,
  useEditMessageMutation,
  useReplyToMessageMutation,
  useReactToMessageMutation,
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

  const [content, setContent] = useState('');
  const [editContent, setEditContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [messageToEdit, setMessageToEdit] = useState(null);
  const [messageToReply, setMessageToReply] = useState(null);
  const [messageToReact, setMessageToReact] = useState(null);

  const [createMessage, { isLoading: creatingMessage }] =
    useCreateMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [editMessage] = useEditMessageMutation();
  const [replyToMessage] = useReplyToMessageMutation();
  const [reactToMessage] = useReactToMessageMutation();

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

  const handleEditMessage = async (messageId) => {
    try {
      await editMessage({
        messageId,
        messageData: { content: editContent },
      }).unwrap();
      toast.success('Edited successfully');
      setMessageToEdit(null);
      setEditContent('');
      refetch();
    } catch (error) {
      console.error('Failed to edit message', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId).unwrap();
      toast.success('Deleted successfully');
      refetch();
    } catch (error) {
      console.error('Failed to delete message', error);
    }
  };

  const handleReplyMessage = async (messageId) => {
    try {
      await replyToMessage({
        messageId,
        replyData: { content: replyContent },
      }).unwrap();
      toast.success('Replied successfully');
      setMessageToReply(null);
      setReplyContent('');
      refetch();
    } catch (error) {
      console.error('Failed to reply to message', error);
    }
  };

  const handleReactMessage = async (messageId, emoji) => {
    try {
      await reactToMessage({
        messageId,
        reactionData: { emoji },
      }).unwrap();
      toast.success('Reacted successfully');
      setMessageToReact(null);
      refetch();
    } catch (error) {
      console.error('Failed to react to message', error);
    }
  };

  const handleSetMessageToEdit = (messageId, currentContent) => {
    setMessageToEdit(messageId);
    setEditContent(currentContent);
  };

  const handleSetMessageToReply = (messageId) => {
    setMessageToReply(messageId);
  };

  const handleSetMessageToReact = (messageId) => {
    setMessageToReact(messageId);
  };

  const renderReplies = (replies) => {
    return replies.map((reply, index) => (
      <div
        key={index}
        style={{
          marginLeft: '20px',
          padding: '10px',
          borderLeft: '2px solid #ccc',
        }}
      >
        <p>
          <strong>{reply.user.username}</strong>: {reply.content}
        </p>
      </div>
    ));
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
                flexDirection: 'column',
                alignItems:
                  message.user._id === currentUserId
                    ? 'flex-end'
                    : 'flex-start',
                marginBottom: '10px',
              }}
            >
              <div>
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
                  {messageToEdit === message._id ? (
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEditMessage(message._id);
                      }}
                    >
                      <Form.Group controlId='editMessageContent'>
                        <Form.Control
                          type='text'
                          className='w-100'
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />
                      </Form.Group>
                      <Button type='submit' className='mt-2'>
                        Save
                      </Button>
                      <Button
                        type='button'
                        variant='secondary'
                        className='mt-2 ml-2'
                        onClick={() => {
                          setMessageToEdit(null);
                          setEditContent('');
                        }}
                      >
                        Cancel
                      </Button>
                    </Form>
                  ) : (
                    <>
                      <p>{message.content}</p>
                      <Dropdown>
                        <Dropdown.Toggle id='dropdown-basic'>
                          ...
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {message.user._id === currentUserId ? (
                            <>
                              <Dropdown.Item
                                onClick={() =>
                                  handleSetMessageToEdit(
                                    message._id,
                                    message.content
                                  )
                                }
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
                                onClick={() =>
                                  handleSetMessageToReply(message._id)
                                }
                              >
                                Reply
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  handleSetMessageToReact(message._id)
                                }
                              >
                                React
                              </Dropdown.Item>
                            </>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </>
                  )}
                  {messageToReply === message._id && (
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReplyMessage(message._id);
                      }}
                    >
                      <Form.Group controlId='replyMessageContent'>
                        <Form.Control
                          type='text'
                          className='w-100'
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                      </Form.Group>
                      <Button type='submit' className='mt-2'>
                        Reply
                      </Button>
                      <Button
                        type='button'
                        variant='secondary'
                        className='mt-2 ml-2'
                        onClick={() => {
                          setMessageToReply(null);
                          setReplyContent('');
                        }}
                      >
                        Cancel
                      </Button>
                    </Form>
                  )}
                  {messageToReact === message._id && (
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji) =>
                        handleReactMessage(message._id, emoji.native)
                      }
                    />
                  )}
                </div>
              </div>
              {message.replies && message.replies.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  {renderReplies(message.replies)}
                </div>
              )}
              {message.reactions && message.reactions.length > 0 && (
                <div
                  style={{
                    marginTop: '5px',
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  {message.reactions.map((reaction, index) => (
                    <span key={index} style={{ marginRight: '5px' }}>
                      {reaction.emoji}
                    </span>
                  ))}
                </div>
              )}
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
