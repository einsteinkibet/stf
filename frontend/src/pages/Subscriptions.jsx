import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { subscriptionsAPI } from '../api/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatPrice } from '../utils/formatters';

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansResponse, subscriptionsResponse] = await Promise.all([
        subscriptionsAPI.getPlans(),
        subscriptionsAPI.getUserSubscriptions()
      ]);
      
      setPlans(plansResponse.data.results || plansResponse.data);
      setUserSubscriptions(subscriptionsResponse.data.results || subscriptionsResponse.data);
    } catch (err) {
      setError('Failed to fetch subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      await subscriptionsAPI.subscribe(planId);
      fetchData(); // Refresh data
    } catch (err) {
      setError('Failed to subscribe to plan');
    }
  };

  const handleCancel = async (subscriptionId) => {
    try {
      await subscriptionsAPI.cancelSubscription(subscriptionId);
      fetchData(); // Refresh data
    } catch (err) {
      setError('Failed to cancel subscription');
    }
  };

  if (loading) return <LoadingSpinner message="Loading subscriptions..." />;

  const activeSubscription = userSubscriptions.find(sub => sub.is_active);

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Subscription Plans</h2>
          <p className="text-muted">Choose a plan that fits your needs</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {activeSubscription && (
        <Row className="mb-4">
          <Col>
            <Card className="bg-success bg-opacity-10">
              <Card.Body>
                <h5>Current Active Subscription</h5>
                <p>
                  <strong>{activeSubscription.plan.name}</strong> - 
                  {formatPrice(activeSubscription.plan.price)}/
                  {activeSubscription.plan.duration}
                </p>
                <p>
                  Valid until: {new Date(activeSubscription.end_date).toLocaleDateString()}
                </p>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleCancel(activeSubscription.id)}
                >
                  Cancel Subscription
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        {plans.map(plan => (
          <Col key={plan.id} md={4} className="mb-4">
            <Card className={`h-100 ${plan.is_popular ? 'border-primary' : ''}`}>
              {plan.is_popular && (
                <Card.Header className="bg-primary text-white text-center">
                  <strong>Most Popular</strong>
                </Card.Header>
              )}
              <Card.Body className="d-flex flex-column">
                <div className="text-center mb-4">
                  <h4>{plan.name}</h4>
                  <h2 className="text-primary">
                    {formatPrice(plan.price)}
                  </h2>
                  <small className="text-muted">per {plan.duration}</small>
                </div>

                <div className="mb-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <span className="text-success me-2">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <Button
                    variant={plan.is_popular ? 'primary' : 'outline-primary'}
                    className="w-100"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={activeSubscription?.plan?.id === plan.id}
                  >
                    {activeSubscription?.plan?.id === plan.id ? 'Current Plan' : 'Subscribe'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Subscriptions;