import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { paymentsAPI } from '../../api/api';

const Checkout = ({ amount, currency, onSuccess, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const response = await paymentsAPI.createPaymentIntent({
        amount,
        currency,
        payment_method: paymentMethod,
        card_details: paymentMethod === 'card' ? cardDetails : undefined
      });

      // Confirm payment
      await paymentsAPI.confirmPayment(response.data.id);
      
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <h4 className="text-center mb-4">Payment Checkout</h4>
        <div className="text-center mb-4">
          <h3 className="text-primary">{amount} {currency}</h3>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Payment Method</Form.Label>
            <Form.Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="card">Credit/Debit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="digital_wallet">Digital Wallet</option>
            </Form.Select>
          </Form.Group>

          {paymentMethod === 'card' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Card Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>CVV</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Cardholder Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  required
                />
              </Form.Group>
            </>
          )}

          {paymentMethod === 'bank_transfer' && (
            <Alert variant="info">
              <strong>Bank Transfer Instructions:</strong><br />
              Please transfer the amount to:<br />
              Bank: Example Bank<br />
              Account: 1234567890<br />
              Reference: Your order number
            </Alert>
          )}

          {paymentMethod === 'digital_wallet' && (
            <Alert variant="info">
              <strong>Digital Wallet:</strong><br />
              You will be redirected to your digital wallet provider to complete the payment.
            </Alert>
          )}

          <div className="d-grid gap-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay ${amount} ${currency}`}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Checkout;