import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { notificationsAPI } from '../api/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatRelativeTime } from '../utils/formatters';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getNotifications();
      setNotifications(response.data.results || response.data);
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      setError('Failed to mark all notifications as read');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message': return '💬';
      case 'booking': return '📅';
      case 'review': return '⭐';
      case 'promotion': return '📢';
      case 'system': return '⚙️';
      case 'match': return '🔍';
      case 'ad': return '📣';
      default: return '🔔';
    }
  };

  if (loading) return <LoadingSpinner message="Loading notifications..." />;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Notifications</h2>
            {unreadCount > 0 && (
              <Button variant="outline-primary" onClick={handleMarkAllAsRead}>
                Mark All as Read
              </Button>
            )}
          </div>
          <p className="text-muted">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <div className="alert alert-danger">{error}</div>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          {notifications.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-5">
                <h5>No notifications</h5>
                <p className="text-muted">You're all caught up!</p>
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Body className="p-0">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-3 border-bottom ${!notification.is_read ? 'bg-light' : ''}`}
                  >
                    <div className="d-flex align-items-start">
                      <span className="me-3 fs-5">
                        {getNotificationIcon(notification.notification_type)}
                      </span>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{notification.title}</h6>
                        <p className="mb-1">{notification.message}</p>
                        <small className="text-muted">
                          {formatRelativeTime(notification.created_at)}
                        </small>
                      </div>
                      <div>
                        {!notification.is_read && (
                          <Badge bg="primary" pill className="me-2">
                            New
                          </Badge>
                        )}
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={notification.is_read}
                        >
                          Mark Read
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Notifications;