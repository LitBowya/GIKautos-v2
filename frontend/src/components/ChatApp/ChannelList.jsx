import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  useCreateChannelMutation,
  useDeleteChannelMutation,
  useUpdateChannelMutation,
  useJoinChannelMutation,
  useGetChannelsQuery,
  useListChannelMembersQuery,
} from '../../slices/channelSlice';
import Loader from '../Loader/Loader';
import Message from '../Message/Message';

export const ChannelList = ({ onSelectChannel, selectedChannelId }) => {
  const [newChannelName, setNewChannelName] = useState('');
  const [creationError, setCreationError] = useState(null);
  const [editChannelId, setEditChannelId] = useState(null);
  const [editChannelName, setEditChannelName] = useState('');
  const [members, setMembers] = useState([]);

  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?._id;
  const isAdmin = userInfo?.isAdmin;

  const {
    data: channels = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetChannelsQuery();

  const {
    data: channelMembers = [],
    isLoading: loadingMembers,
    isError: memberError,
    error: memberErrorMessage,
  } = useListChannelMembersQuery(selectedChannelId);

  useEffect(() => {
    if (channelMembers) {
      setMembers(channelMembers.members);
    }
  }, [channelMembers]);

  const [
    createChannel,
    { isLoading: loadingCreateChannel, error: errorCreatingChannel },
  ] = useCreateChannelMutation();

  const [
    deleteChannel,
    { isLoading: loadingDeleteChannel, error: errorDeletingChannel },
  ] = useDeleteChannelMutation();

  const [
    updateChannel,
    { isLoading: loadingUpdateChannel, error: errorUpdatingChannel },
  ] = useUpdateChannelMutation();

  const [
    joinChannel,
    { isLoading: loadingJoinChannel, error: errorJoiningChannel },
  ] = useJoinChannelMutation();

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to create channel?')) {
      if (newChannelName.trim()) {
        try {
          await createChannel({ name: newChannelName }).unwrap();
          refetch();
          toast.success('Channel created successfully');
          setNewChannelName('');
          setCreationError(null);
        } catch (error) {
          setCreationError(error.message);
        }
      }
    }
  };

  const handleDeleteChannel = async (channelId) => {
    if (window.confirm('Are you sure you want to delete this channel?')) {
      try {
        await deleteChannel(channelId).unwrap();
        toast.success('Channel deleted successfully');
        refetch();
      } catch (error) {
        console.error('Failed to delete channel', error);
      }
    }
  };

  const handleEditChannel = (channel) => {
    setEditChannelId(channel._id);
    setEditChannelName(channel.name);
  };

  const handleUpdateChannel = async (e) => {
    e.preventDefault();
    if (editChannelName.trim()) {
      try {
        await updateChannel({
          channelId: editChannelId,
          channelData: { name: editChannelName },
        }).unwrap();
        refetch();
        toast.success('Channel updated successfully');
        setEditChannelId(null);
        setEditChannelName('');
      } catch (error) {
        console.error('Failed to update channel', error);
      }
    }
  };

  const handleJoinChannel = async (channelId) => {
    if (window.confirm('Are you sure you want to join this channel?')) {
      try {
        await joinChannel(channelId).unwrap();
        refetch();
        window.location.reload();
        toast.success('Joined channel successfully');
      } catch (error) {
        console.error('Failed to join channel', error);
      }
    }
  };

  const handleSelectChannel = (channelId) => {
    onSelectChannel(channelId);
  };

  return (
    <div>
      <Row className='my-4'>
        <Col>
          <h3>Channels</h3>
          {isAdmin && (
            <Form onSubmit={handleCreateChannel}>
              <Form.Group controlId='channelName'>
                <Form.Label>New Channel Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter new channel name'
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  disabled={loadingCreateChannel}
                />
              </Form.Group>
              <Button
                variant='primary'
                type='submit'
                className='mt-2'
                disabled={loadingCreateChannel}
              >
                {loadingCreateChannel ? 'Creating...' : 'Create Channel'}
              </Button>
              {errorCreatingChannel && (
                <Message variant='danger' className='mt-2'>
                  {errorCreatingChannel.message}
                </Message>
              )}
            </Form>
          )}
          {creationError && (
            <Message variant='danger' className='mt-2'>
              {creationError}
            </Message>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <Message variant='danger'>{error.message}</Message>
          ) : channels && channels.length ? (
            <div>
              {channels.map((channel) => (
                <div
                  key={channel._id}
                  className='d-flex justify-content-between align-items-center mb-2'
                >
                  {editChannelId === channel._id ? (
                    <Form onSubmit={handleUpdateChannel} className='d-flex'>
                      <Form.Control
                        type='text'
                        placeholder='Enter new channel name'
                        value={editChannelName}
                        onChange={(e) => setEditChannelName(e.target.value)}
                        disabled={loadingUpdateChannel}
                      />
                      <Button
                        variant='primary'
                        type='submit'
                        className='ms-2'
                        disabled={loadingUpdateChannel}
                      >
                        {loadingUpdateChannel ? 'Updating...' : 'Update'}
                      </Button>
                      <Button
                        variant='secondary'
                        className='ms-2'
                        onClick={() => setEditChannelId(null)}
                      >
                        Cancel
                      </Button>
                    </Form>
                  ) : (
                    <>
                      <span
                        onClick={() => {
                          handleSelectChannel(channel._id);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {channel.name}
                      </span>
                      {!channel.members.includes(userId) && (
                        <Button
                          variant='success'
                          className='me-2'
                          onClick={() => handleJoinChannel(channel._id)}
                          disabled={loadingJoinChannel}
                        >
                          {loadingJoinChannel ? 'Joining...' : 'Join'}
                        </Button>
                      )}
                      {isAdmin && (
                        <div>
                          <Button
                            variant='warning'
                            className='me-2'
                            onClick={() => handleEditChannel(channel)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant='danger'
                            onClick={() => handleDeleteChannel(channel._id)}
                            disabled={
                              loadingDeleteChannel &&
                              selectedChannelId === channel._id
                            }
                          >
                            {loadingDeleteChannel &&
                            selectedChannelId === channel._id ? (
                              'Deleting...'
                            ) : (
                              <FaTrash />
                            )}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}

              {selectedChannelId &&
                channels
                  .find((channel) => channel._id === selectedChannelId)
                  ?.members.includes(userId) && (
                  <div>
                    <h5>Members:</h5>
                    {loadingMembers ? (
                      <Loader />
                    ) : memberError ? (
                      <Message variant='danger'>{memberErrorMessage}</Message>
                    ) : (
                      <ListGroup>
                        {members &&
                          members.map((member) => (
                            <ListGroup.Item key={member._id}>{member?.username}</ListGroup.Item>
                          ))}
                      </ListGroup>
                    )}
                  </div>
                )}
            </div>
          ) : (
            <Message variant='info'>No channels available</Message>
          )}
        </Col>
      </Row>
      {errorDeletingChannel && (
        <Message variant='danger' className='mt-2'>
          {errorDeletingChannel.message}
        </Message>
      )}
      {errorUpdatingChannel && (
        <Message variant='danger' className='mt-2'>
          {errorUpdatingChannel.message}
        </Message>
      )}
      {errorJoiningChannel && (
        <Message variant='danger' className='mt-2'>
          {errorJoiningChannel.message}
        </Message>
      )}
    </div>
  );
};

export default ChannelList;
