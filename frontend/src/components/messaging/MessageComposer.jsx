import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { messagesAPI } from '../../api/api';

const MessageComposer = ({ conversationId, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      const response = await messagesAPI.sendMessage(conversationId, {
        content: message.trim()
      });
      onMessageSent(response.data);
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={sending}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!message.trim() || sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessageComposer;