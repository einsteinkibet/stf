import React from 'react';
import { useParams } from 'react-router-dom';
import Profile from '../components/auth/Profile';

const ProfilePage = () => {
  const { username } = useParams();
  return <Profile />;
};

export default ProfilePage;