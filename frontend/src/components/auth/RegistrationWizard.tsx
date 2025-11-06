import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EnhancedRegister from './EnhancedRegister';
import { UserType } from '../../types/registration';

const RegistrationWizard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

  useEffect(() => {
    // Get user type from location state
    const state = location.state as { userType?: UserType };
    if (state?.userType) {
      setSelectedUserType(state.userType);
    } else {
      // Redirect back to user type selection if no type selected
      navigate('/auth/register');
    }
  }, [location.state, navigate]);

  const handleRegistrationSuccess = () => {
    console.log('Registration completed successfully');
    // EnhancedRegister sẽ tự redirect theo role
  };

  const handleBack = () => {
    navigate('/auth/register');
  };

  if (!selectedUserType) {
    return null; // Or loading spinner
  }

  return (
    <div className="relative">
      <EnhancedRegister
        userType={selectedUserType}
        onBack={handleBack}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
};

export default RegistrationWizard;