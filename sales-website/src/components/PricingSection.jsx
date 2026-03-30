import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Zap, Shield, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as apiService from '../apiService';

const PricingSection = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    const loadPlans = async () => {
      try {
        const res = await apiService.fetchSubscriptions();
        if (res.success) {
          setPlans(res.data.map((p, index) => ({
            ...p,
            isPopular: index === 1, // Second plan is popular by default
            icon: p.name.toLowerCase().includes('starter') ? Zap : p.name.toLowerCase().includes('care') || p.name.toLowerCase().includes('pro') ? Shield : Crown
          })));
        }
      } catch (err) {
        console.error("Failed to load plans:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return (
    <div className="py-20 text-center font-bold text-gray-400">Loading dynamic plans...</div>
  );

  return (
    <section id="pricing" className="section-padding" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #F3F4F6' }}>
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
            Select a service tier tailored to your needs. These plans are managed live from our administration dashboard.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: windowWidth > 992 ? 'repeat(3, 1fr)' : 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 32, 
          maxWidth: 1200, 
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
                <div className="flex items-center gap-3 mb-4">
                   <div style={{ p: 8, borderRadius: 12, backgroundColor: plan.isPopular ? '#F5F3FF' : '#F9FAFB', color: plan.isPopular ? '#7C3AED' : '#6B7280' }}>
                      <plan.icon size={22} />
                   </div>
                   <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>{plan.name}</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 42, fontWeight: 800, color: '#1a1a1a' }}>${plan.price}</span>
                  <span style={{ fontSize: 14, color: '#6B7280' }}>/ job {plan.leads > 0 && `(Limited to ${plan.leads} leads)`}</span>
                </div>
              </div>

              <div style={{ flex: 1, marginBottom: 40 }}>
                {(Array.isArray(plan.features) ? plan.features : []).map((feature, i) => (
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
                to={`/become-professional?plan=${encodeURIComponent(plan.name)}`} 
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
          {plans.length === 0 && !loading && (
             <div className="col-span-full text-center p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-bold">
                No active service plans found in the dashboard.
             </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
