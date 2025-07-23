import React from "react";

const Loading = ({ type = "properties" }) => {
  const renderPropertySkeleton = () => (
    <div className="bg-white rounded-xl card-shadow overflow-hidden animate-pulse">
      <div className="h-48 bg-secondary-200"></div>
      <div className="p-6">
        <div className="h-6 bg-secondary-200 rounded mb-3"></div>
        <div className="h-4 bg-secondary-200 rounded w-3/4 mb-4"></div>
        <div className="flex justify-between mb-6">
          <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
          <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
          <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
        </div>
        <div className="h-10 bg-secondary-200 rounded"></div>
      </div>
    </div>
  );

  const renderSliderSkeleton = () => (
    <div className="h-[600px] bg-secondary-200 rounded-2xl animate-pulse flex items-end">
      <div className="p-8 w-full">
        <div className="h-8 bg-secondary-300 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-secondary-300 rounded w-1/3 mb-6"></div>
        <div className="flex justify-between">
          <div className="flex space-x-6">
            <div className="h-5 bg-secondary-300 rounded w-20"></div>
            <div className="h-5 bg-secondary-300 rounded w-20"></div>
            <div className="h-5 bg-secondary-300 rounded w-20"></div>
          </div>
          <div className="h-10 bg-secondary-300 rounded w-32"></div>
        </div>
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="bg-white rounded-xl card-shadow overflow-hidden">
      <div className="p-6 border-b border-secondary-200">
        <div className="h-6 bg-secondary-200 rounded w-1/4 animate-pulse"></div>
      </div>
      <div className="divide-y divide-secondary-200">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-secondary-200 rounded"></div>
                <div>
                  <div className="h-4 bg-secondary-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-secondary-200 rounded w-24"></div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-6 bg-secondary-200 rounded w-20"></div>
                <div className="h-8 bg-secondary-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (type === "slider") {
    return renderSliderSkeleton();
  }

  if (type === "table") {
    return renderTableSkeleton();
  }

  if (type === "calculator") {
    return (
      <div className="bg-white rounded-2xl premium-shadow p-8 animate-pulse">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-secondary-200 rounded-full mr-4"></div>
          <div>
            <div className="h-6 bg-secondary-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-secondary-200 rounded w-32"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, index) => (
            <div key={index}>
              <div className="h-4 bg-secondary-200 rounded w-24 mb-2"></div>
              <div className="h-12 bg-secondary-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="bg-secondary-100 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="h-4 bg-secondary-200 rounded w-24 mx-auto mb-2"></div>
              <div className="h-8 bg-secondary-200 rounded w-32 mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="h-4 bg-secondary-200 rounded w-24 mx-auto mb-2"></div>
              <div className="h-8 bg-secondary-200 rounded w-32 mx-auto"></div>
            </div>
          </div>
        </div>
        <div className="h-12 bg-secondary-200 rounded"></div>
      </div>
    );
  }

  // Default properties grid loading
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <div key={index}>{renderPropertySkeleton()}</div>
      ))}
    </div>
  );
};

export default Loading;