import {Row, Col} from 'react-bootstrap'
import { ChannelList } from "../components/ChatApp/ChannelList"

const Chatpage = () => {
  return (
    <div className="p-3">
      <Row>
        <Col lg={3}>
          <ChannelList />
        </Col>
      </Row>
    </div>
  );
}

export default Chatpage
