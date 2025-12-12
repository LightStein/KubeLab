import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import { examTracks, clusterSizes } from '../data/mockData';
import {
  Code,
  Server,
  Shield,
  Check,
  ArrowRight,
  ArrowLeft,
  Rocket,
  Clock,
  Cpu,
  HardDrive,
  Loader2
} from 'lucide-react';

const trackIcons = {
  Code,
  Server,
  Shield,
};

function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <React.Fragment key={i}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
              i < currentStep
                ? 'bg-green-600 text-white'
                : i === currentStep
                ? 'bg-k8s-blue text-white ring-4 ring-k8s-blue/30'
                : 'bg-[#21262d] text-gray-500'
            }`}
          >
            {i < currentStep ? <Check className="w-5 h-5" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={`w-16 h-1 rounded transition-all duration-300 ${
                i < currentStep ? 'bg-green-600' : 'bg-[#21262d]'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function TrackSelection({ selectedTrack, onSelect }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Select Certification Track</h2>
        <p className="text-gray-400">Choose the exam you're preparing for</p>
      </div>

      <div className="grid gap-4">
        {examTracks.map(track => {
          const Icon = trackIcons[track.icon];
          const isSelected = selectedTrack === track.id;

          return (
            <Card
              key={track.id}
              hover
              onClick={() => onSelect(track.id)}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-k8s-blue bg-k8s-blue/10 ring-2 ring-k8s-blue/30'
                  : ''
              }`}
            >
              <CardContent className="flex items-start gap-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${track.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: track.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-white">{track.name}</h3>
                    <span className="text-xs text-gray-500 bg-[#21262d] px-2 py-0.5 rounded">
                      {track.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{track.fullName}</p>
                  <p className="text-sm text-gray-500">{track.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {track.topics.slice(0, 4).map(topic => (
                      <span
                        key={topic}
                        className="text-xs px-2 py-1 bg-[#21262d] text-gray-400 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                    {track.topics.length > 4 && (
                      <span className="text-xs px-2 py-1 text-gray-500">
                        +{track.topics.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-k8s-blue bg-k8s-blue'
                      : 'border-gray-600'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function SizeSelection({ selectedSize, onSelect }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Cluster Size</h2>
        <p className="text-gray-400">Select the number of nodes for your cluster</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {clusterSizes.map(size => {
          const isSelected = selectedSize === size.id;

          return (
            <Card
              key={size.id}
              hover
              onClick={() => onSelect(size.id)}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-k8s-blue bg-k8s-blue/10 ring-2 ring-k8s-blue/30'
                  : ''
              }`}
            >
              <CardContent className="text-center py-8">
                <div className="flex justify-center mb-4">
                  {Array.from({ length: size.nodeCount }, (_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-k8s-blue/20' : 'bg-[#21262d]'
                      } ${i > 0 ? '-ml-2' : ''}`}
                      style={{ zIndex: size.nodeCount - i }}
                    >
                      <Server
                        className={`w-6 h-6 ${isSelected ? 'text-k8s-blue' : 'text-gray-500'}`}
                      />
                    </div>
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{size.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{size.nodeCount} node{size.nodeCount > 1 ? 's' : ''}</p>
                <p className="text-sm text-gray-400 mb-4">{size.description}</p>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    {size.resources}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-[#30363d]">
                  <span className="text-sm text-yellow-500">
                    Uses {size.quotaCost}x quota
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ConfirmLaunch({ track, size, user, onLaunch, isLaunching }) {
  const selectedTrack = examTracks.find(t => t.id === track);
  const selectedSize = clusterSizes.find(s => s.id === size);
  const estimatedHoursRemaining = user.quota.totalHours - user.quota.usedHours;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Review & Launch</h2>
        <p className="text-gray-400">Confirm your cluster configuration</p>
      </div>

      <Card>
        <CardContent className="space-y-6">
          {/* Configuration Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-[#0d1117] rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Track</div>
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${selectedTrack.color}20` }}
                >
                  {React.createElement(trackIcons[selectedTrack.icon], {
                    className: 'w-5 h-5',
                    style: { color: selectedTrack.color }
                  })}
                </div>
                <div>
                  <div className="font-semibold text-white">{selectedTrack.name}</div>
                  <div className="text-xs text-gray-500">{selectedTrack.fullName}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0d1117] rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Cluster Size</div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#21262d]">
                  <Server className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">{selectedSize.name}</div>
                  <div className="text-xs text-gray-500">{selectedSize.resources}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quota Info */}
          <div className="p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="text-sm font-medium text-yellow-400">
                  Estimated time remaining in quota
                </div>
                <div className="text-2xl font-bold text-white">
                  {estimatedHoursRemaining.toFixed(1)} hours
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-[#0d1117] rounded-lg">
              <div className="text-2xl font-bold text-white">{selectedSize.nodeCount}</div>
              <div className="text-xs text-gray-500">Nodes</div>
            </div>
            <div className="p-4 bg-[#0d1117] rounded-lg">
              <div className="text-2xl font-bold text-white">v1.28.4</div>
              <div className="text-xs text-gray-500">K8s Version</div>
            </div>
            <div className="p-4 bg-[#0d1117] rounded-lg">
              <div className="text-2xl font-bold text-white">6h</div>
              <div className="text-xs text-gray-500">Max Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          size="lg"
          icon={isLaunching ? undefined : Rocket}
          loading={isLaunching}
          onClick={onLaunch}
          className="px-12"
        >
          {isLaunching ? 'Launching Cluster...' : 'Launch Cluster'}
        </Button>
        <p className="text-xs text-gray-500 mt-3">
          Cluster will be ready in approximately 30 seconds
        </p>
      </div>
    </div>
  );
}

function LaunchingState({ progress }) {
  const stages = [
    { label: 'Provisioning infrastructure', done: progress >= 20 },
    { label: 'Creating control plane', done: progress >= 40 },
    { label: 'Initializing worker nodes', done: progress >= 60 },
    { label: 'Configuring networking', done: progress >= 80 },
    { label: 'Installing cluster components', done: progress >= 100 },
  ];

  return (
    <div className="text-center py-12">
      <div className="relative w-32 h-32 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-[#21262d]" />
        <div
          className="absolute inset-0 rounded-full border-4 border-k8s-blue transition-all duration-500"
          style={{
            clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
            transform: `rotate(${(progress / 100) * 360}deg)`,
          }}
        />
        <div className="absolute inset-2 bg-[#161b22] rounded-full flex items-center justify-center">
          <Rocket className="w-12 h-12 text-k8s-blue animate-bounce" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Launching Your Cluster</h2>
      <p className="text-gray-400 mb-8">This usually takes about 30 seconds</p>

      <div className="max-w-md mx-auto">
        {/* Progress bar */}
        <div className="h-2 bg-[#21262d] rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-k8s-blue rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stages */}
        <div className="space-y-3 text-left">
          {stages.map((stage, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 transition-all duration-300 ${
                stage.done ? 'opacity-100' : 'opacity-40'
              }`}
            >
              {stage.done ? (
                <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-600">
                  {!stages[i - 1]?.done === false && (
                    <Loader2 className="w-4 h-4 text-k8s-blue animate-spin" />
                  )}
                </div>
              )}
              <span className={`text-sm ${stage.done ? 'text-white' : 'text-gray-500'}`}>
                {stage.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LaunchCluster() {
  const navigate = useNavigate();
  const { user, addCluster, addToast } = useApp();
  const [step, setStep] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);

  const handleLaunch = async () => {
    setIsLaunching(true);
    setStep(3);

    // Simulate progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setLaunchProgress(i);
    }

    // Create the cluster
    const track = examTracks.find(t => t.id === selectedTrack);
    const size = clusterSizes.find(s => s.id === selectedSize);
    const newCluster = addCluster({
      track: track.name,
      nodeCount: size.nodeCount,
    });

    addToast('Cluster launched successfully!', 'success');

    // Navigate to the cluster view
    setTimeout(() => {
      navigate(`/cluster/${newCluster.id}`);
    }, 500);
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return selectedTrack !== null;
      case 1:
        return selectedSize !== null;
      default:
        return true;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Launch New Cluster</h1>
        <p className="text-gray-400">Configure and deploy a Kubernetes cluster for practice</p>
      </div>

      {/* Step Indicator */}
      {step < 3 && <StepIndicator currentStep={step} totalSteps={3} />}

      {/* Step Content */}
      <div className="mb-8">
        {step === 0 && (
          <TrackSelection selectedTrack={selectedTrack} onSelect={setSelectedTrack} />
        )}
        {step === 1 && (
          <SizeSelection selectedSize={selectedSize} onSelect={setSelectedSize} />
        )}
        {step === 2 && (
          <ConfirmLaunch
            track={selectedTrack}
            size={selectedSize}
            user={user}
            onLaunch={handleLaunch}
            isLaunching={isLaunching}
          />
        )}
        {step === 3 && <LaunchingState progress={launchProgress} />}
      </div>

      {/* Navigation */}
      {step < 2 && (
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => step > 0 ? setStep(step - 1) : navigate('/')}
          >
            {step > 0 ? 'Back' : 'Cancel'}
          </Button>
          <Button
            icon={ArrowRight}
            iconPosition="right"
            disabled={!canProceed()}
            onClick={() => setStep(step + 1)}
          >
            Continue
          </Button>
        </div>
      )}

      {step === 2 && !isLaunching && (
        <div className="flex justify-start">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => setStep(step - 1)}
          >
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
