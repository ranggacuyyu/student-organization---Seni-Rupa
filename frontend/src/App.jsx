import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import RetroTicketModal from './components/ui/RetroTicketModal';
import ArtworkModal from './components/ui/ArtworkModal';
import LockedAccessGate from './components/ui/LockedAccessGate';

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

  // Calculate if visitor is verified (or is Panitia / Super Admin)
  const isVerified = useMemo(() => {
    if (currentUser) return true; // Panitia & Super Admin always have full access

    const checkedInList = JSON.parse(localStorage.getItem('senrup_checked_in_tickets_v1') || '[]');

    // 1. Check if myTicket is in checkedInList
    if (myTicket && myTicket.id && checkedInList.includes(myTicket.id)) {
      return true;
    }
    if (myTicket && (myTicket.isCheckedIn || myTicket.is_checked_in || myTicket.status === 'checked_in')) {
      return true;
    }

    // 2. Check if any attendance with the user's IP or ticket ID is checked in
    if (myTicket && myTicket.ip_address) {
      const match = attendances.find(a => (a.ip_address && a.ip_address === myTicket.ip_address) || (a.id && a.id === myTicket.id));
      if (match && (checkedInList.includes(match.id) || match.isCheckedIn || match.is_checked_in)) {
        return true;
      }
    }

    return false;
  }, [currentUser, myTicket, attendances]);

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

  // Handle Like Artwork (Optimistic UI Update: Langsung berubah di UI, data disinkronkan di background)
  const handleLikeArtwork = (artworkId) => {
    const isCurrentlyLiked = likedIds.includes(artworkId);
    const delta = isCurrentlyLiked ? -1 : 1; 
    const nextLikedIds = isCurrentlyLiked
      ? likedIds.filter(id => id !== artworkId)
      : [...likedIds, artworkId];

    // 1. Update state secara instan (0ms) agar warna & status like langsung berubah di UI
    setLikedIds(nextLikedIds);

    setArtworks(prevArtworks =>
      prevArtworks.map(art => {
        if (art.id === artworkId) {
          return {
            ...art,
            likesCount: Math.max(0, (art.likesCount || 0) + delta),
          };
        }
        return art;
      })
    );

    if (selectedArtwork && selectedArtwork.id === artworkId) {
      setSelectedArtwork(prev => prev ? {
        ...prev,
        likesCount: Math.max(0, (prev.likesCount || 0) + delta),
      } : prev);
    }

    // 2. Jalankan background sync ke database & backend tanpa memblokir antarmuka
    ArtworkService.toggleLike(artworkId);
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
        isVerified={isVerified}
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
          isVerified ? (
            <CataloguePage
              artworks={artworks}
              onSelectArtwork={handleOpenArtworkModal}
              onLikeArtwork={handleLikeArtwork}
              likedIds={likedIds}
            />
          ) : (
            <LockedAccessGate
              pageTitle="Katalog Karya Seni"
              myTicket={myTicket}
              onOpenTicket={() => setIsTicketOpen(true)}
              onNavigatePresensi={() => handleSetActiveTab('presensi')}
              onNavigateDenah={() => handleSetActiveTab('denah')}
              onNavigateHome={() => handleSetActiveTab('home')}
              onRefreshStatus={loadAllData}
            />
          )
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
          isVerified ? (
            <RundownPage
              rundowns={rundowns}
              onNavigateBooth={handleGoToBooth}
            />
          ) : (
            <LockedAccessGate
              pageTitle="Rundown & Jadwal Acara"
              myTicket={myTicket}
              onOpenTicket={() => setIsTicketOpen(true)}
              onNavigatePresensi={() => handleSetActiveTab('presensi')}
              onNavigateDenah={() => handleSetActiveTab('denah')}
              onNavigateHome={() => handleSetActiveTab('home')}
              onRefreshStatus={loadAllData}
            />
          )
        )}

        {activeTab === 'pesan-kesan' && (
          isVerified ? (
            <GuestbookPage
              messages={guestbookMessages}
              onAddMessage={(newMsg) => {
                setGuestbookMessages([newMsg, ...guestbookMessages]);
              }}
            />
          ) : (
            <LockedAccessGate
              pageTitle="Pojok Ekspresi & Buku Tamu"
              myTicket={myTicket}
              onOpenTicket={() => setIsTicketOpen(true)}
              onNavigatePresensi={() => handleSetActiveTab('presensi')}
              onNavigateDenah={() => handleSetActiveTab('denah')}
              onNavigateHome={() => handleSetActiveTab('home')}
              onRefreshStatus={loadAllData}
            />
          )
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
