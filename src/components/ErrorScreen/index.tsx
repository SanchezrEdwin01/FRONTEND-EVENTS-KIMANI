import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import Layout from '@/components/Layout';
const ErrorScreen = ({
  title = 'Oops! Something went wrong',
  message = 'We encountered an unexpected error. Please try again later.',
  showHomeButton = true
}) => {
  const navigate = useNavigate();

  return (
    <Layout hideFooter={true}>
      <div className="min-h-screen z-0 flex items-center justify-center bg-[#1a1a1a] px-4 -mt-[100px]">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-400 mb-8 max-w-md">{message}</p>
          {showHomeButton && (
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
            >
              Return Home
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

ErrorScreen.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  showHomeButton: PropTypes.bool
};

ErrorScreen.defaultProps = {
  title: 'Oops! Something went wrong',
  message: 'We encountered an unexpected error. Please try again later.',
  showHomeButton: true
};

export default ErrorScreen;
