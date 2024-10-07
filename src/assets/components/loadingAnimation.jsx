import React from 'react';

const LoadingAnimation = ({ isLoading }) => {
    return isLoading ? (
        <div className="flex items-center justify-center">
            <div className="loading loading-infinity loading-lg"></div>
            <span className="text-2xl font-bold text-primary ml-2">Loading...</span>
        </div>
    ) : null;
};

export default LoadingAnimation;
