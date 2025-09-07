import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ConversationList from '../components/messaging/ConversationList';
import MessageThread from '../components/messaging/MessageThread';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <Container fluid className="py-4">
      <Row>
        <h2 className="mb-4">Messages</h2>
      </Row>
      <Row style={{ minHeight: '600px' }}>
        <Col md={4}>
          <ConversationList
            onSelectConversation={setSelectedConversation}
            selectedConversationId={selectedConversation?.id}
          />
        </Col>
        <Col md={8}>
          <MessageThread conversation={selectedConversation} />
        </Col>
      </Row>
    </Container>
  );
};

export default Messages;