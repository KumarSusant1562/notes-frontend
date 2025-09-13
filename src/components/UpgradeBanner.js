import React from 'react';
import './UpgradeBanner.css';

function UpgradeBanner({ limitReached, role, onUpgrade }) {
  if (!limitReached) return null;
  return (
    <div className="upgrade-banner">
      Note limit reached. <b>Upgrade to Pro</b> to add more notes.<br />
      {role === 'admin' && <button onClick={onUpgrade} className="upgrade-btn">Upgrade to Pro</button>}
    </div>
  );
}

export default UpgradeBanner;
