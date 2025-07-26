import React from 'react';

const PageHeader = ({ title, subtitle }) => {
    return (
        <div className="bg-amber-50 py-8 mb-8 border-b border-amber-100">
            <div className="container mx-auto px-4 sm:px-6">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
            </div>
        </div>
    );
};

export default PageHeader;