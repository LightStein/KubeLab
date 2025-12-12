import React, { useState, useRef, useEffect } from 'react';
import { terminalHistory } from '../data/mockData';

const fakeResponses = {
  'kubectl get nodes': `NAME           STATUS   ROLES           AGE   VERSION
control-plane  Ready    control-plane   2h    v1.28.4
worker-1       Ready    <none>          2h    v1.28.4
worker-2       Ready    <none>          2h    v1.28.4`,

  'kubectl get pods': `NAME                               READY   STATUS    RESTARTS   AGE
nginx-deployment-6b7f675859-4xvqj  1/1     Running   0          45m
nginx-deployment-6b7f675859-8mzpl  1/1     Running   0          45m
nginx-deployment-6b7f675859-kx7rj  1/1     Running   0          45m`,

  'kubectl get pods -A': `NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
kube-system   coredns-5dd5756b68-7xqjr                   1/1     Running   0          2h
kube-system   coredns-5dd5756b68-qtxbr                   1/1     Running   0          2h
kube-system   etcd-control-plane                         1/1     Running   0          2h
kube-system   kube-apiserver-control-plane               1/1     Running   0          2h
kube-system   kube-controller-manager-control-plane      1/1     Running   0          2h
kube-system   kube-proxy-8kxqm                           1/1     Running   0          2h
kube-system   kube-proxy-fvnxs                           1/1     Running   0          2h
kube-system   kube-proxy-zl7jv                           1/1     Running   0          2h
kube-system   kube-scheduler-control-plane               1/1     Running   0          2h
default       nginx-deployment-6b7f675859-4xvqj          1/1     Running   0          45m
default       nginx-deployment-6b7f675859-8mzpl          1/1     Running   0          45m
default       nginx-deployment-6b7f675859-kx7rj          1/1     Running   0          45m`,

  'kubectl get services': `NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP   2h
nginx-svc    ClusterIP   10.96.45.123   <none>        80/TCP    45m`,

  'kubectl get namespaces': `NAME              STATUS   AGE
default           Active   2h
kube-node-lease   Active   2h
kube-public       Active   2h
kube-system       Active   2h`,

  'kubectl cluster-info': `Kubernetes control plane is running at https://10.240.0.15:6443
CoreDNS is running at https://10.240.0.15:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.`,

  'kubectl version': `Client Version: v1.28.4
Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3
Server Version: v1.28.4`,

  'kubectl get deployments': `NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3/3     3            3           45m`,

  'kubectl describe node control-plane': `Name:               control-plane
Roles:              control-plane
Labels:             beta.kubernetes.io/arch=amd64
                    beta.kubernetes.io/os=linux
                    kubernetes.io/arch=amd64
                    kubernetes.io/hostname=control-plane
                    kubernetes.io/os=linux
                    node-role.kubernetes.io/control-plane=
Annotations:        kubeadm.alpha.kubernetes.io/cri-socket: unix:///var/run/containerd/containerd.sock
                    node.alpha.kubernetes.io/ttl: 0
CreationTimestamp:  Thu, 12 Dec 2024 10:00:00 +0000
Conditions:
  Type             Status  Reason                   Message
  ----             ------  ------                   -------
  MemoryPressure   False   KubeletHasSufficientMemory
  DiskPressure     False   KubeletHasNoDiskPressure
  PIDPressure      False   KubeletHasSufficientPID
  Ready            True    KubeletReady             kubelet is ready
Addresses:
  InternalIP:  10.240.0.15
  Hostname:    control-plane
Capacity:
  cpu:                2
  memory:             4028340Ki
  pods:               110
Allocatable:
  cpu:                2
  memory:             3925940Ki
  pods:               110`,

  'whoami': 'student',
  'pwd': '/home/student',
  'ls': 'exercises  manifests  README.md',
  'ls -la': `total 24
drwxr-xr-x 4 student student 4096 Dec 12 10:00 .
drwxr-xr-x 3 root    root    4096 Dec 12 09:55 ..
-rw-r--r-- 1 student student  220 Dec 12 09:55 .bash_logout
-rw-r--r-- 1 student student 3771 Dec 12 09:55 .bashrc
drwxr-xr-x 2 student student 4096 Dec 12 10:00 exercises
drwxr-xr-x 2 student student 4096 Dec 12 10:00 manifests
-rw-r--r-- 1 student student 1234 Dec 12 10:00 README.md`,

  'cat README.md': `# CKAD Practice Environment

Welcome to your Kubernetes practice cluster!

## Quick Start
- Run kubectl get nodes to verify cluster is healthy
- Explore the exercises/ directory for practice scenarios
- Use manifests/ for your YAML files

## Tips
- Use kubectl explain <resource> for help
- Tab completion is enabled
- vim and nano are available

Good luck with your certification prep!`,

  'clear': '',
  'help': `Available commands:
  kubectl       - Kubernetes CLI
  ls, cd, pwd   - File navigation
  cat, vim      - File viewing/editing
  clear         - Clear terminal
  exit          - Close session`,
};

