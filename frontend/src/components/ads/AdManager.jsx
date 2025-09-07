import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Modal } from 'react-bootstrap';
import { adsAPI } from '../../api/api';
import LoadingSpinner from '../common/LoadingSpinner';

const AdManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    target_type: 'category',
    budget: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await adsAPI.getCampaigns();
      setCampaigns(response.data.results || response.data);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      await adsAPI.createCampaign(newCampaign);
      setShowCreateModal(false);
      setNewCampaign({
        name: '',
        target_type: 'category',
        budget: '',
        start_date: '',
        end_date: ''
      });
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to create campaign:', err);
    }
  };

  if (loading) return <LoadingSpinner message="Loading campaigns..." />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Ad Campaign Manager</h4>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Create Campaign
        </Button>
      </div>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Active Campaigns</h5>
        </Card.Header>
        <Card.Body>
          {campaigns.length === 0 ? (
            <p className="text-muted text-center">No campaigns found</p>
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Target</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(campaign => (
                  <tr key={campaign.id}>
                    <td>{campaign.name}</td>
                    <td>{campaign.target_type}</td>
                    <td>${campaign.budget}</td>
                    <td>
                      <span className={`badge bg-${campaign.is_active ? 'success' : 'secondary'}`}>
                        {campaign.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <Button variant="outline-info" size="sm" className="me-2">
                        View
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Campaign</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateCampaign}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Campaign Name</Form.Label>
              <Form.Control
                type="text"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Target Type</Form.Label>
              <Form.Select
                value={newCampaign.target_type}
                onChange={(e) => setNewCampaign({...newCampaign, target_type: e.target.value})}
              >
                <option value="category">Category</option>
                <option value="location">Location</option>
                <option value="demographic">Demographic</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Budget ($)</Form.Label>
              <Form.Control
                type="number"
                value={newCampaign.budget}
                onChange={(e) => setNewCampaign({...newCampaign, budget: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={newCampaign.start_date}
                onChange={(e) => setNewCampaign({...newCampaign, start_date: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={newCampaign.end_date}
                onChange={(e) => setNewCampaign({...newCampaign, end_date: e.target.value})}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Campaign
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdManager;