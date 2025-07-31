import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';
import ValidationErrors from './ValidationErrors';

function UserSignUp() {
  const { signUp } = useUserContext();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: ''
  });
  
  // UI state
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    // Basic validation
    const validationErrors = [];
    if (!formData.firstName.trim()) {
      validationErrors.push('First name is required');
    }
    if (!formData.lastName.trim()) {
      validationErrors.push('Last name is required');
    }
    if (!formData.emailAddress.trim()) {
      validationErrors.push('Email address is required');
    }
    if (!formData.password) {
      validationErrors.push('Password is required');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await signUp({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        emailAddress: formData.emailAddress.trim(),
        password: formData.password
      });
      
      navigate('/', { replace: true });
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('unique')) {
        setErrors(['An account with this email address already exists']);
      } else if (error.message.includes('Validation failed')) {
        setErrors(['Please check your information and try again']);
      } else {
        setErrors([error.message]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="form--centered">
      <h2>Sign Up</h2>
      
      <ValidationErrors errors={errors} /> {/* Use the reusable component */}

      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input 
          id="firstName" 
          name="firstName" 
          type="text" 
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter your first name"
        />

        <label htmlFor="lastName">Last Name</label>
        <input 
          id="lastName" 
          name="lastName" 
          type="text" 
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter your last name"
        />

        <label htmlFor="emailAddress">Email Address</label>
        <input 
          id="emailAddress" 
          name="emailAddress" 
          type="email" 
          value={formData.emailAddress}
          onChange={handleChange}
          placeholder="Enter your email address"
        />

        <label htmlFor="password">Password</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />

        <button 
          className="button" 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </button>
        
        <button 
          className="button button-secondary" 
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </form>
      
      <p>
        Already have a user account? <Link to="/signin">Click here to sign in!</Link>
      </p>
    </div>
  );
}

export default UserSignUp;
