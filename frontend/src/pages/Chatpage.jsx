import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useGetChannelsQuery } from "../slices/channelSlice";
import { ChannelList } from "../components/ChatApp/ChannelList";
import Messages from "../components/ChatApp/Messages"
import Loader from "../components/Loader/Loader";
import Message from "../components/Message/Message";


const Chatpage = () => {
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const { data: channels, isLoading, error } = useGetChannelsQuery();

  useEffect(() => {
    if (channels && channels.length) {
      const announcementChannel = channels.find(
        (channel) => channel.name.toLowerCase() === "announcements"
      );
      if (announcementChannel) {
        setSelectedChannelId(announcementChannel._id);
      } else {
        setSelectedChannelId(channels[0]._id); // Fallback to the first channel if no "announcement" channel
      }
    }
  }, [channels]);

  const handleSelectChannel = (channelId) => {
    setSelectedChannelId(channelId);
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.message}</Message>;

  return (
    <div className="p-3">
      <Row>
        <Col lg={2}>
          <ChannelList
            channels={channels}
            onSelectChannel={handleSelectChannel}
            selectedChannelId={selectedChannelId}
          />
        </Col>
        <Col lg={10}>
          {selectedChannelId ? (
            <Messages channelId={selectedChannelId} />
          ) : (
            <p>Select a channel to view messages</p>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Chatpage;
