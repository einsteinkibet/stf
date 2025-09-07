import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { paymentsAPI } from '../api/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatPrice, formatDateTime } from '../utils/formatters';

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await paymentsAPI.getTransactions();
      setTransactions(response.data.results || response.data);
    } catch (err) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      case 'refunded': return 'info';
      default: return 'secondary';
    }
  };

  const getPaymentTypeIcon = (type) => {
    switch (type) {
      case 'booking': return '📅';
      case 'subscription': return '📋';
      case 'product': return '🛒';
      case 'listing_promotion': return '📢';
      default: return '💰';
    }
  };

  if (loading) return <LoadingSpinner message="Loading payment history..." />;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Payment History</h2>
          <p className="text-muted">Your transaction history and payments</p>
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
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Transactions</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {transactions.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No transactions found</p>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(transaction => (
                      <tr key={transaction.id}>
                        <td>
                          <span className="me-2">
                            {getPaymentTypeIcon(transaction.payment_type)}
                          </span>
                          {transaction.payment_type}
                        </td>
                        <td>
                          {transaction.listing?.title || 
                           transaction.booking?.listing?.title ||
                           transaction.subscription?.plan?.name ||
                           'Payment'}
                        </td>
                        <td className="fw-bold">
                          {formatPrice(transaction.amount)} {transaction.currency}
                        </td>
                        <td>
                          <Badge bg={getStatusVariant(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </td>
                        <td>{formatDateTime(transaction.created_at)}</td>
                        <td className="text-muted small">{transaction.reference_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payments;