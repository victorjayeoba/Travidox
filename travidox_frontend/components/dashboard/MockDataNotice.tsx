import React from 'react';
import { AlertCircle } from 'lucide-react';

interface MockDataNoticeProps {
  message?: string;
}

export const MockDataNotice: React.FC<MockDataNoticeProps> = ({ 
  message = "Using demo data - backend connection unavailable"
}) => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-amber-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-amber-800">
            Demo Mode Active
          </h3>
          <div className="mt-1 text-sm text-amber-700">
            <p>{message}</p>
            <p className="mt-1">The application is currently using mock data for demonstration purposes.</p>
          </div>
          <div className="mt-2 text-xs text-amber-600">
            <p>To use real data, please ensure your backend is properly configured and online.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockDataNotice; 