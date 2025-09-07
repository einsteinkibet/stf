import React, { useState } from 'react';
import { Container, Nav, Tab } from 'react-bootstrap';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import ListingManagement from '../components/admin/ListingManagement';
import ReportManagement from '../components/admin/ReportManagement';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';

const Admin = () => {
  const [activeKey, setActiveKey] = useState('dashboard');

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Admin Panel</h2>
      
      <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="users">User Management</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="listings">Listing Management</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="reports">Reports</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="analytics">Analytics</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="dashboard">
            <AdminDashboard />
          </Tab.Pane>
          <Tab.Pane eventKey="users">
            <UserManagement />
          </Tab.Pane>
          <Tab.Pane eventKey="listings">
            <ListingManagement />
          </Tab.Pane>
          <Tab.Pane eventKey="reports">
            <ReportManagement />
          </Tab.Pane>
          <Tab.Pane eventKey="analytics">
            <AnalyticsDashboard />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default Admin;