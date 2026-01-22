// src/components/CompanyLogo.jsx
import { useState } from 'react';

const CompanyLogo = ({ companyId, companyName, className = "w-10 h-10" }) => {
  const [logoError, setLogoError] = useState(false);
  
  if (!companyId || logoError) {
    return (
      <div className={`${className} bg-gray-200 rounded-full flex items-center justify-center`}>
        <span className="text-gray-500 text-xs font-medium">
          {companyName ? companyName.charAt(0).toUpperCase() : 'C'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={`/api/v1/company/logo/${companyId}`}
      alt={`${companyName || 'Company'} logo`}
      className={`${className} object-contain`}
      onError={() => setLogoError(true)}
    />
  );
};

export default CompanyLogo;