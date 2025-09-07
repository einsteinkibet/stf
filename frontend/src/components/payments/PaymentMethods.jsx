import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Modal, Form, Alert } from 'react-bootstrap';
import { paymentsAPI } from '../../api/api';
import LoadingSpinner from '../common/LoadingSpinner';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'card',
    card_number: '',
    expiry_date: '',
    cvv: '',
    cardholder_name: ''
  });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await paymentsAPI.getPaymentMethods();
      setPaymentMethods(response.data.results || response.data);
    } catch (err) {
      console.error('Failed to fetch payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMethod = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');

    try {
      await paymentsAPI.addPaymentMethod(newMethod);
      setShowAddModal(false);
      setNewMethod({
        type: 'card',
        card_number: '',
        expiry_date: '',
        cvv: '',
        cardholder_name: ''
      });
      fetchPaymentMethods(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add payment method');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMethod = async (methodId) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      try {
        await paymentsAPI.removePaymentMethod(methodId);
        fetchPaymentMethods(); // Refresh the list
      } catch (err) {
        console.error('Failed to remove payment method:', err);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading payment methods..." />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Payment Methods</h4>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          Add Payment Method
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h5>No payment methods</h5>
            <p className="text-muted">Add a payment method to make purchases easier</p>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              Add Payment Method
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <ListGroup variant="flush">
          {paymentMethods.map(method => (
            <ListGroup.Item key={method.id} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{method.cardholder_name}</strong>
                <br />
                <span className="text-muted">
                  {method.type === 'card' ? 'Card' : 'Bank Account'} •••• {method.last4}
                </span>
                <br />
                <small>Expires: {method.expiry_date}</small>
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleRemoveMethod(method.id)}
              >
                Remove
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Payment Method</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddMethod}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                type="text"
                value={newMethod.cardholder_name}
                onChange={(e) => setNewMethod({...newMethod, cardholder_name: e.target.value})}
                required
                placeholder="John Doe"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                value={newMethod.card_number}
                onChange={(e) => setNewMethod({...newMethod, card_number: e.target.value})}
                required
                placeholder="1234 5678 9012 3456"
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="text"
                    value={newMethod.expiry_date}
                    onChange={(e) => setNewMethod({...newMethod, expiry_date: e.target.value})}
                    required
                    placeholder="MM/YY"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="text"
                    value={newMethod.cvv}
                    onChange={(e) => setNewMethod({...newMethod, cvv: e.target.value})}
                    required
                    placeholder="123"
                  />
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={adding}>
              {adding ? 'Adding...' : 'Add Payment Method'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentMethods;