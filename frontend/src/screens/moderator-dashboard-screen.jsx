import React from 'react';

const ModeratorDashboardScreen = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="flex-shrink-0 p-6 text-2xl font-bold">
          Moderator Dashboard
        </div>
        <nav className="flex-1 px-2 py-4">
          <ul>
            <li className="mb-2">
              <a href="#" className="block px-4 py-2 text-gray-300 hover:bg-blue-700 rounded">
                Overview
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block px-4 py-2 text-gray-300 hover:bg-blue-700 rounded">
                Reports
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block px-4 py-2 text-gray-300 hover:bg-blue-700 rounded">
                Moderation Queue
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block px-4 py-2 text-gray-300 hover:bg-blue-700 rounded">
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome to the Moderator Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Recent Reports</h2>
            <p className="text-gray-700">Review and manage recent reports submitted by users.</p>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Moderation Queue</h2>
            <p className="text-gray-700">Check and act on items in the moderation queue.</p>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">User Feedback</h2>
            <p className="text-gray-700">View and manage feedback from users.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModeratorDashboardScreen;
