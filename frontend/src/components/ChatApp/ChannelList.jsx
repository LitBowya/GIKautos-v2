import { useState } from "react";
import { useSelector } from "react-redux";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useGetChannelsQuery,
  useCreateChannelMutation,
  useDeleteChannelMutation,
  useUpdateChannelMutation,
} from "../../slices/channelSlice.js";
import Loader from "../Loader/Loader";
import Message from "../Message/Message";

export const ChannelList = () => {
  const [newChannelName, setNewChannelName] = useState("");
  const [creationError, setCreationError] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [editChannelId, setEditChannelId] = useState(null);
  const [editChannelName, setEditChannelName] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.isAdmin;

  const {
    data: channels,
    isLoading: loadingChannels,
    error: errorChannels,
    refetch,
  } = useGetChannelsQuery();

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

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to create channel?")) {
      if (newChannelName.trim()) {
        try {
          await createChannel({ name: newChannelName }).unwrap();
          toast.success("Channel created successfully");
          refetch();
          setNewChannelName("");
          setCreationError(null);
        } catch (error) {
          setCreationError(error.message);
        }
      }
    }
  };

  const handleDeleteChannel = async (channelId) => {
    if (window.confirm("Are you sure you want to delete this channel?")) {
      try {
        await deleteChannel(channelId).unwrap();
        toast.success("Channel deleted successfully");
        refetch();
        setSelectedChannelId(null);
      } catch (error) {
        console.error("Failed to delete channel", error);
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
        toast.success("Channel updated successfully");
        refetch();
        setEditChannelId(null);
        setEditChannelName("");
      } catch (error) {
        console.error("Failed to update channel", error);
      }
    }
  };

  return (
    <div>
      <Row className="my-4">
        <Col>
          <h3>Channels</h3>
          {isAdmin && (
            <Form onSubmit={handleCreateChannel}>
              <Form.Group controlId="channelName">
                <Form.Label>New Channel Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter new channel name"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  disabled={loadingCreateChannel}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="mt-2"
                disabled={loadingCreateChannel}
              >
                {loadingCreateChannel ? "Creating..." : "Create Channel"}
              </Button>
              {errorCreatingChannel && (
                <Alert variant="danger" className="mt-2">
                  {errorCreatingChannel.message}
                </Alert>
              )}
            </Form>
          )}
          {creationError && (
            <Alert variant="danger" className="mt-2">
              {creationError}
            </Alert>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          {loadingChannels ? (
            <Loader />
          ) : errorChannels ? (
            <Message variant="danger">{errorChannels.message}</Message>
          ) : channels && channels.length ? (
            <div>
              {channels.map((channel) => (
                <div
                  key={channel._id}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  {editChannelId === channel._id ? (
                    <Form onSubmit={handleUpdateChannel} className="d-flex">
                      <Form.Control
                        type="text"
                        placeholder="Enter new channel name"
                        value={editChannelName}
                        onChange={(e) => setEditChannelName(e.target.value)}
                        disabled={loadingUpdateChannel}
                      />
                      <Button
                        variant="primary"
                        type="submit"
                        className="ms-2"
                        disabled={loadingUpdateChannel}
                      >
                        {loadingUpdateChannel ? "Updating..." : "Update"}
                      </Button>
                      <Button
                        variant="secondary"
                        className="ms-2"
                        onClick={() => setEditChannelId(null)}
                      >
                        Cancel
                      </Button>
                    </Form>
                  ) : (
                    <>
                      <span>{channel.name}</span>
                      {isAdmin && (
                        <div>
                          <Button
                            variant="warning"
                            className="me-2"
                            onClick={() => handleEditChannel(channel)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteChannel(channel._id)}
                            disabled={
                              loadingDeleteChannel &&
                              selectedChannelId === channel._id
                            }
                          >
                            {loadingDeleteChannel &&
                            selectedChannelId === channel._id ? (
                              "Deleting..."
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
            </div>
          ) : (
            <Message variant="info">No channels available</Message>
          )}
        </Col>
      </Row>
      {errorDeletingChannel && (
        <Alert variant="danger" className="mt-2">
          {errorDeletingChannel.message}
        </Alert>
      )}
      {errorUpdatingChannel && (
        <Alert variant="danger" className="mt-2">
          {errorUpdatingChannel.message}
        </Alert>
      )}
    </div>
  );
};
