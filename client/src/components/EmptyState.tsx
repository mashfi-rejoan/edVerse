import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-6 text-center max-w-sm">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-[#0C2B4E] text-white rounded-lg font-medium hover:bg-[#0a1f37] transition"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
