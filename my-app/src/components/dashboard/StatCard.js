// src/components/dashboard/StatCard.jsx
export default function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex items-center">
      <div className={`p-3 rounded-full mr-4 ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}