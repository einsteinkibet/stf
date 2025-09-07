import React from 'react';
import { useParams } from 'react-router-dom';
import ListingDetail from '../components/listings/ListingDetail';

const ListingDetailPage = () => {
  const { id } = useParams();
  return <ListingDetail />;
};

export default ListingDetailPage;