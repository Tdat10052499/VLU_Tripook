import React from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleUserTypeSelection from './SimpleUserTypeSelection';
import { UserType } from '../../types/registration';

const SimpleRegisterWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleUserTypeSelect = (userType: UserType) => {
    // Navigate to registration wizard with selected user type
    navigate('/auth/register-wizard', { state: { userType } });
  };

  return <SimpleUserTypeSelection onSelectUserType={handleUserTypeSelect} />;
};

export default SimpleRegisterWrapper;