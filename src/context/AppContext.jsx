import React, { createContext, useContext, useState, useCallback } from 'react';
import { currentUser, adminUser, clusters as initialClusters, students as initialStudents } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(currentUser);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clusters, setClusters] = useState(initialClusters);
  const [students] = useState(initialStudents);
  const [toasts, setToasts] = useState([]);

  const toggleUserRole = useCallback(() => {
    setIsAdmin(prev => !prev);
    setUser(prev => prev.role === 'student' ? adminUser : currentUser);
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addCluster = useCallback((clusterData) => {
    const newCluster = {
      id: `cluster-${Date.now()}`,
      name: `${clusterData.track.toLowerCase()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'running',
      track: clusterData.track,
      nodeCount: clusterData.nodeCount,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      ip: `10.240.0.${Math.floor(Math.random() * 255)}`,
      kubeVersion: 'v1.28.4',
      resources: {
        cpuUsage: Math.floor(Math.random() * 30) + 10,
        memoryUsage: Math.floor(Math.random() * 40) + 20,
        podCount: Math.floor(Math.random() * 5) + 3,
      },
    };
    setClusters(prev => [newCluster, ...prev]);
    return newCluster;
  }, []);

  const updateClusterStatus = useCallback((clusterId, status) => {
    setClusters(prev => prev.map(c => {
      if (c.id === clusterId) {
        return {
          ...c,
          status,
          ip: status === 'running' ? `10.240.0.${Math.floor(Math.random() * 255)}` : null,
          resources: status === 'running' ? {
            cpuUsage: Math.floor(Math.random() * 30) + 10,
            memoryUsage: Math.floor(Math.random() * 40) + 20,
            podCount: Math.floor(Math.random() * 5) + 3,
          } : null,
        };
      }
      return c;
    }));
  }, []);

  const deleteCluster = useCallback((clusterId) => {
    setClusters(prev => prev.filter(c => c.id !== clusterId));
  }, []);

  const value = {
    user,
    isAdmin,
    toggleUserRole,
    clusters,
    students,
    addCluster,
    updateClusterStatus,
    deleteCluster,
    toasts,
    addToast,
    removeToast,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
