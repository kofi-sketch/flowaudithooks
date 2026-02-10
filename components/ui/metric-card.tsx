import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
}

export function MetricCard({ title, value, subtitle, icon }: MetricCardProps) {
  return (
    <div className="crm-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-base text-[#a0a0a0] mb-2">{title}</p>
          <p className="text-[32px] font-semibold text-white leading-none">{value}</p>
          {subtitle && (
            <p className="text-sm text-[#6b6b6b] mt-2">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-white opacity-80">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
