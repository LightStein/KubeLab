import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Terminal from '../components/Terminal';
import Card, { CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import {
  Server,
  Clock,
  Cpu,
  HardDrive,
  Box,
  Network,
  Square,
  RefreshCw,
  Copy,
  Check,
  ArrowLeft,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Activity
} from 'lucide-react';

function InfoItem({ icon: Icon, label, value, copyable = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-[#21262d] last:border-0">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon className="w-4 h-4" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white">{value}</span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-[#21262d] rounded transition-colors"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-400" />
            ) : (
              <Copy className="w-3 h-3 text-gray-500" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function ResourceGauge({ label, value, color = 'blue' }) {
  const colors = {
    blue: 'stroke-k8s-blue',
    green: 'stroke-green-500',
    purple: 'stroke-purple-500',
  };

  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-[#21262d]"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${colors[color]} transition-all duration-500`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{value}%</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">{label}</p>
    </div>
  );
}

export default function ClusterView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clusters, updateClusterStatus, addToast } = useApp();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  const cluster = clusters.find(c => c.id === id);

  useEffect(() => {
    if (!cluster) {
      navigate('/');
      return;
    }

    // Update time remaining
    const updateTime = () => {
      if (cluster.expiresAt) {
        const diff = new Date(cluster.expiresAt) - new Date();
        if (diff <= 0) {
          setTimeRemaining('Expired');
          return;
        }
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [cluster, navigate]);

  if (!cluster) {
    return null;
  }

  const handleStop = async () => {
    setIsStopping(true);
    addToast('Stopping cluster...', 'info');

    await new Promise(resolve => setTimeout(resolve, 2000));

    updateClusterStatus(cluster.id, 'stopped');
    addToast('Cluster stopped successfully', 'success');
    navigate('/');
  };

  if (cluster.status !== 'running') {
    return (
      <div className="p-8 animate-fade-in">
        <div className="max-w-md mx-auto text-center py-16">
          <div className="w-16 h-16 bg-[#21262d] rounded-full flex items-center justify-center mx-auto mb-6">
            <Server className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Cluster Not Running</h2>
          <p className="text-gray-400 mb-6">
            This cluster is currently stopped. Start it from the dashboard to access the terminal.
          </p>
          <Button onClick={() => navigate('/')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-fade-in ${isFullscreen ? 'fixed inset-0 z-50 bg-[#0d1117]' : ''}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b border-[#30363d] bg-[#161b22] ${isFullscreen ? '' : ''}`}>
        <div className="flex items-center gap-4">
          {!isFullscreen && (
            <Button
              variant="ghost"
              icon={ArrowLeft}
              onClick={() => navigate('/')}
              size="sm"
            >
              Back
            </Button>
          )}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-900/30 rounded-lg">
              <Server className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-white">{cluster.name}</h1>
                <StatusBadge status={cluster.status} />
              </div>
              <p className="text-xs text-gray-500">{cluster.track} • {cluster.kubeVersion}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Warning */}
          {timeRemaining && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-900/30 border border-yellow-700/30 rounded-lg">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-400">{timeRemaining}</span>
            </div>
          )}

          <Button
            variant="ghost"
            icon={isFullscreen ? Minimize2 : Maximize2}
            onClick={() => setIsFullscreen(!isFullscreen)}
            size="sm"
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>

          <Button
            variant="danger"
            icon={Square}
            onClick={handleStop}
            loading={isStopping}
            size="sm"
          >
            Stop Cluster
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex ${isFullscreen ? 'h-[calc(100vh-65px)]' : 'h-[calc(100vh-130px)]'}`}>
        {/* Terminal */}
        <div className={`flex-1 ${isFullscreen ? '' : 'p-4'}`}>
          <div className={`h-full border border-[#30363d] rounded-lg overflow-hidden ${isFullscreen ? 'rounded-none border-0' : ''}`}>
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  student@{cluster.name} - bash
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-green-400 animate-pulse" />
                <span className="text-xs text-gray-500">Connected</span>
              </div>
            </div>

            {/* Terminal Body */}
            <Terminal clusterName={cluster.name} />
          </div>
        </div>

        {/* Sidebar - Hidden in fullscreen */}
        {!isFullscreen && (
          <div className="w-80 p-4 border-l border-[#30363d] bg-[#0d1117] overflow-y-auto animate-slide-in-right">
            {/* Cluster Info */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  Cluster Info
                </h3>
                <div className="space-y-1">
                  <InfoItem icon={Network} label="IP Address" value={cluster.ip} copyable />
                  <InfoItem icon={Cpu} label="Nodes" value={`${cluster.nodeCount} node${cluster.nodeCount > 1 ? 's' : ''}`} />
                  <InfoItem icon={Box} label="Version" value={cluster.kubeVersion} />
                  <InfoItem icon={Clock} label="Created" value={new Date(cluster.createdAt).toLocaleTimeString()} />
                </div>
              </CardContent>
            </Card>

            {/* Resource Usage */}
            {cluster.resources && (
              <Card className="mb-4">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Resource Usage
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <ResourceGauge
                      label="CPU"
                      value={cluster.resources.cpuUsage}
                      color="green"
                    />
                    <ResourceGauge
                      label="Memory"
                      value={cluster.resources.memoryUsage}
                      color="blue"
                    />
                    <ResourceGauge
                      label="Pods"
                      value={Math.round((cluster.resources.podCount / 20) * 100)}
                      color="purple"
                    />
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#21262d]">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Running Pods</span>
                      <span className="text-white font-medium">{cluster.resources.podCount} / 20</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Commands */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Quick Commands</h3>
                <div className="space-y-2">
                  {[
                    'kubectl get nodes',
                    'kubectl get pods -A',
                    'kubectl cluster-info',
                    'kubectl get services',
                  ].map(cmd => (
                    <button
                      key={cmd}
                      onClick={() => {
                        navigator.clipboard.writeText(cmd);
                        addToast('Command copied!', 'success');
                      }}
                      className="w-full text-left text-xs font-mono p-2 bg-[#0d1117] rounded border border-[#21262d] text-gray-400 hover:text-white hover:border-[#30363d] transition-all flex items-center justify-between group"
                    >
                      <span className="truncate">{cmd}</span>
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Warning Card */}
            <Card className="mt-4 bg-yellow-900/20 border-yellow-700/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-400 mb-1">Session Reminder</h4>
                    <p className="text-xs text-gray-400">
                      Your cluster will auto-stop when time expires. Save your work regularly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
