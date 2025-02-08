import React from 'react';
import ChatBot from '../components/ChatBot';

const Assistant: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Astra AI Assistant</h1>
      <ChatBot />
    </div>
  );
};

export default Assistant; 