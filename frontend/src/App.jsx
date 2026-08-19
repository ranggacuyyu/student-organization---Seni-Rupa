import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import RetroTicketModal from './components/ui/RetroTicketModal';
import ArtworkModal from './components/ui/ArtworkModal';

import Home from './pages/Home';
import AttendancePage from './pages/AttendancePage';
import CataloguePage from './pages/CataloguePage';
import VenueLayoutPage from './pages/VenueLayoutPage';
import RundownPage from './pages/RundownPage';
import GuestbookPage from './pages/GuestbookPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import PanitiaDashboard from './pages/panitia/PanitiaDashboard';
import LoginPage from './pages/auth/LoginPage';
import ComingSoonPage from './pages/ComingSoonPage';

import { 
  ArtworkService, 
  AttendanceService, 
  RundownService, 
  GuestbookService,
  AuthService
} from './services/api';

import {
  INITIAL_ARTWORKS,
  INITIAL_ATTENDANCES,
  INITIAL_GUESTBOOKS,
  RUNDOWN_SCHEDULE
} from './data/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => AuthService.getCurrentUser());

  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['home', 'presensi', 'katalog', 'denah', 'rundown', 'pesan-kesan', 'panitia', 'admin', 'login', 'coming-soon'];
    if (validTabs.includes(hash)) return hash;
    return localStorage.getItem('senrup_active_tab') || 'home';
  });



  // Synchronous initial state from localStorage to prevent re-render flashing
  const [artworks, setArtworks] = useState(() => {
    try {
      const saved = localStorage.getItem('senrup_artworks_v1');
      return saved ? JSON.parse(saved) : INITIAL_ARTWORKS;
    } catch {
      return INITIAL_ARTWORKS;
    }
  });

  const [attendances, setAttendances] = useState(() => {
    try {
      const saved = localStorage.getItem('senrup_attendances_v1');
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCES;
    } catch {
      return INITIAL_ATTENDANCES;
    }
  });

  const [rundowns, setRundowns] = useState(() => {
    try {
      const saved = localStorage.getItem('senrup_rundowns_v1');
      return saved ? JSON.parse(saved) : RUNDOWN_SCHEDULE;
    } catch {
      return RUNDOWN_SCHEDULE;
    }
  });

  const [guestbookMessages, setGuestbookMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('senrup_guestbooks_v1');
      return saved ? JSON.parse(saved) : INITIAL_GUESTBOOKS;
    } catch {
      return INITIAL_GUESTBOOKS;
    }
  });

  const [likedIds, setLikedIds] = useState(() => ArtworkService.getLikedIds());
  const [myTicket, setMyTicket] = useState(() => AttendanceService.getMyTicket());

  // Modals & Navigation Selectors
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [targetBoothId, setTargetBoothId] = useState('booth-a');

  // Sync hash routing and activeTab
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('senrup_active_tab', tab);
    window.location.hash = tab;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['home', 'presensi', 'katalog', 'denah', 'rundown', 'pesan-kesan', 'panitia', 'admin', 'login', 'coming-soon'];
      if (validTabs.includes(hash) && hash !== activeTab) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      handleSetActiveTab('admin');
    } else {
      handleSetActiveTab('panitia');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    handleSetActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load fresh data in background without resetting state
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [arts, atts, runs, msgs] = await Promise.all([
        ArtworkService.getAllArtworks(),
        AttendanceService.getAllAttendances(),
        RundownService.getRundowns(),
        GuestbookService.getMessages(),
      ]);

      setArtworks(arts);
      setAttendances(atts);
      setRundowns(runs);
      setGuestbookMessages(msgs);
      setLikedIds(ArtworkService.getLikedIds());
      setMyTicket(AttendanceService.getMyTicket());
    } catch (e) {
      console.error('Data load error:', e);
    }
  };

  // Handle Like Artwork
  const handleLikeArtwork = async (artworkId) => {
    const result = await ArtworkService.toggleLike(artworkId);
    setArtworks(result.updatedList);
    setLikedIds(ArtworkService.getLikedIds());
    if (selectedArtwork && selectedArtwork.id === artworkId) {
      const updatedItem = result.updatedList.find(a => a.id === artworkId);
      if (updatedItem) setSelectedArtwork(updatedItem);
    }
  };

  // Handle Select Artwork Modal
  const handleOpenArtworkModal = (art) => {
    setSelectedArtwork(art);
  };

  // Handle Go to Booth from Artwork Modal
  const handleGoToBooth = (boothId) => {
    setTargetBoothId(boothId || 'booth-a');
    handleSetActiveTab('denah');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Attendance Success
  const handleAttendanceSuccess = (ticketData) => {
    setMyTicket(ticketData);
    setIsTicketOpen(true);
    loadAllData();
  };

  // Handle Rundown Live Status Update (from Admin / Panitia)
  const handleUpdateRundownStatus = async (id, status) => {
    const updated = await RundownService.updateStatus(id, status);
    setRundowns(updated);
  };

  // Current Live Session for Hero banner
  const currentLiveSession = rundowns.find(r => r.status === 'ongoing') || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7EE] text-[#121212]">
      
      {/* Sticky Retro Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        onOpenTicket={() => setIsTicketOpen(true)}
        ticketCount={myTicket ? 1 : 0}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home
            onNavigate={(tab) => {
              handleSetActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            artworks={artworks}
            attendancesCount={attendances.length}
            onSelectArtwork={handleOpenArtworkModal}
            currentLiveSession={currentLiveSession}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'presensi' && (
          !currentUser ? (
            <AttendancePage
              onOpenTicket={() => setIsTicketOpen(true)}
              onAttendanceSuccess={handleAttendanceSuccess}
            />
          ) : (
            currentUser.role === 'admin' ? (
              <AdminDashboard
                currentUser={currentUser}
                onLogout={handleLogout}
                attendances={attendances}
                artworks={artworks}
                rundowns={rundowns}
                onRefreshData={loadAllData}
                onUpdateRundownStatus={handleUpdateRundownStatus}
              />
            ) : (
              <PanitiaDashboard
                currentUser={currentUser}
                onLogout={handleLogout}
                rundowns={rundowns}
                onUpdateRundownStatus={handleUpdateRundownStatus}
              />
            )
          )
        )}

        {activeTab === 'katalog' && (
          <CataloguePage
            artworks={artworks}
            onSelectArtwork={handleOpenArtworkModal}
            onLikeArtwork={handleLikeArtwork}
            likedIds={likedIds}
          />
        )}

        {activeTab === 'denah' && (
          <VenueLayoutPage
            artworks={artworks}
            onSelectArtwork={handleOpenArtworkModal}
            selectedBoothId={targetBoothId}
            onNavigateCatalogue={() => {
              handleSetActiveTab('katalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'rundown' && (
          <RundownPage
            rundowns={rundowns}
            onNavigateBooth={handleGoToBooth}
          />
        )}

        {activeTab === 'pesan-kesan' && (
          <GuestbookPage
            messages={guestbookMessages}
            onAddMessage={(newMsg) => {
              setGuestbookMessages([newMsg, ...guestbookMessages]);
            }}
          />
        )}

        {activeTab === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => handleSetActiveTab('home')}
          />
        )}

        {activeTab === 'panitia' && (
          currentUser ? (
            <PanitiaDashboard
              currentUser={currentUser}
              onLogout={handleLogout}
              rundowns={rundowns}
              onUpdateRundownStatus={handleUpdateRundownStatus}
            />
          ) : (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateHome={() => handleSetActiveTab('home')}
            />
          )
        )}

        {activeTab === 'admin' && (
          currentUser && currentUser.role === 'admin' ? (
            <AdminDashboard
              currentUser={currentUser}
              onLogout={handleLogout}
              attendances={attendances}
              artworks={artworks}
              rundowns={rundowns}
              onRefreshData={loadAllData}
              onUpdateRundownStatus={handleUpdateRundownStatus}
            />
          ) : (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateHome={() => handleSetActiveTab('home')}
            />
          )
        )}

        {activeTab === 'coming-soon' && (
          <ComingSoonPage
            onNavigateHome={() => {
              handleSetActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Retro Footer */}
      <Footer
        onNavigateAdmin={() => {
          handleSetActiveTab(currentUser ? (currentUser.role === 'admin' ? 'admin' : 'panitia') : 'login');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modal: Digital Attendee Ticket / Pass */}
      <RetroTicketModal
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        ticket={myTicket}
        onGoToPresensi={() => {
          setIsTicketOpen(false);
          handleSetActiveTab('presensi');
        }}
      />

      {/* Modal: Deep Artwork Philosophy & Details */}
      <ArtworkModal
        isOpen={!!selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        artwork={selectedArtwork}
        onLike={handleLikeArtwork}
        isLiked={selectedArtwork ? likedIds.includes(selectedArtwork.id) : false}
        onGoToBooth={handleGoToBooth}
      />

    </div>
  );
}


