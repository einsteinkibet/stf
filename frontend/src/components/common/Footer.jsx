import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container fluid="xxl">
        <Row>
          <Col md={4}>
            <h5>Marketplace</h5>
            <p>Buy, sell, and find services in your local community.</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/listings" className="text-light">Browse Listings</a></li>
              <li><a href="/service-requests" className="text-light">Find Services</a></li>
              <li><a href="/auth/register" className="text-light">Create Account</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact</h5>
            <p>Email: support@marketplace.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="text-center">
            <p>&copy; 2023 Marketplace. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer