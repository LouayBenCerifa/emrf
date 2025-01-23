import React from 'react';

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="loader" style={{ border: '8px solid #f3f3f3', borderTop: '8px solid #ff6f00', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite' }}></div>
  </div>
);

export default Loader;
