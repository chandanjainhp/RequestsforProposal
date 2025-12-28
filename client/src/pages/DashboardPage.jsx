import React from 'react';
import {
  Plus,
  ArrowRight,
  FileText,
  Mail,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Removed hard-coded demo stats; should be populated from backend or via props
  const stats = [];

  // Removed hard-coded recent RFPs; data should come from API/backend
  const recentRFPs = [];

  // Removed hard-coded recent activity; data should come from API/backend
  const recentActivity = [];

  return (
    <div className="min-h-screen bg-[#FFFFE3] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-[640] text-[#4A4A4A] mb-2">Dashboard</h1>
          <p className="text-base text-[#6D8196] font-[460]">Welcome back! Here's what's happening with your procurement.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.length ? stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div key={idx} className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <IconComponent size={24} className={stat.color} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-2xl font-[640] text-[#4A4A4A] mb-1">{stat.value}</h3>
                <p className="text-sm font-[560] text-[#4A4A4A] mb-1">{stat.label}</p>
                <p className="text-xs text-[#6D8196] font-[460]">{stat.change}</p>
              </div>
            );
          }) : (
            <div className="col-span-full bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-6">
              <h3 className="text-lg font-[640] text-[#4A4A4A] mb-2">No statistics available</h3>
              <p className="text-sm text-[#6D8196] font-[460]">No usage data is available yet. Connect your account or create an RFP to populate stats.</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/app/chat" className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-6 hover:shadow-md transition-all hover:border-[#6D8196] group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-50 transition-colors">
                <Plus size={24} className="text-blue-600" strokeWidth={1.5} />
              </div>
              <ArrowRight size={20} className="text-[#6D8196] group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-[640] text-[#4A4A4A] mb-2">Create New RFP</h3>
            <p className="text-sm text-[#6D8196] font-[460]">Start a new RFP using AI-powered chat</p>
          </Link>

          <Link to="/app/editor" className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-6 hover:shadow-md transition-all hover:border-[#6D8196] group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:bg-purple-50 transition-colors">
                <FileText size={24} className="text-purple-600" strokeWidth={1.5} />
              </div>
              <ArrowRight size={20} className="text-[#6D8196] group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-[640] text-[#4A4A4A] mb-2">Manage RFPs</h3>
            <p className="text-sm text-[#6D8196] font-[460]">Edit and manage your existing RFPs</p>
          </Link>

          <Link to="/app/proposals" className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-6 hover:shadow-md transition-all hover:border-[#6D8196] group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:bg-green-50 transition-colors">
                <Mail size={24} className="text-green-600" strokeWidth={1.5} />
              </div>
              <ArrowRight size={20} className="text-[#6D8196] group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-[640] text-[#4A4A4A] mb-2">View Proposals</h3>
            <p className="text-sm text-[#6D8196] font-[460]">Review incoming vendor proposals</p>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent RFPs - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-[640] text-[#4A4A4A]">Recent RFPs</h2>
                <button className="text-sm font-[560] text-[#6D8196] hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentRFPs.length ? recentRFPs.map((rfp) => {
                  const RfpIcon = rfp.icon;
                  return (
                    <div key={rfp.id} className="flex items-center justify-between p-4 bg-white border border-[#CBCBCB] rounded-lg hover:border-[#6D8196] transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <RfpIcon size={20} className="text-blue-600" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-[560] text-[#4A4A4A] mb-1">{rfp.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-[#6D8196]">
                            <span className="flex items-center gap-1">
                              <Mail size={14} strokeWidth={1.5} />
                              {rfp.proposals} proposals
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} strokeWidth={1.5} />
                              {rfp.deadline}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-[560] ${
                          rfp.status === 'Active' ? 'bg-green-100 text-green-700' :
                          rfp.status === 'Review' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {rfp.status}
                        </span>
                        <Eye size={18} className="text-[#6D8196] opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                      </div>
                    </div>
                  );
                }) : (
                  <div className="p-4 bg-white border border-[#CBCBCB] rounded-lg">
                    <p className="text-sm text-[#6D8196]">No RFPs to display.</p>
                  </div>
                )}
              </div>

              <Link to="/app/chat">
                <button className="w-full mt-4 bg-[#6D8196] text-[#FFFFE3] font-[600] py-3 px-6 rounded-[10px] hover:bg-[#5A6B7F] transition-colors">
                  Create New RFP
                </button>
              </Link>
            </div>
          </div>

          {/* Recent Activity - 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-[14px] p-6">
              <h2 className="text-xl font-[640] text-[#4A4A4A] mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                {recentActivity.length ? recentActivity.map((activity, idx) => {
                  const ActivityIcon = activity.icon;
                  return (
                    <div key={idx} className="flex gap-3 pb-4 border-b border-[#CBCBCB] last:border-b-0 last:pb-0">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${activity.iconColor}20` }}
                      >
                        <ActivityIcon size={16} style={{ color: activity.iconColor }} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-[560] text-[#4A4A4A] mb-1">{activity.action}</p>
                        <p className="text-xs text-[#6D8196] mb-1">{activity.rfp}</p>
                        <p className="text-xs text-[#CBCBCB] flex items-center gap-1">
                          <Clock size={12} strokeWidth={1.5} />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="p-4">
                    <p className="text-sm text-[#6D8196]">No recent activity.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
