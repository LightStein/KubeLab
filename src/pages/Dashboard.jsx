import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import ProgressBar from '../components/common/ProgressBar';
import {
  Plus,
  Clock,
  Server,
  Award,
  Play,
  Square,
  Trash2,
  Terminal,
  ChevronRight,
  Activity,
  Cpu,
  HardDrive,
  Box
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, subValue, color = 'blue' }) {
  const colorStyles = {
    blue: 'from-k8s-blue/20 to-transparent border-k8s-blue/30',
    green: 'from-green-500/20 to-transparent border-green-500/30',
    purple: 'from-purple-500/20 to-transparent border-purple-500/30',
    yellow: 'from-yellow-500/20 to-transparent border-yellow-500/30',
  };

  return (
    <Card className={`bg-gradient-to-br ${colorStyles[color]} relative overflow-hidden`}>
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
          </div>
          <div className="p-3 bg-[#21262d] rounded-lg">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ClusterCard({ cluster, onStart, onStop, onDelete, isLoading }) {
  const navigate = useNavigate();
  const isRunning = cluster.status === 'running';

  const timeRemaining = () => {
    if (!cluster.expiresAt) return null;
    const diff = new Date(cluster.expiresAt) - new Date();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <Card hover className="animate-fade-in">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isRunning ? 'bg-green-900/30' : 'bg-gray-800'}`}>
                <Server className={`w-5 h-5 ${isRunning ? 'text-green-400' : 'text-gray-500'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-white">{cluster.name}</h3>
                <p className="text-xs text-gray-500">{cluster.kubeVersion}</p>
              </div>
            </div>
            <StatusBadge status={cluster.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Award className="w-4 h-4" />
              <span>{cluster.track}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Cpu className="w-4 h-4" />
              <span>{cluster.nodeCount} Node{cluster.nodeCount > 1 ? 's' : ''}</span>
            </div>
          </div>

          {isRunning && cluster.resources && (
            <div className="grid grid-cols-3 gap-3 p-3 bg-[#0d1117] rounded-lg mb-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">CPU</div>
                <div className="text-sm font-medium text-green-400">{cluster.resources.cpuUsage}%</div>
              </div>
              <div className="text-center border-x border-[#30363d]">
                <div className="text-xs text-gray-500 mb-1">Memory</div>
                <div className="text-sm font-medium text-blue-400">{cluster.resources.memoryUsage}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Pods</div>
                <div className="text-sm font-medium text-purple-400">{cluster.resources.podCount}</div>
              </div>
            </div>
          )}

          {isRunning && (
            <div className="flex items-center gap-2 text-xs text-yellow-500 mb-4">
              <Clock className="w-3 h-3" />
              <span>{timeRemaining()}</span>
            </div>
          )}
        </div>

        <div className="flex border-t border-[#30363d]">
          {isRunning ? (
            <>
              <button
                onClick={() => navigate(`/cluster/${cluster.id}`)}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-k8s-blue hover:bg-k8s-blue/10 transition-colors"
              >
                <Terminal className="w-4 h-4" />
                Open Terminal
              </button>
              <button
                onClick={() => onStop(cluster.id)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-yellow-500 hover:bg-yellow-500/10 transition-colors border-l border-[#30363d]"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onStart(cluster.id)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-green-500 hover:bg-green-500/10 transition-colors"
              >
                <Play className="w-4 h-4" />
                Start
              </button>
              <button
                onClick={() => onDelete(cluster.id)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors border-l border-[#30363d]"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user, clusters, updateClusterStatus, deleteCluster, addToast } = useApp();
  const [loadingCluster, setLoadingCluster] = React.useState(null);
  const navigate = useNavigate();

  const handleStartCluster = async (clusterId) => {
    setLoadingCluster(clusterId);
    addToast('Starting cluster...', 'info');

    // Simulate startup delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    updateClusterStatus(clusterId, 'running');
    setLoadingCluster(null);
    addToast('Cluster started successfully!', 'success');
  };

  const handleStopCluster = async (clusterId) => {
    setLoadingCluster(clusterId);
    addToast('Stopping cluster...', 'info');

    await new Promise(resolve => setTimeout(resolve, 1500));

    updateClusterStatus(clusterId, 'stopped');
    setLoadingCluster(null);
    addToast('Cluster stopped', 'success');
  };

  const handleDeleteCluster = async (clusterId) => {
    setLoadingCluster(clusterId);

    await new Promise(resolve => setTimeout(resolve, 1000));

    deleteCluster(clusterId);
    setLoadingCluster(null);
    addToast('Cluster deleted', 'success');
  };

  const runningClusters = clusters.filter(c => c.status === 'running').length;

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-400">
            Track your Kubernetes certification journey
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={() => navigate('/launch')}
          size="lg"
        >
          Launch New Cluster
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Clock}
          label="Hours Used"
          value={`${user.quota.usedHours}h`}
          subValue={`of ${user.quota.totalHours}h quota`}
          color="blue"
        />
        <StatCard
          icon={Server}
          label="Clusters Created"
          value={user.quota.clustersCreated}
          subValue="total lifetime"
          color="green"
        />
        <StatCard
          icon={Activity}
          label="Active Now"
          value={runningClusters}
          subValue={`of ${user.quota.maxConcurrentClusters} max`}
          color="purple"
        />
        <StatCard
          icon={Award}
          label="Current Track"
          value={user.enrolledTrack}
          subValue="Certification path"
          color="yellow"
        />
      </div>

      {/* Quota Progress */}
      <Card className="mb-8">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Usage Quota</h2>
            <span className="text-sm text-gray-400">
              {((user.quota.usedHours / user.quota.totalHours) * 100).toFixed(0)}% used
            </span>
          </div>
          <ProgressBar
            value={user.quota.usedHours}
            max={user.quota.totalHours}
            size="lg"
          />
          <p className="text-xs text-gray-500 mt-3">
            {(user.quota.totalHours - user.quota.usedHours).toFixed(1)} hours remaining this semester
          </p>
        </CardContent>
      </Card>

      {/* Clusters Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">My Clusters</h2>
          <Link to="/launch" className="text-sm text-k8s-blue hover:text-k8s-blue-dark transition-colors flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {clusters.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Server className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No clusters yet</h3>
              <p className="text-gray-400 mb-6">Launch your first cluster to start practicing</p>
              <Button icon={Plus} onClick={() => navigate('/launch')}>
                Launch Cluster
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clusters.map(cluster => (
              <ClusterCard
                key={cluster.id}
                cluster={cluster}
                onStart={handleStartCluster}
                onStop={handleStopCluster}
                onDelete={handleDeleteCluster}
                isLoading={loadingCluster === cluster.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
