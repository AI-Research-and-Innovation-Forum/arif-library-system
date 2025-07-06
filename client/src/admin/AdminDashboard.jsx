import React from 'react';

function AdminDashboard() {
  const stats = [
    { title: 'Total Books', value: '1,234' },
    { title: 'Pending Requests', value: '56' },
    { title: 'Active Loans', value: '789' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card bg-amber-50 text-black dark:bg-slate-800 dark:text-white shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{stat.title}</h2>
              <p className="text-4xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard; 