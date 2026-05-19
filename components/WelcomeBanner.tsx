'use client';

import { useEffect, useState } from 'react';

export default function WelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('welcomeBanner')) {
      sessionStorage.removeItem('welcomeBanner');
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      background: '#DCFCE7',
      color: '#166534',
      border: '1px solid #bbf7d0',
      borderRadius: 10,
      padding: '12px 20px',
      fontSize: 14,
      fontWeight: 500,
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
      maxWidth: 'calc(100vw - 40px)',
      textAlign: 'center',
      whiteSpace: 'nowrap',
    }}>
      Welcome to Joe&apos;s MealMap! Check your email to confirm your account.
    </div>
  );
}
