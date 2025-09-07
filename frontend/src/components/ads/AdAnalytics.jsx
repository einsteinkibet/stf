import React, { useState, useEffect } from 'react';
import { Card, Table, Alert } from 'react-bootstrap';
import { adsAPI } from '../../api/api';
import LoadingSpinner from '../common/LoadingSpinner';

const AdAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await adsAPI.getCampaigns();
      const campaigns = response.data.results || response.data;
      
      // Fetch analytics for each campaign
      const analyticsData = await Promise.all(
        campaigns.map(async (campaign) => {
          try {
            const [impressionsResponse, clicksResponse, statsResponse] = await Promise.all([
              adsAPI.getAdImpressions(campaign.id),
              adsAPI.getAdClicks(campaign.id),
              adsAPI.getAdStats(campaign.id)
            ]);
            
            return {
              ...campaign,
              impressions: impressionsResponse.data.count || 0,
              clicks: clicksResponse.data.count || 0,
              stats: statsResponse.data
            };
          } catch (err) {
            console.error(`Failed to fetch analytics for campaign ${campaign.id}:`, err);
            return {
              ...campaign,
              impressions: 0,
              clicks: 0,
              stats: {}
            };
          }
        })
      );
      
      setAnalytics(analyticsData);
    } catch (err) {
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const calculateCTR = (impressions, clicks) => {
    if (impressions === 0) return '0%';
    return ((clicks / impressions) * 100).toFixed(2) + '%';
  };

  if (loading) return <LoadingSpinner message="Loading ad analytics..." />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h4 className="mb-4">Ad Campaign Analytics</h4>
      
      {analytics.length === 0 ? (
        <Alert variant="info">
          No ad campaigns found. Create a campaign to see analytics.
        </Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Impressions</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                  <th>Spent</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map(campaign => (
                  <tr key={campaign.id}>
                    <td>{campaign.name}</td>
                    <td>{campaign.impressions}</td>
                    <td>{campaign.clicks}</td>
                    <td>{calculateCTR(campaign.impressions, campaign.clicks)}</td>
                    <td>${campaign.stats.spent || 0}</td>
                    <td>
                      <span className={`badge bg-${campaign.is_active ? 'success' : 'secondary'}`}>
                        {campaign.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AdAnalytics;