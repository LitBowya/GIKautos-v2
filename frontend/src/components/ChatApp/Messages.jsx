import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Image, Form, Button } from 'react-bootstrap';
import { io } from 'socket.io-client';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { FaEdit, FaTrash, FaReply, FaSmile } from 'react-icons/fa';
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
import moment from 'moment';

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
  const [showReplies, setShowReplies] = useState({});
  const [createMessage, { isLoading: creatingMessage }] =
    useCreateMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [editMessage] = useEditMessageMutation();
  const [replyToMessage] = useReplyToMessageMutation();
  const [reactToMessage] = useReactToMessageMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const currentUserId = userInfo._id;

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.emit('join', channelId);
    socket.on('new message', (newMessage) => {
      if (newMessage.channelId === channelId) {
        refetch();
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
      const socket = io('http://localhost:5000');
      const messageData = {
        channelId,
        content,
        user: { _id: currentUserId },
      };
      await createMessage(messageData);
      setContent('');
      refetch();
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

  useEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  const handleEditMessage = async (messageId, replyId = null) => {
    try {
      await editMessage({
        messageId,
        replyId,
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

  const handleDeleteMessage = async (messageId, replyId = null) => {
    try {
      await deleteMessage({ messageId, replyId }).unwrap();
      toast.success('Deleted successfully');
      refetch();
    } catch (error) {
      console.error('Failed to delete message', error);
    }
  };

  const handleReplyMessage = async (messageId, replyId = null) => {
    try {
      await replyToMessage({
        messageId,
        replyId,
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

  const handleReactMessage = async (messageId, replyId = null, emoji) => {
    try {
      await reactToMessage({
        messageId,
        replyId,
        reactionData: { emoji },
      }).unwrap();
      toast.success('Reacted successfully');
      setMessageToReact(null);
      refetch();
    } catch (error) {
      console.error('Failed to react to message', error);
    }
  };

  const handleSetMessageToEdit = (
    messageId,
    replyId = null,
    currentContent
  ) => {
    setMessageToEdit({ messageId, replyId });
    setEditContent(currentContent);
  };

  const handleSetMessageToReply = (messageId, replyId = null) => {
    setMessageToReply({ messageId, replyId });
  };

  const handleSetMessageToReact = (messageId, replyId = null) => {
    setMessageToReact({ messageId, replyId });
  };

  const toggleReplies = (messageId) => {
    setShowReplies((prevState) => ({
      ...prevState,
      [messageId]: !prevState[messageId],
    }));
  };


  const renderReplies = (replies, parentMessageId, parentReplyId = null) => {
    return replies.map((reply) => (
      <div
        key={reply._id}
        style={{
          marginLeft: '20px',
          padding: '10px',
          borderLeft: '2px solid #ccc',
        }}
      >
        <div
          style={{
            backgroundColor:
              reply.user._id === currentUserId ? '#dcf8c6' : '#e2e3e5',
            padding: '10px',
            borderRadius: '10px',
            maxWidth: '80%',
            alignSelf:
              reply.user._id === currentUserId ? 'flex-end' : 'flex-start',
          }}
        >
          <p>
            <strong>{reply.user.username}</strong>: {reply.content}
          </p>
          {reply.reactions && reply.reactions.length > 0 && (
            <div
              style={{
                marginTop: '5px',
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              {reply.reactions.map((reaction, index) => (
                <span key={index} style={{ marginRight: '5px' }}>
                  {reaction.emoji} ({reaction.user.username})
                </span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {reply.user._id === currentUserId ? (
              <>
                <FaEdit
                  style={{ marginRight: '10px', cursor: 'pointer' }}
                  onClick={() =>
                    handleSetMessageToEdit(
                      parentMessageId,
                      reply._id,
                      reply.content
                    )
                  }
                />
                <FaTrash
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    handleDeleteMessage(parentMessageId, reply._id)
                  }
                />
              </>
            ) : (
              <>
                <FaReply
                  style={{ marginRight: '10px', cursor: 'pointer' }}
                  onClick={() =>
                    handleSetMessageToReply(parentMessageId, reply._id)
                  }
                />
                <FaSmile
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    handleSetMessageToReact(parentMessageId, reply._id)
                  }
                />
              </>
            )}
          </div>
        </div>
        {messageToEdit?.messageId === parentMessageId &&
        messageToEdit?.replyId === reply._id ? (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditMessage(parentMessageId, reply._id);
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
        ) : null}
        {messageToReply?.messageId === parentMessageId &&
          messageToReply?.replyId === reply._id && (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleReplyMessage(parentMessageId, reply._id);
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
        {messageToReact?.messageId === parentMessageId &&
          messageToReact?.replyId === reply._id && (
            <Picker
              data={data}
              onEmojiSelect={(emoji) =>
                handleReactMessage(parentMessageId, reply._id, emoji.native)
              }
            />
          )}
        {reply.replies &&
          reply.replies.length > 0 &&
          showReplies[reply._id] && (
            <div style={{ marginTop: '10px' }}>
              {renderReplies(reply.replies, parentMessageId, reply._id)}
            </div>
          )}
        {reply.replies && reply.replies.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() => toggleReplies(reply._id)}
            >
              {showReplies[reply._id]
                ? 'Hide Replies'
                : `Show ${reply.replies.length} Replies`}
            </span>
          </div>
        )}
      </div>
    ));
  };

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach((message) => {
      const date = moment(message.createdAt).format('YYYY-MM-DD');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages || []);

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
        <style>{`
          #messages-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <h4>Messages for Channel {channelId}</h4>
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <h5>{moment(date).format('MMMM Do, YYYY')}</h5>
            {groupedMessages[date].map((message) => (
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
                <div
                  style={{
                    backgroundColor:
                      message.user._id === currentUserId
                        ? '#dcf8c6'
                        : '#e2e3e5',
                    padding: '10px',
                    borderRadius: '10px',
                    maxWidth: '80%',
                    alignSelf:
                      message.user._id === currentUserId
                        ? 'flex-end'
                        : 'flex-start',
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
                    {messageToEdit?.messageId === message._id &&
                    messageToEdit?.replyId === null ? (
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
                        {message.replyTo && (
                          <div
                            style={{
                              padding: '5px',
                              borderLeft: '3px solid #ccc',
                              marginBottom: '5px',
                            }}
                          >
                            <p>
                              <strong>{message.replyTo.user.username}</strong>:{' '}
                              {message.replyTo.content}
                            </p>
                          </div>
                        )}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          {message.user._id === currentUserId ? (
                            <>
                              <FaEdit
                                style={{
                                  marginRight: '10px',
                                  cursor: 'pointer',
                                }}
                                onClick={() =>
                                  handleSetMessageToEdit(
                                    message._id,
                                    null,
                                    message.content
                                  )
                                }
                              />
                              <FaTrash
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleDeleteMessage(message._id)}
                              />
                            </>
                          ) : (
                            <>
                              <FaReply
                                style={{
                                  marginRight: '10px',
                                  cursor: 'pointer',
                                }}
                                onClick={() =>
                                  handleSetMessageToReply(message._id)
                                }
                              />
                              <FaSmile
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                  handleSetMessageToReact(message._id)
                                }
                              />
                            </>
                          )}
                        </div>
                      </>
                    )}
                    {messageToReply?.messageId === message._id &&
                      messageToReply?.replyId === null && (
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
                    {messageToReact?.messageId === message._id &&
                      messageToReact?.replyId === null && (
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji) =>
                            handleReactMessage(message._id, null, emoji.native)
                          }
                        />
                      )}
                  </div>
                </div>
                {message.replies && message.replies.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    {showReplies[message._id] ? (
                      renderReplies(message.replies, message._id)
                    ) : (
                      <div
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <span
                          style={{ cursor: 'pointer', color: 'blue' }}
                          onClick={() => toggleReplies(message._id)}
                        >
                          Show {message.replies.length} Replies
                        </span>
                      </div>
                    )}
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
                        {reaction.emoji} ({reaction.user.username})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
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
