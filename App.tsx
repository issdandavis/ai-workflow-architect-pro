
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import WorkflowBuilder from './pages/WorkflowBuilder';
import Analytics from './pages/Analytics';
import AgentDev from './pages/AgentDev';
import Settings from './pages/Settings';
import Shop from './pages/Shop';
import Storage from './pages/Storage';
import Roundtable from './pages/Roundtable';
import Integrations from './pages/Integrations';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workflow" element={<WorkflowBuilder />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/agent-dev" element={<AgentDev />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/roundtable" element={<Roundtable />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
