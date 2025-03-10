import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  suffix?: string;
}

const formatBillionEuros = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `€${(value / 1_000_000_000).toFixed(2)} M`;
  }
  return `€${Math.round(value)}`;
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, description, suffix = '' }) => {
  return (
    <div className="p-4 border rounded-md shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">
        {value}
        {suffix}
      </p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};