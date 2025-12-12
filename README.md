# KubeLab - Kubernetes Training Platform

A professional, demo-ready UI prototype for a university Kubernetes training platform. Built with React + Tailwind CSS with a modern dark theme.

## Features

### Student View
- **Dashboard**: Overview of clusters, usage stats, and quota tracking
- **Cluster Launch Wizard**: 3-step flow to create practice clusters
  - Select certification track (CKAD, CKA, CKS)
  - Choose cluster size (1-node or 3-node)
  - Review and launch with animated progress
- **Active Cluster View**:
  - Interactive terminal with fake kubectl responses
  - Real-time cluster info sidebar
  - Resource usage gauges
  - Fullscreen mode for demos

### Instructor/Admin View
- **Student Management**: View all students with usage stats
- **Bulk Operations**: Stop clusters, send notifications
- **Cluster Overview**: Monitor all active clusters across students

### UI Polish
- Smooth animations and transitions
- Toast notifications for all actions
- Loading states with spinners
- Responsive design
- Dark theme with terminal vibes

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack
- React 18
- React Router 6
- Tailwind CSS
- Lucide React Icons
- Vite

## Demo Tips

1. **Switch Views**: Use the "Switch to Admin/Student View" button in the sidebar
2. **Launch a Cluster**: Click "Launch New Cluster" and follow the wizard
3. **Terminal Demo**: Open a running cluster to show the interactive terminal
4. **Try Commands**: `kubectl get nodes`, `kubectl get pods -A`, `kubectl cluster-info`
5. **Fullscreen**: Use the fullscreen button for impressive terminal demos

## Mock Data
All data is mocked - no backend required. The platform simulates:
- Cluster creation with animated progress
- Start/stop cluster operations
- Terminal command responses
- Student management operations

Perfect for sales demos and university presentations!
