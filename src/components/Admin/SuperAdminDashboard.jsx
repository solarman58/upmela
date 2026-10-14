import React, { useState, useEffect } from 'react';
import { useMapStore } from '../../store/useMapStore';
import { FiPlus, FiLogOut, FiUsers, FiBox, FiActivity, FiMap, FiMapPin, FiTrash2, FiPower, FiX, FiAlertTriangle, FiCheck, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { token, logout, addToast } = useMapStore();
  const [clients, setClients] = useState([]);
  const [demoLeads, setDemoLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('deployments');
  const [stats, setStats] = useState({ total_clients: 0, total_projects: 0, total_floors: 0, total_pois: 0 });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [showDeleteLeadModal, setShowDeleteLeadModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [trialCredentials, setTrialCredentials] = useState(null);
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [leadToProvision, setLeadToProvision] = useState(null);

  // Change Password states
  const [showChangePwModal, setShowChangePwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [changingPw, setChangingPw] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Client Reset Password states
  const [showClientResetModal, setShowClientResetModal] = useState(false);
  const [resetClient, setResetClient] = useState(null);
  const [clientNewPw, setClientNewPw] = useState('');
  const [resettingClientPw, setResettingClientPw] = useState(false);
  const [showClientPw, setShowClientPw] = useState(false);

  // Quota Edit states
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [quotaClient, setQuotaClient] = useState(null);
  const [maxBuildings, setMaxBuildings] = useState(1);
  const [maxFloors, setMaxFloors] = useState(1);
  const [maxNodes, setMaxNodes] = useState(10);
  const [savingQuotas, setSavingQuotas] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('Airport');
  const [creating, setCreating] = useState(false);
  const [trialDuration, setTrialDuration] = useState(15);

  const fetchData = async () => {
    try {
      const [statsRes, clientsRes, leadsRes] = await Promise.all([
        fetch('/api/superadmin/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/superadmin/list-clients', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/superadmin/demo-requests', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (statsRes.ok && clientsRes.ok && leadsRes.ok) {
        setStats(await statsRes.json());
        setClients(await clientsRes.json());
        setDemoLeads(await leadsRes.json());
      } else if (statsRes.status === 401 || clientsRes.status === 401 || statsRes.status === 403) {
        logout();
        navigate('/login');
      }
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      addToast('New passwords do not match!', 'error');
      return;
    }
    if (newPw.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }
    setChangingPw(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ current_password: currentPw, new_password: newPw })
      });
      const data = await res.json();
      if (res.ok) {
        addToast('✅ Password changed successfully!', 'success');
        setShowChangePwModal(false);
        setCurrentPw(''); setNewPw(''); setConfirmPw('');
      } else {
        addToast(data.error || 'Failed to change password', 'error');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setChangingPw(false);
    }
  };

  const openResetModal = (client) => {
    setResetClient(client);
    setClientNewPw('');
    setShowClientPw(false);
    setShowClientResetModal(true);
  };

  const handleResetClientPassword = async (e) => {
    e.preventDefault();
    if (clientNewPw.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }
    setResettingClientPw(true);
    try {
      const res = await fetch(`/api/superadmin/client/${resetClient.user_id}/reset-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ new_password: clientNewPw })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(`✅ Password for ${resetClient.username} reset successfully!`, 'success');
        setShowClientResetModal(false);
        setResetClient(null);
        setClientNewPw('');
      } else {
        addToast(data.error || 'Failed to reset password', 'error');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setResettingClientPw(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/superadmin/create-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ username, password, project_id: projectId, project_name: projectName, project_type: projectType })
      });
      if (res.ok) {
        addToast('Client Created Successfully!', 'success');
        setShowCreateModal(false);
        setUsername(''); setPassword(''); setProjectId(''); setProjectName(''); setProjectType('Airport');
        fetchData();
      } else {
        const data = await res.json();
        addToast(data.error || 'Failed to create client', 'error');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setCreating(false);
    }
  };

  // For toggle status confirmation
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [clientToToggle, setClientToToggle] = useState(null);

  const confirmToggleStatus = (client) => {
    setClientToToggle(client);
    setShowStatusModal(true);
  };

  const executeToggleStatus = async () => {
    if (!clientToToggle) return;
    const newStatus = clientToToggle.status === 'active' ? 'disabled' : 'active';
    try {
      const res = await fetch(`/api/superadmin/client/${clientToToggle.user_id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchData();
        addToast(`Client status changed to ${newStatus}`, 'success');
      } else {
        addToast('Failed to change status', 'error');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setShowStatusModal(false);
      setClientToToggle(null);
    }
  };

  const confirmDeleteClient = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    try {
      const res = await fetch(`/api/superadmin/client/${clientToDelete.user_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setShowDeleteModal(false);
        setClientToDelete(null);
        fetchData();
        addToast('Client and all their data deleted.', 'success');
      } else {
        const data = await res.json();
        addToast(data.error || 'Failed to delete client', 'error');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const toggleLeadStatus = async (lead) => {
    const newStatus = lead.status === 'new' ? 'contacted' : 'new';
    try {
      const res = await fetch(`/api/superadmin/demo-requests/${lead.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchData();
        addToast(`Lead marked as ${newStatus}`, 'success');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const confirmApproveTrial = (lead) => {
    setLeadToProvision(lead);
    setShowProvisionModal(true);
  };

  const executeApproveTrial = async () => {
    if (!leadToProvision) return;
    try {
      const res = await fetch('/api/superadmin/approve-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id: leadToProvision.id, trialDays: trialDuration })
      });
      const data = await res.json();
      if (res.ok) {
        fetchData(); // Refresh both tabs
        setShowProvisionModal(false);
        setLeadToProvision(null);
        setTrialCredentials(data.credentials);
        addToast('Trial account provisioned successfully', 'success');
      } else {
        addToast(data.error || 'Failed to provision account', 'error');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const copyToClipboard = () => {
    if (!trialCredentials) return;
    const text = `Login URL: ${trialCredentials.loginUrl}\nProject ID: ${trialCredentials.projectId}\nUsername: ${trialCredentials.username}\nPassword: ${trialCredentials.password}`;
    navigator.clipboard.writeText(text).then(() => {
      addToast('Credentials copied to clipboard!', 'success');
      setTrialCredentials(null);
    }).catch(() => {
      addToast('Failed to copy. Please select and copy manually.', 'error');
    });
  };

  const openQuotaModal = (client) => {
    setQuotaClient(client);
    setMaxBuildings(client.max_buildings || 1);
    setMaxFloors(client.max_floors || 1);
    setMaxNodes(client.max_nodes || 10);
    setShowQuotaModal(true);
  };

  const handleSaveQuotas = async (e) => {
    e.preventDefault();
    setSavingQuotas(true);
    try {
      const res = await fetch(`/api/superadmin/project/${quotaClient.project_id}/quotas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ max_buildings: maxBuildings, max_floors: maxFloors, max_nodes: maxNodes })
      });
      if (!res.ok) throw new Error('Failed to update quotas');
      addToast('Quotas updated successfully!', 'success');
      setShowQuotaModal(false);
      fetchData(); // refresh table
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSavingQuotas(false);
    }
  };

  const confirmDeleteLead = (lead) => {
    setLeadToDelete(lead);
    setShowDeleteLeadModal(true);
  };

  const executeDeleteLead = async () => {
    if (!leadToDelete) return;
    try {
      const res = await fetch(`/api/superadmin/demo-requests/${leadToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setShowDeleteLeadModal(false);
        setLeadToDelete(null);
        fetchData();
        addToast('Demo request and associated data deleted', 'success');
      } else {
        const data = await res.json();
        addToast(data.error || 'Failed to delete lead', 'error');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-slate-950 p-4 md:p-8 text-white relative flex flex-col items-center overflow-y-auto">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-sky-900/20 to-transparent pointer-events-none" />
      
      <div className="w-full max-w-6xl relative z-10 flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
          <div>
            <h1 className="text-3xl font-black mb-1 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">Margyaan Command Center</h1>
            <p className="text-slate-400 text-sm">Super Admin Dashboard</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
            {/* Profile Indicator */}
            <div className="flex items-center gap-3 pr-4 md:border-r border-slate-800 hidden md:flex">
              <div className="w-10 h-10 bg-sky-500/20 text-sky-400 rounded-xl flex items-center justify-center font-bold text-lg border border-sky-500/30">
                {useMapStore.getState().user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{useMapStore.getState().user?.username || 'admin'}</span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-black">SuperAdmin</span>
              </div>
            </div>

            <button onClick={() => setShowCreateModal(true)} className="w-full md:w-auto px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition shadow-lg shadow-sky-500/20">
              <FiPlus /> New Client
            </button>
            <button onClick={() => setShowChangePwModal(true)} title="Change Password" className="w-full md:w-auto px-5 py-2.5 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 rounded-xl font-bold flex justify-center items-center gap-2 transition border border-violet-500/20">
              <FiLock /> Change Password
            </button>
            <button onClick={handleLogout} className="w-full md:w-auto px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold flex justify-center items-center gap-2 transition">
              <FiLogOut /> Sign Out
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<FiUsers />} label="Total Clients" value={stats.total_clients} color="text-sky-400" bg="bg-sky-500/10" border="border-sky-500/20" />
          <StatCard icon={<FiBox />} label="Map Projects" value={stats.total_projects} color="text-indigo-400" bg="bg-indigo-500/10" border="border-indigo-500/20" />
          <StatCard icon={<FiMap />} label="Total Floors" value={stats.total_floors} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
          <StatCard icon={<FiMapPin />} label="Total POIs" value={stats.total_pois} color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
        </div>

        {/* Tabs and Data */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex border-b border-slate-800">
            <button 
              onClick={() => setActiveTab('deployments')}
              className={`flex-1 py-4 text-center font-bold transition flex items-center justify-center gap-2 ${activeTab === 'deployments' ? 'bg-sky-500/10 text-sky-400 border-b-2 border-sky-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
            >
              <FiActivity /> Active Deployments
            </button>
            <button 
              onClick={() => setActiveTab('leads')}
              className={`flex-1 py-4 text-center font-bold transition flex items-center justify-center gap-2 ${activeTab === 'leads' ? 'bg-indigo-500/10 text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
            >
              <FiUsers /> Demo Leads {demoLeads.filter(l => l.status === 'new').length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{demoLeads.filter(l => l.status === 'new').length} New</span>}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            {activeTab === 'deployments' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Client / Project</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Project ID</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Created</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading data...</td></tr>
                ) : clients.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500">No clients found. Create one to get started!</td></tr>
                ) : clients.map(c => (
                  <tr key={c.user_id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200">{c.project_name || 'Unnamed Project'}</div>
                      <div className="text-xs text-slate-500">{c.username}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 font-mono">{c.project_id}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${c.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openQuotaModal(c)} title="Edit Plan Quotas" className="px-3 py-1.5 text-xs font-bold rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-white transition whitespace-nowrap">
                          Edit Quota
                        </button>
                        <button onClick={() => openResetModal(c)} title="Reset Client Password" className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500 hover:text-white transition">
                          <FiLock />
                        </button>
                        <button onClick={() => confirmToggleStatus(c)} title={c.status === 'active' ? 'Disable Access' : 'Enable Access'} className={`p-2 rounded-lg border transition ${c.status === 'active' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}>
                          <FiPower />
                        </button>
                        <button onClick={() => confirmDeleteClient(c)} title="Delete Project & User" className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Client / Company</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Contact Details</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Message</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading leads...</td></tr>
                ) : demoLeads.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500">No demo requests yet.</td></tr>
                ) : demoLeads.map(lead => (
                  <tr key={lead.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200">{lead.name}</div>
                      <div className="text-sm text-sky-400">{lead.company}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      <div>{lead.email}</div>
                      {lead.phone && <div>{lead.phone}</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                      {lead.message || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${lead.status === 'new' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                        {lead.status.toUpperCase()}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1">{new Date(lead.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {lead.status === 'new' && (
                          <button onClick={() => confirmApproveTrial(lead)} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition">
                            Provision Trial
                          </button>
                        )}
                        <button onClick={() => toggleLeadStatus(lead)} className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${lead.status === 'new' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
                          {lead.status === 'new' ? 'Mark Contacted' : 'Mark as New'}
                        </button>
                        <button onClick={() => confirmDeleteLead(lead)} className="p-1.5 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg border border-transparent hover:border-rose-600 transition" title="Delete Lead">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>

      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setShowCreateModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><FiX size={24}/></button>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FiUsers className="text-sky-500" /> Provision New Client</h2>
              
              <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Project ID (e.g. jfk_airport)</label>
                  <input required type="text" value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-sky-500 outline-none" placeholder="No spaces, lowercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Public App Name</label>
                  <input required type="text" value={projectName} onChange={e => setProjectName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-sky-500 outline-none" placeholder="e.g. JFK Navigator" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Admin Username</label>
                    <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-sky-500 outline-none" placeholder="client_jfk" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Password</label>
                    <input required type="text" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-sky-500 outline-none" placeholder="••••••••" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Industry / Project Type</label>
                  <select value={projectType} onChange={e => setProjectType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-sky-500 outline-none appearance-none">
                    <option value="Airport">Airports</option>
                    <option value="Hospital">Hospitals & Healthcare</option>
                    <option value="Mall">Shopping Malls & Retail</option>
                    <option value="Corporate">Corporate Offices & IT Parks</option>
                    <option value="University">Universities & Campuses</option>
                    <option value="Metro">Metro & Railway Stations</option>
                    <option value="Museum">Museums & Exhibitions</option>
                    <option value="Warehouse">Warehouses & Logistics</option>
                    <option value="Government">Government Buildings & Courts</option>
                    <option value="Stadium">Stadiums & Theme Parks</option>
                    <option value="Generic">Generic / Other</option>
                  </select>
                </div>
                <button type="submit" disabled={creating} className="w-full mt-4 bg-sky-500 hover:bg-sky-400 text-white font-bold py-3.5 rounded-xl transition flex justify-center items-center gap-2 shadow-lg shadow-sky-500/20">
                  <FiPlus /> {creating ? 'Provisioning...' : 'Deploy Project & Account'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && clientToDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-slate-900 border border-red-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-4 text-3xl">
                <FiAlertTriangle />
              </div>
              <h2 className="text-xl font-bold mb-2">Delete Project & Client?</h2>
              <p className="text-sm text-slate-400 mb-6">
                You are about to permanently delete <strong className="text-white">{clientToDelete.project_name}</strong> ({clientToDelete.username}). 
                This will destroy all their map data, floors, POIs, and routes. <strong>This cannot be undone!</strong>
              </p>
              
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition">
                  Cancel
                </button>
                <button onClick={handleDeleteClient} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition flex justify-center items-center gap-2">
                  <FiTrash2 /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Status Toggle Modal */}
        {showStatusModal && clientToToggle && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl ${clientToToggle.status === 'active' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'}`}>
                <FiPower />
              </div>
              <h2 className="text-xl font-bold mb-2">
                {clientToToggle.status === 'active' ? 'Disable Access?' : 'Enable Access?'}
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to {clientToToggle.status === 'active' ? 'disable' : 'enable'} access for <strong className="text-white">{clientToToggle.username}</strong>?
              </p>
              
              <div className="flex gap-4">
                <button onClick={() => setShowStatusModal(false)} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition">
                  Cancel
                </button>
                <button onClick={executeToggleStatus} className={`flex-1 py-3 rounded-xl text-white font-bold transition flex justify-center items-center gap-2 ${clientToToggle.status === 'active' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                  <FiCheck /> Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Provision Trial Confirm Modal */}
        {showProvisionModal && leadToProvision && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-4 text-3xl">
                <FiUsers />
              </div>
              <h2 className="text-xl font-bold mb-2">Provision Free Trial?</h2>
              <p className="text-sm text-slate-400 mb-4">
                You are about to automatically generate a secure project and credentials for <strong className="text-white">{leadToProvision.company}</strong>. Limits will be automatically enforced.
              </p>

              <div className="mb-6 text-left">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trial Duration (Days)</label>
                <input 
                  type="number"
                  min="1"
                  value={trialDuration} 
                  onChange={(e) => setTrialDuration(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="Enter number of days (e.g. 15)"
                />
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowProvisionModal(false)} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition">
                  Cancel
                </button>
                <button onClick={executeApproveTrial} className="flex-1 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition flex justify-center items-center gap-2">
                  <FiCheck /> Provision Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Trial Credentials Modal */}
        {trialCredentials && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setTrialCredentials(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><FiX size={24}/></button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-500/20">
                  <FiCheck />
                </div>
                <h2 className="text-2xl font-bold text-white">Trial Provisioned!</h2>
                <p className="text-sm text-slate-400 mt-2">Share these credentials securely with the client.</p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 mb-6 border border-slate-800 space-y-3 font-mono text-sm text-left">
                <div><span className="text-slate-500">Login URL:</span> <br/><a href={trialCredentials.loginUrl} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">{trialCredentials.loginUrl}</a></div>
                <div><span className="text-slate-500">Project ID:</span> <br/><span className="text-slate-200">{trialCredentials.projectId}</span></div>
                <div><span className="text-slate-500">Username:</span> <br/><span className="text-slate-200">{trialCredentials.username}</span></div>
                <div><span className="text-slate-500">Password:</span> <br/><span className="text-amber-400 font-black">{trialCredentials.password}</span></div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setTrialCredentials(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition">
                  Close
                </button>
                <button onClick={copyToClipboard} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition">
                  Copy & Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Lead Modal */}
        {showDeleteLeadModal && leadToDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-slate-900 border border-rose-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-center">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto mb-4 text-3xl">
                <FiTrash2 />
              </div>
              <h2 className="text-xl font-bold mb-2">Delete Demo Request?</h2>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to delete the request from <strong className="text-white">{leadToDelete.email}</strong>?
                If they have an active project, it will also be <strong className="text-rose-400">permanently deleted</strong>.
              </p>
              
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteLeadModal(false)} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition">
                  Cancel
                </button>
                <button onClick={executeDeleteLead} className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition flex justify-center items-center gap-2">
                  <FiTrash2 /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Edit Quota Modal */}
        {showQuotaModal && quotaClient && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-slate-900 border border-sky-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setShowQuotaModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><FiX size={24}/></button>
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><FiBox className="text-sky-500" /> Edit Quotas</h2>
              <p className="text-sm text-slate-400 mb-6">Manage plan limits for <strong className="text-white">{quotaClient.project_name}</strong></p>
              
              <form onSubmit={handleSaveQuotas} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Max Buildings Allowed</label>
                  <input required type="number" min="1" value={maxBuildings} onChange={e => setMaxBuildings(parseInt(e.target.value) || 1)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-sky-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Max Floors Allowed</label>
                  <input required type="number" min="1" value={maxFloors} onChange={e => setMaxFloors(parseInt(e.target.value) || 1)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-sky-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Max Locations (POIs) Allowed</label>
                  <input required type="number" min="1" value={maxNodes} onChange={e => setMaxNodes(parseInt(e.target.value) || 1)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-sky-500 outline-none" />
                </div>
                <button type="submit" disabled={savingQuotas} className="w-full mt-4 bg-sky-500 hover:bg-sky-400 text-white font-bold py-3.5 rounded-xl transition flex justify-center items-center gap-2 shadow-lg shadow-sky-500/20">
                  {savingQuotas ? 'Saving...' : 'Save Quotas'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* ── Change Password Modal ───────────────────────────────────────── */}
        {showChangePwModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ y: 24, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, scale: 0.95 }} className="bg-slate-900 border border-violet-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => { setShowChangePwModal(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }} className="absolute top-6 right-6 text-slate-400 hover:text-white transition">
                <FiX size={22} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-7">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 text-xl">
                  <FiShield />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Change Password</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Update your Super Admin credentials</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Current Password</label>
                  <div className="relative">
                    <input
                      required
                      type={showCurrentPw ? 'text' : 'password'}
                      value={currentPw}
                      onChange={e => setCurrentPw(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pr-11 focus:border-violet-500 outline-none text-white placeholder-slate-600 transition"
                      placeholder="Enter current password"
                    />
                    <button type="button" onClick={() => setShowCurrentPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
                      {showCurrentPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-800" />

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <input
                      required
                      type={showNewPw ? 'text' : 'password'}
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pr-11 focus:border-violet-500 outline-none text-white placeholder-slate-600 transition"
                      placeholder="Min. 6 characters"
                    />
                    <button type="button" onClick={() => setShowNewPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
                      {showNewPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {newPw.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                          newPw.length >= i * 3
                            ? i <= 1 ? 'bg-red-500' : i <= 2 ? 'bg-amber-500' : i <= 3 ? 'bg-sky-500' : 'bg-emerald-500'
                            : 'bg-slate-700'
                        }`} />
                      ))}
                      <span className="text-[10px] text-slate-500 ml-1">
                        {newPw.length < 4 ? 'Weak' : newPw.length < 7 ? 'Fair' : newPw.length < 10 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                  <div className="relative">
                    <input
                      required
                      type={showConfirmPw ? 'text' : 'password'}
                      value={confirmPw}
                      onChange={e => setConfirmPw(e.target.value)}
                      className={`w-full bg-slate-950 border rounded-xl px-4 py-3 pr-11 outline-none text-white placeholder-slate-600 transition ${
                        confirmPw && confirmPw !== newPw ? 'border-red-500/60 focus:border-red-500' : 'border-slate-700 focus:border-violet-500'
                      }`}
                      placeholder="Re-enter new password"
                    />
                    <button type="button" onClick={() => setShowConfirmPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
                      {showConfirmPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {confirmPw && confirmPw !== newPw && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><FiAlertTriangle size={12} /> Passwords do not match</p>
                  )}
                  {confirmPw && confirmPw === newPw && newPw.length >= 6 && (
                    <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1"><FiCheck size={12} /> Passwords match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={changingPw || (confirmPw !== newPw && confirmPw.length > 0)}
                  className="w-full mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition flex justify-center items-center gap-2 shadow-lg shadow-violet-500/20"
                >
                  <FiLock size={16} />
                  {changingPw ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* ── Reset Client Password Modal ───────────────────────────────────────── */}
        {showClientResetModal && resetClient && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ y: 24, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, scale: 0.95 }} className="bg-slate-900 border border-violet-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setShowClientResetModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition">
                <FiX size={22} />
              </button>

              <div className="flex items-center gap-4 mb-7">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 text-xl">
                  <FiLock />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Reset Client Password</h2>
                  <p className="text-xs text-slate-400 mt-0.5">For user: <span className="text-sky-400 font-bold">{resetClient.username}</span></p>
                </div>
              </div>

              <form onSubmit={handleResetClientPassword} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <input
                      required
                      type={showClientPw ? 'text' : 'password'}
                      value={clientNewPw}
                      onChange={e => setClientNewPw(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pr-11 focus:border-violet-500 outline-none text-white placeholder-slate-600 transition"
                      placeholder="Min. 6 characters"
                    />
                    <button type="button" onClick={() => setShowClientPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
                      {showClientPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={resettingClientPw || clientNewPw.length < 6}
                  className="w-full mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition flex justify-center items-center gap-2 shadow-lg shadow-violet-500/20"
                >
                  <FiLock size={16} />
                  {resettingClientPw ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

const StatCard = ({ icon, label, value, color, bg, border }) => (
  <div className={`p-6 rounded-3xl border ${border} ${bg} backdrop-blur flex flex-col items-start gap-4 transition hover:scale-[1.02]`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${color} bg-white/5`}>
      {icon}
    </div>
    <div>
      <div className={`text-4xl font-black ${color}`}>{value}</div>
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">{label}</div>
    </div>
  </div>
);