export default function Terminal({ clusterName }) {
  const [history, setHistory] = useState([
    { type: 'output', content: `Welcome to ${clusterName || 'k8s-cluster'}` },
    { type: 'output', content: 'Type "help" for available commands\n' },
    ...terminalHistory.slice(0, 4),
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const processCommand = async (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    // Handle clear specially
    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    // Add input to history display
    setHistory(prev => [...prev, { type: 'input', content: cmd }]);

    // Simulate processing delay
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    setIsProcessing(false);

    // Find response
    let response = fakeResponses[trimmedCmd];

    if (!response) {
      // Check for partial matches
      const matchKey = Object.keys(fakeResponses).find(key =>
        trimmedCmd.startsWith(key.toLowerCase())
      );
      response = matchKey ? fakeResponses[matchKey] : null;
    }

    if (!response && trimmedCmd) {
      if (trimmedCmd.startsWith('kubectl')) {
        response = `error: unknown command "${cmd.split(' ').slice(1).join(' ')}"
Run 'kubectl --help' for usage.`;
      } else if (trimmedCmd === 'exit') {
        response = 'Use the "Stop Cluster" button to end your session.';
      } else {
        response = `bash: ${cmd.split(' ')[0]}: command not found`;
      }
    }

    if (response) {
      setHistory(prev => [...prev, { type: 'output', content: response }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      processCommand(currentInput);
      setCommandHistory(prev => [...prev, currentInput]);
      setHistoryIndex(-1);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion
      if (currentInput.startsWith('kubectl get ')) {
        const completions = ['pods', 'nodes', 'services', 'deployments', 'namespaces'];
        const partial = currentInput.replace('kubectl get ', '');
        const match = completions.find(c => c.startsWith(partial));
        if (match) {
          setCurrentInput(`kubectl get ${match}`);
        }
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      ref={terminalRef}
      onClick={handleTerminalClick}
      className="h-full bg-terminal-bg text-gray-300 font-mono text-sm p-4 overflow-y-auto cursor-text"
      style={{ minHeight: '400px' }}
    >
      {/* History */}
      {history.map((entry, i) => (
        <div key={i} className="mb-1">
          {entry.type === 'input' ? (
            <div className="flex items-start">
              <span className="text-terminal-green mr-2">student@{clusterName || 'cluster'}:~$</span>
              <span className="text-white">{entry.content}</span>
            </div>
          ) : (
            <pre className="text-gray-400 whitespace-pre-wrap">{entry.content}</pre>
          )}
        </div>
      ))}

      {/* Current input line */}
      <div className="flex items-start">
        <span className="text-terminal-green mr-2">student@{clusterName || 'cluster'}:~$</span>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-white outline-none border-none caret-white"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            disabled={isProcessing}
          />
          {isProcessing && (
            <span className="absolute right-0 top-0 text-terminal-yellow animate-pulse">
              Processing...
            </span>
          )}
        </div>
      </div>

      {/* Blinking cursor indicator when input is empty */}
      {!currentInput && !isProcessing && (
        <style>{`
          input:focus::after {
            content: '';
            animation: blink 1s infinite;
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      )}
    </div>
  );
}
