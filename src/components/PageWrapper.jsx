// components/PageWrapper.jsx
import React from 'react';
import Navbar from './Navbar';

const PageWrapper = ({ children }) => (
  <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e5e7eb' }}>
    <Navbar />
    <main style={{ padding: '2rem 1.5rem', maxWidth: 1400, margin: '0 auto' }}>
      {children}
    </main>
  </div>
);

export default PageWrapper;
