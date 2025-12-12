import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import {
  Server,
  Search,
  Square,
  Trash2,
  RefreshCw,
  AlertCircle,
  Clock,
  Cpu,
  User,
  ChevronDown,
  Play,
  MoreVertical
} from 'lucide-react';

function ClusterRow({ cluster, onAction }) {
  const [showMenu, setShowMenu] = useState(false);
  const isRunning = cluster.status === 'running';

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const getTimeRemaining = () => {
    if (!cluster.expiresAt || cluster.status !== 'running') return '-';
    const diff = new Date(cluster.expiresAt) - new Date();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <tr className="border-b border-[#21262d] hover:bg-[#161b22] transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isRunning ? 'bg-green-900/30' : 'bg-gray-800'}`}>
            <Server className={`w-4 h-4 ${isRunning ? 'text-green-400' : 'text-gray-500'}`} />
          </div>
          <div>
            <p className="font-medium text-white">{cluster.name}</p>
            <p className="text-xs text-gray-500">{cluster.kubeVersion}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <StatusBadge status={cluster.status} />
      </td>
      <td className="py-4 px-4">
        <span className="px-2 py-1 text-xs font-medium bg-[#21262d] text-gray-300 rounded">
          {cluster.track}
        </span>
      </td>
      <td className="py-4 px-4 text-sm text-gray-400">
        {cluster.nodeCount} node{cluster.nodeCount > 1 ? 's' : ''}
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <User className="w-4 h-4" />
          <span>Alex Chen</span>
        </div>
      </td>
      <td className="py-4 px-4 text-sm text-gray-400">
        {formatTime(cluster.createdAt)}
      </td>
      <td className="py-4 px-4">
        {isRunning ? (
          <span className="text-sm text-yellow-500">{getTimeRemaining()}</span>
        ) : (
          <span className="text-sm text-gray-500">-</span>
        )}
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
              <div className="absolute right-0 top-full mt-1 w-40 bg-[#21262d] border border-[#30363d] rounded-lg shadow-xl z-20 animate-fade-in overflow-hidden">
                {isRunning ? (
                  <button
                    onClick={() => {
                      onAction('stop', cluster);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-yellow-500 hover:bg-[#30363d] transition-colors"
                  >
                    <Square className="w-4 h-4" />
                    Stop Cluster
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onAction('start', cluster);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-500 hover:bg-[#30363d] transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Start Cluster
                  </button>
                )}
                <button
                  onClick={() => {
                    onAction('delete', cluster);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-[#30363d] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Cluster
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function AdminClusters() {
  const { clusters, updateClusterStatus, deleteCluster, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTrack, setFilterTrack] = useState('all');

  const allClusters = [...clusters]; // In a real app, this would be all clusters from all users

  const filteredClusters = allClusters.filter(cluster => {
    const matchesSearch = cluster.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cluster.status === filterStatus;
    const matchesTrack = filterTrack === 'all' || cluster.track === filterTrack;
    return matchesSearch && matchesStatus && matchesTrack;
  });

  const handleClusterAction = async (action, cluster) => {
    switch (action) {
      case 'start':
        addToast(`Starting ${cluster.name}...`, 'info');
        await new Promise(resolve => setTimeout(resolve, 1500));
        updateClusterStatus(cluster.id, 'running');
        addToast(`${cluster.name} started`, 'success');
        break;
      case 'stop':
        addToast(`Stopping ${cluster.name}...`, 'info');
        await new Promise(resolve => setTimeout(resolve, 1500));
        updateClusterStatus(cluster.id, 'stopped');
        addToast(`${cluster.name} stopped`, 'success');
        break;
      case 'delete':
        addToast(`Deleting ${cluster.name}...`, 'info');
        await new Promise(resolve => setTimeout(resolve, 1000));
        deleteCluster(cluster.id);
        addToast(`${cluster.name} deleted`, 'success');
        break;
      default:
        break;
    }
  };

  const handleBulkStop = async () => {
    const runningClusters = filteredClusters.filter(c => c.status === 'running');
    if (runningClusters.length === 0) {
      addToast('No running clusters to stop', 'info');
      return;
    }

    addToast(`Stopping ${runningClusters.length} clusters...`, 'info');
    await new Promise(resolve => setTimeout(resolve, 2000));

    runningClusters.forEach(cluster => {
      updateClusterStatus(cluster.id, 'stopped');
    });

    addToast(`${runningClusters.length} clusters stopped`, 'success');
  };

  const runningCount = allClusters.filter(c => c.status === 'running').length;
  const stoppedCount = allClusters.filter(c => c.status === 'stopped').length;

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Cluster Management</h1>
          <p className="text-gray-400">Monitor and manage all student clusters</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={RefreshCw} size="sm">
            Refresh
          </Button>
          <Button variant="danger" icon={Square} size="sm" onClick={handleBulkStop}>
            Stop All Running
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="p-3 bg-[#21262d] rounded-lg">
              <Server className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{allClusters.length}</p>
              <p className="text-sm text-gray-500">Total Clusters</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="p-3 bg-green-900/30 rounded-lg">
              <Server className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{runningCount}</p>
              <p className="text-sm text-gray-500">Running</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="p-3 bg-gray-800 rounded-lg">
              <Server className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stoppedCount}</p>
              <p className="text-sm text-gray-500">Stopped</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clusters Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">All Clusters</h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search clusters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-k8s-blue w-56"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none px-4 py-2 pr-8 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-white focus:outline-none focus:border-k8s-blue"
              >
                <option value="all">All Status</option>
                <option value="running">Running</option>
                <option value="stopped">Stopped</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
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
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#30363d] text-left">
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cluster
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Track
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Left
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClusters.map(cluster => (
                <ClusterRow
                  key={cluster.id}
                  cluster={cluster}
                  onAction={handleClusterAction}
                />
              ))}
            </tbody>
          </table>

          {filteredClusters.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No clusters match your filters</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
