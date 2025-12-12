import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import {
  Users,
  Clock,
  Server,
  Activity,
  Search,
  Filter,
  MoreVertical,
  Play,
  Square,
  Trash2,
  Mail,
  TrendingUp,
  Award,
  AlertCircle,
  RefreshCw,
  Download,
  ChevronDown
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, change, changeType = 'neutral' }) {
  const changeColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="p-3 bg-[#21262d] rounded-lg">
            <Icon className="w-5 h-5 text-k8s-blue" />
          </div>
          {change && (
            <span className={`text-xs font-medium ${changeColors[changeType]}`}>
              {changeType === 'up' ? '+' : changeType === 'down' ? '-' : ''}{change}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentRow({ student, onAction }) {
  const [showMenu, setShowMenu] = useState(false);

  const formatLastActive = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getQuotaPercentage = () => {
    return Math.round((student.hoursUsed / 100) * 100);
  };

  const quotaPercentage = getQuotaPercentage();
  const quotaColor = quotaPercentage > 80 ? 'bg-red-500' : quotaPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <tr className="border-b border-[#21262d] hover:bg-[#161b22] transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-k8s-blue to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-white">{student.name}</p>
            <p className="text-xs text-gray-500">{student.email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="px-2 py-1 text-xs font-medium bg-[#21262d] text-gray-300 rounded">
          {student.track}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-[#21262d] rounded-full overflow-hidden">
            <div
              className={`h-full ${quotaColor} rounded-full`}
              style={{ width: `${quotaPercentage}%` }}
            />
          </div>
          <span className="text-sm text-gray-400">{student.hoursUsed}h</span>
        </div>
      </td>
      <td className="py-4 px-4 text-sm text-gray-400">
        {student.clustersCreated}
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <StatusBadge status={student.status} />
          <span className="text-xs text-gray-500">{formatLastActive(student.lastActive)}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-[#21262d] rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-[#21262d] border border-[#30363d] rounded-lg shadow-xl z-20 animate-fade-in overflow-hidden">
                <button
                  onClick={() => {
                    onAction('email', student);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-[#30363d] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Send Message
                </button>
                <button
                  onClick={() => {
                    onAction('reset', student);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-[#30363d] transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Quota
                </button>
                <button
                  onClick={() => {
                    onAction('stopAll', student);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-yellow-500 hover:bg-[#30363d] transition-colors"
                >
                  <Square className="w-4 h-4" />
                  Stop All Clusters
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function AdminDashboard() {
  const { students, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrack, setFilterTrack] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = filterTrack === 'all' || student.track === filterTrack;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesTrack && matchesStatus;
  });

  const handleStudentAction = (action, student) => {
    switch (action) {
      case 'email':
        addToast(`Opening email for ${student.name}...`, 'info');
        break;
      case 'reset':
        addToast(`Quota reset for ${student.name}`, 'success');
        break;
      case 'stopAll':
        addToast(`Stopping all clusters for ${student.name}...`, 'info');
        setTimeout(() => {
          addToast(`All clusters stopped for ${student.name}`, 'success');
        }, 1500);
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action) => {
    addToast(`Performing ${action} on ${filteredStudents.length} students...`, 'info');
    setTimeout(() => {
      addToast(`Bulk ${action} completed`, 'success');
    }, 2000);
  };

  const activeStudents = students.filter(s => s.status === 'active').length;
  const totalHoursUsed = students.reduce((acc, s) => acc + s.hoursUsed, 0);
  const totalClusters = students.reduce((acc, s) => acc + s.clustersCreated, 0);

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Instructor Dashboard</h1>
          <p className="text-gray-400">Manage students and monitor cluster usage</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Download} size="sm">
            Export Report
          </Button>
          <Button variant="secondary" icon={RefreshCw} size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Total Students"
          value={students.length}
          change="2 this week"
          changeType="up"
        />
        <StatCard
          icon={Activity}
          label="Active Now"
          value={activeStudents}
          change={`${Math.round((activeStudents / students.length) * 100)}%`}
          changeType="neutral"
        />
        <StatCard
          icon={Clock}
          label="Total Hours Used"
          value={`${totalHoursUsed.toFixed(0)}h`}
          change="12h today"
          changeType="up"
        />
        <StatCard
          icon={Server}
          label="Clusters Created"
          value={totalClusters}
          change="5 today"
          changeType="up"
        />
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">Students</h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-k8s-blue w-64"
              />
            </div>

            {/* Track Filter */}
            <div className="relative">
              <select
                value={filterTrack}
                onChange={(e) => setFilterTrack(e.target.value)}
                className="appearance-none px-4 py-2 pr-8 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-white focus:outline-none focus:border-k8s-blue"
              >
                <option value="all">All Tracks</option>
                <option value="CKAD">CKAD</option>
                <option value="CKA">CKA</option>
                <option value="CKS">CKS</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none px-4 py-2 pr-8 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-white focus:outline-none focus:border-k8s-blue"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </CardHeader>

        {/* Bulk Actions */}
        <div className="px-6 py-3 border-b border-[#30363d] bg-[#0d1117]/50 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Showing {filteredStudents.length} of {students.length} students
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBulkAction('stop clusters')}
            >
              Stop All Clusters
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBulkAction('send notification')}
            >
              Send Notification
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#30363d] text-left">
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Track
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours Used
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clusters
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <StudentRow
                  key={student.id}
                  student={student}
                  onAction={handleStudentAction}
                />
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No students match your filters</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
