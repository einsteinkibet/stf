import React, { useState, useEffect } from 'react';
import { Table, Badge, Card } from 'react-bootstrap';
import { paymentsAPI } from '../../api/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatPrice, formatDateTime } from '../../utils/formatters';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await paymentsAPI.getTransactions();
      setPayments(response.data.results || response.data);
    } catch (err) {
      console.error('Failed to fetch payment history:', err);
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
    <Card>
      <Card.Header>
        <h5 className="mb-0">Payment History</h5>
      </Card.Header>
      <Card.Body>
        {payments.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No payment history found</p>
          </div>
        ) : (
          <Table responsive>
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
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td>
                    <span className="me-2">
                      {getPaymentTypeIcon(payment.payment_type)}
                    </span>
                    {payment.payment_type}
                  </td>
                  <td>
                    {payment.listing?.title || 
                     payment.booking?.listing?.title ||
                     payment.subscription?.plan?.name ||
                     'Payment'}
                  </td>
                  <td className="fw-bold">
                    {formatPrice(payment.amount)} {payment.currency}
                  </td>
                  <td>
                    <Badge bg={getStatusVariant(payment.status)}>
                      {payment.status}
                    </Badge>
                  </td>
                  <td>{formatDateTime(payment.created_at)}</td>
                  <td className="text-muted small">{payment.reference_id}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default PaymentHistory;