
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4" role="alert">
      <p className="font-bold">오류 발생</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorDisplay;
