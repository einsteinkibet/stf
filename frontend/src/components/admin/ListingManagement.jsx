import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form, Modal } from 'react-bootstrap';
import { listingsAPI } from '../../api/api';
import LoadingSpinner from '../common/LoadingSpinner';

const ListingManagement = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await listingsAPI.getListings();
      setListings(response.data.results || response.data);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await listingsAPI.deleteListing(listingId);
        fetchListings(); // Refresh the list
      } catch (err) {
        console.error('Failed to delete listing:', err);
      }
    }
  };

  const handleFeatureListing = async (listingId, feature) => {
    try {
      await listingsAPI.updateListing(listingId, { is_featured: feature });
      fetchListings(); // Refresh the list
    } catch (err) {
      console.error('Failed to update listing:', err);
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Loading listings..." />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Listing Management</h4>
        <Form.Control
          type="text"
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '300px' }}
        />
      </div>

      <Table responsive striped>
        <thead>
          <tr>
            <th>Title</th>
            <th>User</th>
            <th>Type</th>
            <th>Price</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredListings.map(listing => (
            <tr key={listing.id}>
              <td>{listing.title}</td>
              <td>{listing.user.username}</td>
              <td>
                <Badge bg={listing.listing_type === 'product' ? 'info' : 'success'}>
                  {listing.listing_type}
                </Badge>
              </td>
              <td>${listing.price}</td>
              <td>
                {listing.is_active ? (
                  <Badge bg="success">Active</Badge>
                ) : (
                  <Badge bg="secondary">Inactive</Badge>
                )}
                {listing.is_featured && (
                  <Badge bg="warning" className="ms-1">Featured</Badge>
                )}
              </td>
              <td>{new Date(listing.created_at).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="outline-info"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setSelectedListing(listing);
                    setShowModal(true);
                  }}
                >
                  View
                </Button>
                {listing.is_featured ? (
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleFeatureListing(listing.id, false)}
                  >
                    Unfeature
                  </Button>
                ) : (
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleFeatureListing(listing.id, true)}
                  >
                    Feature
                  </Button>
                )}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteListing(listing.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {filteredListings.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                No listings found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Listing Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedListing && (
            <div>
              <h5>{selectedListing.title}</h5>
              <p><strong>Description:</strong> {selectedListing.description}</p>
              <p><strong>User:</strong> {selectedListing.user.username}</p>
              <p><strong>Type:</strong> {selectedListing.listing_type}</p>
              <p><strong>Price:</strong> ${selectedListing.price}</p>
              <p><strong>Category:</strong> {selectedListing.category?.name}</p>
              <p><strong>Location:</strong> {selectedListing.location?.name}</p>
              <p><strong>Created:</strong> {new Date(selectedListing.created_at).toLocaleString()}</p>
              <p><strong>Views:</strong> {selectedListing.views_count}</p>
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

export default ListingManagement;