import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ScoreChart({ scores = [] }) {
  if (!scores || scores.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg text-gray-500">
        No scores available
      </div>
    );
  }

  const data = scores.map((score) => ({
    name: score.vendor_name || 'Unknown',
    price: score.score_breakdown?.price_score || 0,
    delivery: score.score_breakdown?.delivery_score || 0,
    warranty: score.score_breakdown?.warranty_score || 0,
    completeness: score.score_breakdown?.completeness_score || 0,
    total: score.final_score || 0,
  }));

  return (
    <div className="w-full h-80 bg-white p-4 rounded-lg border border-gray-200">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="price" fill="#3B82F6" />
          <Bar dataKey="delivery" fill="#8B5CF6" />
          <Bar dataKey="warranty" fill="#10B981" />
          <Bar dataKey="completeness" fill="#F59E0B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
