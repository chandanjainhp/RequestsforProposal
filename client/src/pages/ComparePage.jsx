import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { getComparison, getRfpList } from '../api/compare';
import ScoreChart from '../components/ScoreChart';
import BidSenseStepper from '../components/BidSenseStepper';
import Breadcrumb from '../components/Breadcrumb';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { AlertCircle, ChevronLeft, Trophy } from 'lucide-react';

export default function ComparePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [comparisonData, setComparisonData] = useState(null);
  const [rfpList, setRfpList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComparison = async () => {
      setLoading(true);
      setError(null);
      setComparisonData(null);
      try {
        // Try to get rfpId from URL params first, then from state
        const rfpId = params.rfpId || location.state?.rfpId;
        if (!rfpId) {
          // Fetch list of RFPs to show user
          const data = await getRfpList();
          console.log('RFP List loaded:', data);
          setRfpList(data.rfps || []);
          return;
        }

        console.log('Loading comparison for RFP:', rfpId);
        const data = await getComparison(rfpId);
        console.log('Comparison loaded:', data);
        setComparisonData(data);
        setRfpList([]); // Clear RFP list when we have comparison data
      } catch (err) {
        console.error('Error loading comparison:', err);
        setError(err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Failed to load comparison');
        setComparisonData(null);
      } finally {
        setLoading(false);
      }
    };

    loadComparison();
  }, [params.rfpId, location.state?.rfpId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="space-y-4">
          <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Create RFP', href: '/chat' },
        { label: 'Compare Proposals', href: null }
      ]} />

      {/* Workflow Stepper */}
      <BidSenseStepper currentStep={4} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <SecondaryButton
          onClick={() => {
            const rfpId = params.rfpId || location.state?.rfpId;
            if (rfpId) {
              navigate(`/proposals/${rfpId}`);
            } else {
              navigate('/proposals');
            }
          }}
          className="p-2"
        >
          <ChevronLeft size={24} />
        </SecondaryButton>
        <h1 className="text-3xl font-bold text-gray-900">Proposal Comparison</h1>
      </div>

      {/* Error Alert - Only for actual errors */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-500 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* RFP Selection - Show when no RFP ID in URL */}
      {!loading && !params.rfpId && !location.state?.rfpId && rfpList.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select an RFP to Compare Proposals</h2>
          <div className="space-y-2">
            {rfpList.map((rfp) => (
              <PrimaryButton
                key={rfp._id}
                onClick={() => navigate(`/compare/${rfp._id}`)}
                className="w-full text-left"
                fullWidth
              >
                <div className="flex justify-between items-start w-full">
                  <div>
                    <p className="font-medium">{rfp.title}</p>
                    <p className="text-sm">Budget: ₹{rfp.budget?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <span className="text-xs bg-opacity-20 px-2 py-1 rounded">
                    {rfp.status}
                  </span>
                </div>
              </PrimaryButton>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Data */}
      {comparisonData && (
        <div className="space-y-6">
          {/* Recommendation */}
          {comparisonData.recommendation && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <Trophy className="text-warning mt-1" size={32} />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Recommendation</h2>
                  <p className="text-gray-600">
                    <strong>{comparisonData.recommendation.vendor_name}</strong> - Score:{' '}
                    <strong>{comparisonData.recommendation.final_score?.toFixed(2) || 'N/A'}/100</strong>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {comparisonData.recommendation.reasoning || 'Best overall match for your RFP'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Score Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Score Breakdown</h2>
            <ScoreChart scores={comparisonData.proposals || []} />
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vendor</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Delivery</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Warranty</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Completeness</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonData.proposals?.map((score, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {score.vendor_name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {score.score_breakdown?.price_score?.toFixed(2) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {score.score_breakdown?.delivery_score?.toFixed(2) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {score.score_breakdown?.warranty_score?.toFixed(2) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {score.score_breakdown?.completeness_score?.toFixed(2) || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded-full text-sm">
                          {score.final_score?.toFixed(2) || 'N/A'}/100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Total Proposals</p>
              <p className="text-2xl font-bold text-gray-900">
                {comparisonData.proposals?.length || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Highest Score</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.max(...(comparisonData.proposals?.map((s) => s.final_score || 0) || [0])).toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-2xl font-bold text-blue-500">
                {(
                  (comparisonData.proposals?.reduce((sum, s) => sum + (s.final_score || 0), 0) || 0) /
                  (comparisonData.proposals?.length || 1)
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Data State - When RFP ID provided but no comparison data */}
      {!loading && (params.rfpId || location.state?.rfpId) && !comparisonData && !error && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 font-medium mb-2">No comparison data available</p>
          <p className="text-gray-400 text-sm">
            There are not enough proposals to compare
          </p>
        </div>
      )}

      {/* Empty State - No RFPs available at all */}
      {!loading && !params.rfpId && !location.state?.rfpId && rfpList.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 font-medium mb-2">No RFPs found</p>
          <p className="text-gray-400 text-sm">
            Create an RFP to compare proposals
          </p>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
