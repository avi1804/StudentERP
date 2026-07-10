import React, { useState, useEffect, useRef } from 'react';
import AnimatedInput from './AnimatedInput';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const passwordContainerRef = useRef(null);

  const handleContinue = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (email.trim() !== '') {
        setStep(2);
      }
    } else {
      console.log('Login attempt with:', { email, password });
      // Handle generic login logic here
    }
  };

  useEffect(() => {
    if (step === 2 && passwordContainerRef.current) {
       // Focus the password input smoothly after the transition starts
       setTimeout(() => {
          const input = passwordContainerRef.current.querySelector('input');
          if (input) input.focus();
       }, 50);
    }
  }, [step]);

  return (
    <div className="login-container">
      <h1 className="login-header">Sign In</h1>
      <form onSubmit={handleContinue}>
        <AnimatedInput
          type="email"
          id="email"
          label="Email or Phone Number"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={step === 2}
        />
        
        <div 
          className={`password-container ${step === 2 ? 'expanded' : ''}`}
          ref={passwordContainerRef}
        >
          <div className="password-inner">
            <AnimatedInput
              type="password"
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={step === 2}
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Continue
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
