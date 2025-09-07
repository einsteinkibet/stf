import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Card } from 'react-bootstrap';
import { reportsAPI } from '../../api/api';
import LoadingSpinner from '../common/LoadingSpinner';

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportsAPI.getReports();
      setReports(response.data.results || response.data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      await reportsAPI.resolveReport(reportId);
      fetchReports(); // Refresh the list
    } catch (err) {
      console.error('Failed to resolve report:', err);
    }
  };

  const handleDismissReport = async (reportId) => {
    try {
      await reportsAPI.dismissReport(reportId);
      fetchReports(); // Refresh the list
    } catch (err) {
      console.error('Failed to dismiss report:', err);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'investigating': return 'info';
      case 'resolved': return 'success';
      case 'dismissed': return 'secondary';
      default: return 'secondary';
    }
  };

  const getReasonBadge = (reason) => {
    switch (reason) {
      case 'spam': return 'danger';
      case 'inappropriate': return 'warning';
      case 'fraud': return 'danger';
      case 'fake': return 'info';
      default: return 'secondary';
    }
  };

  if (loading) return <LoadingSpinner message="Loading reports..." />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Report Management</h4>
        <div>
          <Button variant="outline-primary" className="me-2">
            Pending ({reports.filter(r => r.status === 'pending').length})
          </Button>
          <Button variant="outline-info">
            Investigating ({reports.filter(r => r.status === 'investigating').length})
          </Button>
        </div>
      </div>

      {reports.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h5>No reports found</h5>
            <p className="text-muted">All reports have been handled</p>
          </Card.Body>
        </Card>
      ) : (
        <Table responsive striped>
          <thead>
            <tr>
              <th>Reporter</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id}>
                <td>{report.reporter.username}</td>
                <td>
                  <Badge bg="secondary">{report.reported_object_type}</Badge>
                </td>
                <td>
                  <Badge bg={getReasonBadge(report.reason)}>
                    {report.reason}
                  </Badge>
                </td>
                <td>
                  <Badge bg={getStatusVariant(report.status)}>
                    {report.status}
                  </Badge>
                </td>
                <td>{new Date(report.created_at).toLocaleDateString()}</td>
                <td>
                  {report.status === 'pending' && (
                    <>
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleResolveReport(report.id)}
                      >
                        Resolve
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleDismissReport(report.id)}
                      >
                        Dismiss
                      </Button>
                    </>
                  )}
                  {report.status === 'investigating' && (
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => handleResolveReport(report.id)}
                    >
                      Mark Resolved
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ReportManagement;