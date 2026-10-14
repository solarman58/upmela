import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiCheckCircle, FiShield, FiAlertTriangle } from 'react-icons/fi';
import { Turnstile } from '@marsidev/react-turnstile';
import './RequestDemoModal.css';

export default function RequestDemoModal({ isOpen, onClose, mode = 'demo' }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trialConfig, setTrialConfig] = useState({ days: 15, buildings: 1, maxNodes: 10 });
  const turnstileRef = useRef(null);

  // Fetch trial config
  useEffect(() => {
    if (isOpen && mode === 'trial') {
      fetch('/api/public/trial-config')
        .then(res => res.json())
        .then(data => setTrialConfig(data))
        .catch(err => console.error('Failed to fetch trial config:', err));
    }
  }, [isOpen, mode]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && step === 1) {
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      setErrors({});
      setTurnstileToken(null);
      if (turnstileRef.current) turnstileRef.current.reset();
    }
  }, [isOpen, step]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.email.trim() || !validateEmail(formData.email)) newErrors.email = 'Valid corporate email is required';
    if (!formData.company.trim()) newErrors.company = 'Company/Venue name is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Captcha Check
    if (!turnstileToken) {
      setErrors({ ...newErrors, api: 'Please complete the security check.' });
      return;
    }

    // Real API Call
    setIsSubmitting(true);
    fetch('/api/public/request-demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, turnstileToken })
    })
    .then(res => res.json())
    .then(data => {
      setIsSubmitting(false);
      if (data.success) {
        setStep(2); // Success step
      } else {
        setErrors({ ...errors, api: data.error || 'Failed to submit request' });
        // Auto dismiss toast after 5 seconds
        setTimeout(() => {
          setErrors(prev => ({ ...prev, api: null }));
        }, 5000);
      }
    })
    .catch(err => {
      setIsSubmitting(false);
      setErrors({ ...errors, api: 'Network error. Please try again later.' });
      setTimeout(() => {
        setErrors(prev => ({ ...prev, api: null }));
      }, 5000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="rd-modal-overlay" onClick={onClose}>
      
      {/* Global Toast Notification - Rendered outside modal to prevent clipping */}
      {errors.api && (
        <div className="rd-api-error-banner" onClick={(e) => e.stopPropagation()}>
          <FiAlertTriangle size={18} /> <span>{errors.api}</span>
          <button onClick={() => setErrors({ ...errors, api: null })} style={{background:'transparent', border:'none', color:'#DC2626', cursor:'pointer', padding:'4px'}}><FiX size={16}/></button>
        </div>
      )}

      <div className={`rd-modal-content ${step === 2 ? 'rd-success' : ''}`} onClick={(e) => e.stopPropagation()}>
        
        <button className="rd-close-btn" onClick={onClose}><FiX /></button>

        {step === 1 ? (
          <div className="rd-modal-grid">
            {/* Left Side: Info */}
            <div className="rd-modal-info">
              <div className="rd-logo-wrap">
                 <img src="/margyaan-icon.png" alt="Margyaan" className="rd-logo" />
                 <div className="lp-logo-title">
                   <span className="lp-mar">MAR</span>
                   <span className="lp-g">G</span>
                   <span className="lp-yaan">YAAN</span>
                 </div>
              </div>
              <h2>See the future of Indoor Navigation.</h2>
              <p>Request a personalized live demo for your venue. Discover how we can map your space without a single app install.</p>
              
              <div className="rd-features">
                <div className="rd-feat"><FiCheckCircle className="rd-icon-green"/> Pilot program available</div>
                <div className="rd-feat"><FiCheckCircle className="rd-icon-green"/> Custom routing insights</div>
                <div className="rd-feat"><FiCheckCircle className="rd-icon-green"/> Technical architecture review</div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="rd-modal-form-wrap">
              {/* Mobile-only Logo */}
              <div className="rd-mobile-logo-wrap">
                 <img src="/margyaan-icon.png" alt="Margyaan" className="rd-logo" />
                 <div className="lp-logo-title">
                   <span className="lp-mar">MAR</span>
                   <span className="lp-g">G</span>
                   <span className="lp-yaan">YAAN</span>
                 </div>
              </div>

              <h3>{mode === 'trial' ? `Start your ${trialConfig.days} days free trial account!` : 'Request a Live Demo'}</h3>
              
              {mode === 'trial' && (
                <div className="rd-trial-limits-banner">
                  <span className="rd-tlb-title">TRIAL INCLUDES:</span>
                  <div className="rd-tlb-items">
                    <span>✅ {trialConfig.days} Days Access</span>
                    <span>✅ {trialConfig.buildings} Building / Floor</span>
                    <span>✅ Max {trialConfig.maxNodes} Locations (POIs)</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="rd-form">
                
                <div className="rd-row">
                  <div className="rd-input-group">
                    <label>Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className={errors.name ? 'rd-error-input' : ''} />
                    {errors.name && <span className="rd-error-text">{errors.name}</span>}
                  </div>

                  <div className="rd-input-group">
                    <label>Work Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@work.com" className={errors.email ? 'rd-error-input' : ''} />
                    {errors.email && <span className="rd-error-text">{errors.email}</span>}
                  </div>
                </div>

                <div className="rd-row">
                  <div className="rd-input-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 9876543210" />
                  </div>
                  <div className="rd-input-group">
                    <label>Venue / Company *</label>
                    <input type="text" name="company" value={formData.company} onChange={handleInputChange} placeholder="Delhi Airport" className={errors.company ? 'rd-error-input' : ''} />
                    {errors.company && <span className="rd-error-text">{errors.company}</span>}
                  </div>
                </div>

                <div className="rd-input-group rd-hide-mobile">
                  <label>How can we help? (Optional)</label>
                  <input type="text" name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us about your space..." />
                </div>

                {/* Cloudflare Turnstile */}
                <div className="rd-captcha-group" style={{ display: 'flex', justifyContent: 'center', background: 'transparent', border: 'none', padding: 0 }}>
                  <Turnstile 
                    ref={turnstileRef}
                    siteKey="0x4AAAAAAD5PE6dpjBYOtq9m" 
                    onSuccess={(token) => setTurnstileToken(token)} 
                    options={{ theme: 'light' }}
                  />
                </div>

                {/* Error Banner moved to top of modal */}

                <button type="submit" className={`rd-submit-btn ${isSubmitting ? 'rd-loading' : ''}`} disabled={isSubmitting}>
                  {isSubmitting ? (mode === 'trial' ? 'Creating Account...' : 'Sending Request...') : (mode === 'trial' ? 'Start Free Trial' : 'Submit Request')}
                </button>

              </form>
            </div>
          </div>
        ) : (
          /* Step 2: Success Message */
          <div className="rd-success-content">
            <div className="rd-success-icon-wrap">
              <FiCheckCircle className="rd-success-icon" />
            </div>
            <h2>{mode === 'trial' ? 'Registration Initiated!' : 'Request Received Successfully!'}</h2>
            <p>Thank you for your interest in Margyaan, <strong>{formData.name}</strong>.</p>
            {mode === 'trial' ? (
              <p>We have received your details for <strong>{formData.company}</strong>. We will contact you at <strong>{formData.email}</strong> shortly to finalise the registration process for your free account.</p>
            ) : (
              <p>Our team has received your demo request for <strong>{formData.company}</strong>. We will contact you at <strong>{formData.email}</strong> shortly to schedule your personalized live demo session.</p>
            )}
            <button className="rd-submit-btn" onClick={() => { setStep(1); onClose(); }}>Back to Home</button>
          </div>
        )}
      </div>
    </div>
  );
}
