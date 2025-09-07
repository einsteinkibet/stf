import React from 'react';
import { Alert } from 'react-bootstrap';
import ServiceRequestCard from './ServiceRequestCard';

const ServiceRequestList = ({ requests, onView, onApply, onUpdate, canApply = false, canManage = false }) => {
  if (!requests || requests.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        No service requests found.
      </Alert>
    );
  }

  return (
    <div>
      {requests.map(request => (
        <ServiceRequestCard
          key={request.id}
          request={request}
          onView={onView}
          onApply={onApply}
          onUpdate={onUpdate}
          canApply={canApply}
          canManage={canManage}
        />
      ))}
    </div>
  );
};

export default ServiceRequestList;