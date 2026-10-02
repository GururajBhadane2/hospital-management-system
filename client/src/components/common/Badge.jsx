import React from 'react';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variantClass = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    neutral: 'badge-neutral'
  }[variant] || 'badge-primary';

  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  );
};
