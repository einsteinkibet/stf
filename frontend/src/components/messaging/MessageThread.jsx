import React, { useState, useEffect, useRef } from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { messagesAPI } from '../../api/api';
import MessageComposer from './MessageComposer';
import LoadingSpinner from '../common/LoadingSpinner';

const MessageThread = ({ conversation }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      fetchMessages();
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await messagesAPI.getMessages(conversation.id);
      setMessages(response.data);
      // Mark as read
      await messagesAPI.markAsRead(conversation.id);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewMessage = (newMessage) => {
    setMessages(prev => [...prev, newMessage]);
  };

  if (!conversation) {
    return (
      <Card className="h-100">
        <Card.Body className="d-flex align-items-center justify-content-center">
          <div className="text-center text-muted">
            <h5>Select a conversation</h5>
            <p>Choose a conversation from the list to start messaging</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100 d-flex flex-column">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-0">
            {conversation.participants.map(p => p.username).join(', ')}
          </h6>
          {conversation.listing && (
            <small className="text-muted">
              Re: {conversation.listing.title}
            </small>
          )}
        </div>
        {conversation.unread_count > 0 && (
          <Badge bg="primary" pill>
            {conversation.unread_count} unread
          </Badge>
        )}
      </Card.Header>

      <Card.Body className="flex-grow-1" style={{ overflowY: 'auto', maxHeight: '400px' }}>
        {loading ? (
          <LoadingSpinner message="Loading messages..." />
        ) : (
          <ListGroup variant="flush">
            {messages.map(message => (
              <ListGroup.Item
                key={message.id}
                className={`border-0 px-0 ${message.is_sent ? 'text-end' : ''}`}
              >
                <div
                  className={`d-inline-block p-3 rounded ${
                    message.is_sent
                      ? 'bg-primary text-white'
                      : 'bg-light text-dark'
                  }`}
                  style={{ maxWidth: '70%' }}
                >
                  <div>{message.content}</div>
                  <small className={message.is_sent ? 'text-white-50' : 'text-muted'}>
                    {new Date(message.sent_at).toLocaleTimeString()}
                  </small>
                </div>
              </ListGroup.Item>
            ))}
            <div ref={messagesEndRef} />
          </ListGroup>
        )}
      </Card.Body>

      <Card.Footer>
        <MessageComposer
          conversationId={conversation.id}
          onMessageSent={handleNewMessage}
        />
      </Card.Footer>
    </Card>
  );
};

export default MessageThread;