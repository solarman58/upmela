import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import Sidebar from './components/Sidebar/Sidebar';
import AirportMap from './components/AirportMap/AirportMap';
import Popup from './components/Popup/Popup';
import MapHeader from './components/MapHeader/MapHeader';
import Login from './components/Auth/Login';
import SuperAdminDashboard from './components/Admin/SuperAdminDashboard';
import LandingPage from './components/LandingPage/LandingPage';
import { useMapStore } from './store/useMapStore';
import ToastContainer from './components/Toast/ToastContainer';
import OfflineBanner from './components/OfflineBanner/OfflineBanner';

// ── Error Boundary ─────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100dvh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0f1e 0%, #0c1a35 100%)',
            color: '#f1f5f9',
            fontFamily: 'system-ui, sans-serif',
            padding: '2rem',
            textAlign: 'center',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '3rem' }}>⚠️</span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>Something went wrong</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '80%', margin: 0, wordBreak: 'break-all' }}>
            {this.state.error?.toString() || 'An unexpected error occurred.'}
          </p>
          {this.state.errorInfo && (
            <pre style={{ textAlign: 'left', background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.75rem', overflowX: 'auto', maxWidth: '90%', color: '#ef4444' }}>
              {this.state.errorInfo.componentStack}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 2rem',
              background: 'linear-gradient(90deg, #0ea5e9, #6366f1)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Map Layout ─────────────────────────────────────────────────────────────────
const MapLayout = () => {
  const floors = useMapStore(state => state.floors);
  const nodes = useMapStore(state => state.nodes);
  const edges = useMapStore(state => state.edges);
  const pois = useMapStore(state => state.pois);
  const currentFloor = useMapStore(state => state.currentFloor);
  const currentBuilding = useMapStore(state => state.currentBuilding);
  const isFullScreen = useMapStore(state => state.isFullScreen);
  const dataLoaded = useMapStore(state => state.dataLoaded);
  const loadMapData = useMapStore(state => state.loadMapData);

  useEffect(() => {
    loadMapData();
  }, [loadMapData]);

  useEffect(() => {
    if (dataLoaded && currentBuilding) {
      useMapStore.setState(state => {
        const newCache = { ...state.buildingCache };
        newCache[currentBuilding] = {
          floors: state.floors,
          nodes: state.nodes,
          edges: state.edges,
          pois: state.pois,
          topFloorId: state.currentFloor
        };
        return { buildingCache: newCache };
      });
    }
  }, [floors, nodes, edges, pois, currentFloor, currentBuilding, dataLoaded]);

  // URL-based Floor / Sector selection (One-time on load, cleanly clearing URL params)
  const urlSectorProcessedRef = useRef(false);
  useEffect(() => {
    if (dataLoaded && floors.length > 0 && !urlSectorProcessedRef.current) {
      const params = new URLSearchParams(window.location.search);
      const floorParam = params.get('floor');
      const sectorParam = params.get('sector');
      
      if (floorParam) {
        urlSectorProcessedRef.current = true;
        const target = floors.find(f => f.id === floorParam || f.level === floorParam);
        if (target) {
          useMapStore.getState().setFloor(target.id);
        }
        // Clean URL so floor switching & Back to Main Map button works seamlessly
        const cleanUrl = new URL(window.location);
        cleanUrl.searchParams.delete('floor');
        cleanUrl.searchParams.delete('sector');
        window.history.replaceState({}, '', cleanUrl);
      } else if (sectorParam) {
        urlSectorProcessedRef.current = true;
        const clean = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const target = floors.find(f => {
          return clean(f.name) === ('sector' + sectorParam) || clean(f.level) === ('s' + sectorParam);
        });
        if (target) {
          useMapStore.getState().setFloor(target.id);
        }
        // Clean URL so floor switching & Back to Main Map button works seamlessly
        const cleanUrl = new URL(window.location);
        cleanUrl.searchParams.delete('sector');
        cleanUrl.searchParams.delete('floor');
        window.history.replaceState({}, '', cleanUrl);
      }
    }
  }, [dataLoaded, floors]);

  // QR Code / URL-based Auto-Navigation
  useEffect(() => {
    if (dataLoaded && nodes.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const startNodeId = params.get('startNode');
      if (startNodeId) {
        const node = nodes.find(n => n.id === startNodeId);
        if (node) {
          const store = useMapStore.getState();
          store.setFloor(node.floor);
          store.setNavigationStart(node);
          store.setNavigationMode(true);
          
          // Let the floor switch process first, then smoothly zoom in
          setTimeout(() => {
            store.zoomMapTo(node.x, node.y, 4);
          }, 400);

          // Optional: clear the param to keep URL clean for subsequent navigations
          const url = new URL(window.location);
          url.searchParams.delete('startNode');
          window.history.replaceState({}, '', url);
        }
      }
    }
  }, [dataLoaded, nodes]);

  return (
    <div className="w-screen h-[100dvh] flex md:p-4 md:gap-4 overflow-hidden bg-[#f5f5f7] dark:bg-[#000000] font-sans antialiased text-slate-800 dark:text-slate-100 transition-colors duration-500 relative">
      {/* 1. Preloader */}
      <LoadingScreen />

      {/* 2. Sidebar/Bottom-Sheet Navigation */}
      {dataLoaded && (
        <div className={`absolute md:relative z-40 h-full pointer-events-none md:pointer-events-auto ${isFullScreen ? 'hidden' : ''} md:h-[calc(100dvh-2rem)] md:shrink-0`}>
          <div className="h-full pointer-events-auto">
            <Sidebar />
          </div>
        </div>
      )}

      {/* 3. Map + Header */}
      {dataLoaded && (
        <div className="flex-1 h-full w-full relative flex flex-col min-w-0 overflow-hidden md:rounded-[2rem] md:shadow-2xl md:border border-black/5 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
          {/* Top Header */}
          <MapHeader />

          {/* Map Canvas */}
          <div className="flex-1 w-full relative z-10 min-h-0 md:rounded-b-3xl overflow-hidden">
            <AirportMap />
          </div>

          {/* POI Detail Popup */}
          <Popup />
        </div>
      )}
    </div>
  );
};

// ── Auth-aware redirect handler (shown during logout/token checks) ──────────────
const AuthRedirectScreen = () => (
  <div
    style={{
      minHeight: '100dvh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0c1a35 100%)',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          width: 48,
          height: 48,
          border: '3px solid rgba(14,165,233,0.3)',
          borderTop: '3px solid #0ea5e9',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#94a3b8', fontFamily: 'system-ui', fontSize: '0.875rem', margin: 0 }}>
        Please wait...
      </p>
    </div>
  </div>
);

// ── Protected Route: only accessible when NOT logged in ───────────────────────
const GuestOnly = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('ap_token');
    const user = useMapStore.getState().user;
    if (token) {
      if (user?.role === 'superadmin') {
        setRedirect('/superadmin');
      } else if (user?.project_id) {
        setRedirect(`/app?project=${user.project_id}&mode=admin`);
      } else {
        setRedirect('/app');
      }
    }
    setChecking(false);
  }, []);

  if (checking) return <AuthRedirectScreen />;
  if (redirect) return <Navigate to={redirect} replace />;
  return children;
};

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Only apply dark/light theme and scroll locks on app routes, NOT on landing page
    const isAppRoute = location.pathname.startsWith('/app') ||
                       location.pathname.startsWith('/map') ||
                       location.pathname.startsWith('/superadmin');

    if (isAppRoute) {
      // Apply scroll-lock for the map app (needed for iOS Safari and correct flex layout)
      document.documentElement.classList.add('is-app-page');
      document.body.classList.add('is-app-page');
      
      // Allow URL override for iframe demos
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get('theme');
      const isUserSet = localStorage.getItem('theme_user_set');
      const activeTheme = urlTheme || (isUserSet ? localStorage.getItem('theme') : 'light') || 'light';
      
      document.documentElement.classList.toggle('dark', activeTheme === 'dark');
    } else {
      // Landing page — remove scroll-lock and always light
      document.documentElement.classList.remove('is-app-page', 'dark');
      document.body.classList.remove('is-app-page');
    }
    document.body.style.overscrollBehavior = 'none';
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage page="home" />} />
        <Route path="/features" element={<LandingPage page="features" />} />
        <Route path="/solutions" element={<LandingPage page="solutions" />} />
        <Route path="/pricing" element={<LandingPage page="pricing" />} />
        <Route path="/privacy" element={<LandingPage page="privacy" />} />
        <Route path="/terms" element={<LandingPage page="terms" />} />
        <Route path="/support" element={<LandingPage page="support" />} />
        <Route path="/app" element={<MapLayout />} />
        <Route path="/kumbh-mela" element={<MapLayout />} />
        <Route path="/kumbh-mela/*" element={<MapLayout />} />
        <Route path="/map/:slug" element={<MapLayout />} />
        <Route
          path="/login"
          element={
            <GuestOnly>
              <Login />
            </GuestOnly>
          }
        />
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
      <ToastContainer />
      <OfflineBanner />
    </ErrorBoundary>
  );
}
