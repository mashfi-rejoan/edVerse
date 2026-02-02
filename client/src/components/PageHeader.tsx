import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  };
  breadcrumb?: string[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon, action, breadcrumb }) => {
  const getActionColor = (variant?: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg',
      secondary: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400',
      danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg'
    };
    return colors[variant || 'primary'] || colors.primary;
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-2xl px-8 py-8 text-white shadow-xl border border-white/10">
      {/* Title Section */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          {icon && (
            <div className="flex-shrink-0 w-14 h-14 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center text-white shadow-lg border border-white/20">
              {icon}
            </div>
          )}
          <div className="pt-1">
            <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
            {subtitle && (
              <p className="text-blue-100 text-base font-medium">{subtitle}</p>
            )}
          </div>
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${getActionColor(
              action.variant
            )}`}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
