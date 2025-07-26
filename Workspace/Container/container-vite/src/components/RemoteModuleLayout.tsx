import React, {Suspense} from 'react';

const RemoteModuleLayout = ({children, title}) => {
    return (
        <div className="container mx-auto px-4 py-8 min-h-[60vh]">
            {title && (
                <h1 className="text-2xl font-serif font-medium text-gray-800 mb-6 border-b border-gray-200 pb-2">{title}</h1>
            )}

            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center py-20">
                        <div
                            className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-amber-700 font-medium">Đang tải...</p>
                    </div>
                }
            >
                {children}
            </Suspense>
        </div>
    );
};

export default RemoteModuleLayout;
