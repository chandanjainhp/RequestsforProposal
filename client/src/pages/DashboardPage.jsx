import React from 'react';
import {
  Plus,
  ArrowRight,
  FileText,
  Mail,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // TODO: Fetch from backend/API
  const userHasRFPs = false; // Change based on actual data
  const pendingActions = []; // Vendor responses ready, deadlines, etc.
  const recentRFPs = [];

  return (
    <div className="min-h-screen bg-[#FFFFE3] p-6">
      <div className="max-w-7xl mx-auto">
        {/* ===== STEP 1: ORIENTATION LAYER ===== */}
        <div className="mb-12">
          <h1 className="text-4xl font-[640] text-[#4A4A4A] mb-2">Dashboard</h1>
          <p className="text-base text-[#6D8196] font-[460]">Your procurement workspace at a glance</p>
        </div>

        {/* ===== STEP 2: PRIMARY ACTION LAYER ===== */}
        {!userHasRFPs ? (
          <div className="mb-12 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-[16px] p-8 shadow-sm">
            <div className="max-w-2xl">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-[12px] flex items-center justify-center mb-4 shadow-md">
                  <FileText size={32} className="text-white" strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="text-2xl font-[640] text-[#4A4A4A] mb-3">Create your first RFP</h2>
              <p className="text-base text-[#6D8196] font-[460] mb-6">
                Draft an RFP in minutes by answering a few questions. You can edit everything later—nothing is locked in.
              </p>
              <Link to="/app/chat">
                <button className="inline-flex items-center gap-2 bg-blue-600 text-white font-[600] py-3 px-6 rounded-[10px] hover:bg-blue-700 transition-colors shadow-md">
                  <Plus size={20} strokeWidth={2} />
                  Start Creating
                </button>
              </Link>
            </div>
          </div>
        ) : null}

        {/* ===== STEP 3: SECONDARY ACTIONS (Returning Users Only) ===== */}
        {userHasRFPs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Link to="/app/chat" className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-6 hover:shadow-md transition-all hover:border-[#6D8196] group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-50 transition-colors">
                  <Plus size={24} className="text-blue-600" strokeWidth={1.5} />
                </div>
                <ArrowRight size={20} className="text-[#6D8196] group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-[640] text-[#4A4A4A] mb-2">Create New RFP</h3>
              <p className="text-sm text-[#6D8196] font-[460]">Answer a few questions to draft a new RFP</p>
            </Link>

            <Link to="/app/editor" className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-6 hover:shadow-md transition-all hover:border-[#6D8196] group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:bg-purple-50 transition-colors">
                  <FileText size={24} className="text-purple-600" strokeWidth={1.5} />
                </div>
                <ArrowRight size={20} className="text-[#6D8196] group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-[640] text-[#4A4A4A] mb-2">Edit or update your RFPs</h3>
              <p className="text-sm text-[#6D8196] font-[460]">Modify existing RFPs or send to vendors</p>
            </Link>

            <Link to="/app/proposals" className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-6 hover:shadow-md transition-all hover:border-[#6D8196] group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:bg-green-50 transition-colors">
                  <Mail size={24} className="text-green-600" strokeWidth={1.5} />
                </div>
                <ArrowRight size={20} className="text-[#6D8196] group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-[640] text-[#4A4A4A] mb-2">Review vendor responses</h3>
              <p className="text-sm text-[#6D8196] font-[460]">Compare proposals and see what's working</p>
            </Link>

            <Link to="/app/compare" className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-6 hover:shadow-md transition-all hover:border-[#6D8196] group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:bg-orange-50 transition-colors">
                  <ArrowRight size={24} className="text-orange-600" strokeWidth={1.5} />
                </div>
                <ArrowRight size={20} className="text-[#6D8196] group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-[640] text-[#4A4A4A] mb-2">Compare proposals</h3>
              <p className="text-sm text-[#6D8196] font-[460]">Side-by-side analysis to find the best fit</p>
            </Link>
          </div>
        ) : null}

        {/* ===== STEP 4: PROCUREMENT STATUS (Action-Based, Not Statistics) ===== */}
        {!userHasRFPs ? (
          <div className="mb-12 bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-8">
            <h2 className="text-lg font-[640] text-[#4A4A4A] mb-6">Your procurement process</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white border border-[#CBCBCB] rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-[600] text-gray-600">1</span>
                </div>
                <div>
                  <p className="font-[560] text-[#4A4A4A]">RFP created</p>
                  <p className="text-sm text-[#6D8196]">Draft and customize your request for proposal</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white border border-[#CBCBCB] rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-[600] text-gray-600">2</span>
                </div>
                <div>
                  <p className="font-[560] text-[#4A4A4A]">Vendors invited</p>
                  <p className="text-sm text-[#6D8196]">Send RFP to potential vendors and set deadline</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white border border-[#CBCBCB] rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-[600] text-gray-600">3</span>
                </div>
                <div>
                  <p className="font-[560] text-[#4A4A4A]">Proposals received</p>
                  <p className="text-sm text-[#6D8196]">Vendors submit their responses to your RFP</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white border border-[#CBCBCB] rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-[600] text-gray-600">4</span>
                </div>
                <div>
                  <p className="font-[560] text-[#4A4A4A]">Review & decide</p>
                  <p className="text-sm text-[#6D8196]">Compare proposals and select your vendor</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ===== STEP 5: NEEDS YOUR ATTENTION (Decision Cues) ===== */}
        {userHasRFPs ? (
          <div className="mb-12 bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-8">
            <h2 className="text-lg font-[640] text-[#4A4A4A] mb-6">Needs your attention</h2>
            
            {pendingActions.length ? (
              <div className="space-y-4">
                {pendingActions.map((action, idx) => {
                  const IconComponent = action.icon;
                  const isUrgent = action.priority === 'high';
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-4 p-4 rounded-lg border ${
                        isUrgent
                          ? 'bg-red-50 border-red-200'
                          : 'bg-white border-[#CBCBCB]'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isUrgent ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <IconComponent
                          size={20}
                          className={isUrgent ? 'text-red-600' : 'text-blue-600'}
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-[560] text-[#4A4A4A]">{action.title}</p>
                        <p className="text-sm text-[#6D8196]">{action.description}</p>
                      </div>
                      <Link to={action.actionLink} className="flex-shrink-0">
                        <button className="text-sm font-[600] text-blue-600 hover:underline">
                          Review
                        </button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-start gap-4 p-6 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 size={24} className="text-green-600 flex-shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <p className="font-[560] text-green-900 mb-1">No actions needed right now</p>
                  <p className="text-sm text-green-700">
                    Everything is on track. You can relax while waiting for vendor responses.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* ===== STEP 6: RECENT RFPs (For Returning Users) ===== */}
        {userHasRFPs && recentRFPs.length > 0 ? (
          <div className="mb-12">
            <div className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-[640] text-[#4A4A4A]">Your active RFPs</h2>
                <Link to="/app/editor">
                  <button className="text-sm font-[560] text-blue-600 hover:underline">
                    View all
                  </button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentRFPs.map((rfp) => {
                  const RfpIcon = rfp.icon || FileText;
                  return (
                    <Link key={rfp.id} to={`/app/editor/${rfp.id}`} className="block">
                      <div className="flex items-center justify-between p-4 bg-white border border-[#CBCBCB] rounded-lg hover:border-[#6D8196] transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <RfpIcon size={20} className="text-blue-600" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-[560] text-[#4A4A4A] mb-1">{rfp.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-[#6D8196]">
                              <span className="flex items-center gap-1">
                                <Mail size={14} strokeWidth={1.5} />
                                {rfp.proposals} responses
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} strokeWidth={1.5} />
                                {rfp.deadline}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-[560] ${
                          rfp.status === 'Active' ? 'bg-green-100 text-green-700' :
                          rfp.status === 'Review' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {rfp.status}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
