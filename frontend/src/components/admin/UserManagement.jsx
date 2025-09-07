import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form, Modal } from 'react-bootstrap';
import { usersAPI } from '../../api/api';
import LoadingSpinner from '../common/LoadingSpinner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getUsers();
      setUsers(response.data.results || response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await usersAPI.verifyUser(userId);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Failed to verify user:', err);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await usersAPI.banUser(userId);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Failed to ban user:', err);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Loading users..." />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>User Management</h4>
        <Form.Control
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '300px' }}
        />
      </div>

      <Table responsive striped>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Account Type</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <Badge bg="secondary">{user.account_type}</Badge>
              </td>
              <td>
                {user.is_verified ? (
                  <Badge bg="success">Verified</Badge>
                ) : (
                  <Badge bg="warning">Unverified</Badge>
                )}
                {user.is_banned && (
                  <Badge bg="danger" className="ms-1">Banned</Badge>
                )}
              </td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="outline-info"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowModal(true);
                  }}
                >
                  View
                </Button>
                {!user.is_verified && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleVerifyUser(user.id)}
                  >
                    Verify
                  </Button>
                )}
                {!user.is_banned ? (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleBanUser(user.id)}
                  >
                    Ban
                  </Button>
                ) : (
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => handleBanUser(user.id)}
                  >
                    Unban
                  </Button>
                )}
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Account Type:</strong> {selectedUser.account_type}</p>
              <p><strong>Phone:</strong> {selectedUser.phone_number || 'N/A'}</p>
              <p><strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleString()}</p>
              <p><strong>Last Login:</strong> {new Date(selectedUser.last_login).toLocaleString()}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;