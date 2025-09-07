import React, { useState, useEffect } from 'react';
import { ListGroup, Badge, InputGroup, Form } from 'react-bootstrap';
import { messagesAPI } from '../../api/api';
import LoadingSpinner from '../common/LoadingSpinner';

const ConversationList = ({ onSelectConversation, selectedConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await messagesAPI.getConversations();
      setConversations(response.data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(participant =>
      participant.username.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    conv.listing?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Loading conversations..." />;

  return (
    <div>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <ListGroup variant="flush">
        {filteredConversations.map(conversation => (
          <ListGroup.Item
            key={conversation.id}
            action
            active={conversation.id === selectedConversationId}
            onClick={() => onSelectConversation(conversation)}
            className="d-flex justify-content-between align-items-start"
          >
            <div className="flex-grow-1">
              <div className="fw-bold">
                {conversation.participants.map(p => p.username).join(', ')}
              </div>
              {conversation.listing && (
                <div className="text-muted small">
                  Re: {conversation.listing.title}
                </div>
              )}
              <div className="text-muted small">
                {conversation.last_message?.content || 'No messages yet'}
              </div>
            </div>
            {conversation.unread_count > 0 && (
              <Badge bg="primary" pill>
                {conversation.unread_count}
              </Badge>
            )}
          </ListGroup.Item>
        ))}

        {filteredConversations.length === 0 && (
          <ListGroup.Item className="text-center text-muted">
            No conversations found
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
};

export default ConversationList;