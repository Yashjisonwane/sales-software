import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  const plans = [
    {
      id: 'starter',
      name: 'Starter Service Plan',
      price: '99',
      features: [
        'General System Diagnostics',
        'Standard Role Allocation',
        'Basic Documentation',
        'Email Support',
        'Standard Response Time'
      ],
      isPopular: false
    },
    {
      id: 'premium',
      name: 'Premium Care Plan',
      price: '249',
      features: [
        'Full System Inspection',
        'Priority Technical Roles',
        'Enhanced Documentation (Photos/Notes)',
        'Full Digital Invoice Generation',
        '24/7 Priority Support',
        'Emergency Response (2-4 Hours)'
      ],
      isPopular: true
    }
  ];

  return (
    <section className="section-padding" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #F3F4F6' }}>
      <div className="container-max" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60, padding: '0 24px' }}>
          <h2 style={{ 
            fontSize: 'clamp(28px, 4vw, 36px)', 
            fontWeight: 700, 
            color: '#1a1a1a',
            marginBottom: 16
          }}>
            Choose your project <span style={{ color: '#7C3AED' }}>plan</span>
          </h2>
          <p style={{ 
            color: '#6B7280', 
            maxWidth: 600, 
            margin: '0 auto',
            fontSize: 16,
            lineHeight: 1.6
          }}>
            Select a pre-configured service plan created from your dashboard or proceed with a manual setup.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: 32, 
          maxWidth: 1000, 
          margin: '0 auto',
          padding: '0 24px'
        }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{ 
              padding: 40, 
              borderRadius: 24, 
              border: plan.isPopular ? '2px solid #7C3AED' : '1px solid #E5E7EB',
              backgroundColor: '#ffffff',
              transition: 'all 0.3s ease',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: plan.isPopular ? '0 20px 40px rgba(124, 58, 237, 0.1)' : '0 4px 6px rgba(0,0,0,0.02)'
            }} className="hover:shadow-xl group">
              {plan.isPopular && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#7C3AED',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '6px 16px',
                  borderRadius: 20,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Most Popular
                </div>
              )}
              
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 42, fontWeight: 800, color: '#1a1a1a' }}>${plan.price}</span>
                  <span style={{ fontSize: 14, color: '#6B7280' }}>/ job</span>
                </div>
              </div>

              <div style={{ flex: 1, marginBottom: 40 }}>
                {plan.features.map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                    <div style={{ 
                      marginTop: 4, 
                      color: plan.isPopular ? '#7C3AED' : '#10B981',
                      flexShrink: 0
                    }}>
                      <Check size={18} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.4 }}>{feature}</span>
                  </div>
                ))}
              </div>

              <Link 
                to="/job-details" 
                className={plan.isPopular ? "btn-blue" : "btn-black"}
                style={{ 
                  width: '100%', 
                  padding: '16px 0', 
                  borderRadius: 12, 
                  fontSize: 16, 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  textDecoration: 'none'
                }}
              >
                Get Started <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
