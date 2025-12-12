// Mock data for the K8s Training Platform

export const currentUser = {
  id: 'user-1',
  name: 'Alex Chen',
  email: 'alex.chen@university.edu',
  avatar: null,
  role: 'student',
  enrolledTrack: 'CKAD',
  quota: {
    totalHours: 100,
    usedHours: 42.5,
    clustersCreated: 8,
    maxConcurrentClusters: 2,
  },
};

export const adminUser = {
  id: 'admin-1',
  name: 'Dr. Sarah Mitchell',
  email: 's.mitchell@university.edu',
  avatar: null,
  role: 'instructor',
};

export const clusters = [
  {
    id: 'cluster-1',
    name: 'ckad-practice-01',
    status: 'running',
    track: 'CKAD',
    nodeCount: 3,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    ip: '10.240.0.15',
    kubeVersion: 'v1.28.4',
    resources: {
      cpuUsage: 34,
      memoryUsage: 52,
      podCount: 12,
    },
  },
  {
    id: 'cluster-2',
    name: 'cka-exam-prep',
    status: 'stopped',
    track: 'CKA',
    nodeCount: 1,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: null,
    ip: null,
    kubeVersion: 'v1.28.4',
    resources: null,
  },
];

export const examTracks = [
  {
    id: 'ckad',
    name: 'CKAD',
    fullName: 'Certified Kubernetes Application Developer',
    description: 'Design, build and deploy cloud-native applications on Kubernetes',
    color: '#326CE5',
    icon: 'Code',
    duration: '2 hours',
    topics: ['Core Concepts', 'Configuration', 'Multi-Container Pods', 'Observability', 'Pod Design', 'Services & Networking', 'State Persistence'],
  },
  {
    id: 'cka',
    name: 'CKA',
    fullName: 'Certified Kubernetes Administrator',
    description: 'Configure and manage production-grade Kubernetes clusters',
    color: '#3fb950',
    icon: 'Server',
    duration: '2 hours',
    topics: ['Cluster Architecture', 'Workloads & Scheduling', 'Services & Networking', 'Storage', 'Troubleshooting'],
  },
  {
    id: 'cks',
    name: 'CKS',
    fullName: 'Certified Kubernetes Security Specialist',
    description: 'Secure containerized applications and Kubernetes platforms',
    color: '#f85149',
    icon: 'Shield',
    duration: '2 hours',
    topics: ['Cluster Setup', 'Cluster Hardening', 'System Hardening', 'Minimize Microservice Vulnerabilities', 'Supply Chain Security', 'Monitoring & Logging'],
  },
];

export const clusterSizes = [
  {
    id: '1-node',
    name: 'Single Node',
    nodeCount: 1,
    description: 'Perfect for basic exercises and learning',
    resources: '2 vCPU, 4GB RAM',
    quotaCost: 1,
  },
  {
    id: '3-node',
    name: 'Multi-Node',
    nodeCount: 3,
    description: 'Full cluster experience with HA capabilities',
    resources: '6 vCPU, 12GB RAM total',
    quotaCost: 3,
  },
];

export const students = [
  {
    id: 'student-1',
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    track: 'CKAD',
    hoursUsed: 42.5,
    clustersCreated: 8,
    lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    id: 'student-2',
    name: 'Jordan Smith',
    email: 'j.smith@university.edu',
    track: 'CKA',
    hoursUsed: 28.0,
    clustersCreated: 5,
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    id: 'student-3',
    name: 'Maya Patel',
    email: 'm.patel@university.edu',
    track: 'CKS',
    hoursUsed: 65.2,
    clustersCreated: 12,
    lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    id: 'student-4',
    name: 'Ryan O\'Brien',
    email: 'r.obrien@university.edu',
    track: 'CKAD',
    hoursUsed: 12.0,
    clustersCreated: 3,
    lastActive: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    status: 'inactive',
  },
  {
    id: 'student-5',
    name: 'Lisa Wang',
    email: 'l.wang@university.edu',
    track: 'CKA',
    hoursUsed: 89.5,
    clustersCreated: 15,
    lastActive: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    id: 'student-6',
    name: 'Marcus Johnson',
    email: 'm.johnson@university.edu',
    track: 'CKAD',
    hoursUsed: 55.0,
    clustersCreated: 9,
    lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'active',
  },
];

export const terminalHistory = [
  { type: 'input', content: 'kubectl get nodes' },
  { type: 'output', content: `NAME           STATUS   ROLES           AGE   VERSION
control-plane  Ready    control-plane   2h    v1.28.4
worker-1       Ready    <none>          2h    v1.28.4
worker-2       Ready    <none>          2h    v1.28.4` },
  { type: 'input', content: 'kubectl get pods -A' },
  { type: 'output', content: `NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
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
default       nginx-deployment-6b7f675859-kx7rj          1/1     Running   0          45m` },
  { type: 'input', content: 'kubectl get services' },
  { type: 'output', content: `NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP   2h
nginx-svc    ClusterIP   10.96.45.123   <none>        80/TCP    45m` },
];

export const recentActivity = [
  { id: 1, action: 'Cluster started', cluster: 'ckad-practice-01', time: '2 hours ago' },
  { id: 2, action: 'Exercise completed', cluster: 'ckad-practice-01', time: '1 hour ago', detail: 'Pod Design - Labels & Selectors' },
  { id: 3, action: 'Cluster stopped', cluster: 'cka-exam-prep', time: 'Yesterday' },
  { id: 4, action: 'New cluster created', cluster: 'cka-exam-prep', time: '2 days ago' },
];
