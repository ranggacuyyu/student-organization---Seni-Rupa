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

import { 
  ArtworkService, 
  AttendanceService, 
  RundownService, 
  GuestbookService 
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [artworks, setArtworks] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [rundowns, setRundowns] = useState([]);
  const [guestbookMessages, setGuestbookMessages] = useState([]);
  const [likedIds, setLikedIds] = useState([]);

  // Modals & Navigation Selectors
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [myTicket, setMyTicket] = useState(null);
  const [targetBoothId, setTargetBoothId] = useState('booth-a');

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
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
    setActiveTab('denah');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Attendance Success
  const handleAttendanceSuccess = (ticketData) => {
    setMyTicket(ticketData);
    setIsTicketOpen(true);
    loadAllData();
  };

  // Handle Rundown Live Status Update (from Admin)
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
        setActiveTab={setActiveTab}
        onOpenTicket={() => setIsTicketOpen(true)}
        ticketCount={myTicket ? 1 : 0}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            artworks={artworks}
            attendancesCount={attendances.length}
            onSelectArtwork={handleOpenArtworkModal}
            currentLiveSession={currentLiveSession}
          />
        )}

        {activeTab === 'presensi' && (
          <AttendancePage
            onOpenTicket={() => setIsTicketOpen(true)}
            onAttendanceSuccess={handleAttendanceSuccess}
          />
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
              setActiveTab('katalog');
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

        {activeTab === 'admin' && (
          <AdminDashboard
            attendances={attendances}
            artworks={artworks}
            rundowns={rundowns}
            onRefreshData={loadAllData}
            onUpdateRundownStatus={handleUpdateRundownStatus}
          />
        )}
      </main>

      {/* Retro Footer */}
      <Footer
        onNavigateAdmin={() => {
          setActiveTab('admin');
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
          setActiveTab('presensi');
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
