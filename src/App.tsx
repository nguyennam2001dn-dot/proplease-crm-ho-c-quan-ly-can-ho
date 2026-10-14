import React, { useState } from 'react';
import {
  Lead,
  ApartmentRoom,
  UtilityBill,
  OperationalEvent,
  FacilityId,
  RoomStatus,
  BillStatus
} from './types/crm';
import {
  initialLeads,
  initialRooms,
  initialUtilityBills,
  initialEvents
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { LeadModal } from './components/LeadModal';
import { ImportLeadModal } from './components/ImportLeadModal';
import { LeadDetailModal } from './components/LeadDetailModal';
import { LeadsView } from './views/LeadsView';
import { UtilityBillingView } from './views/UtilityBillingView';
import { ScheduleView } from './views/ScheduleView';
import { RoomsView } from './views/RoomsView';
import { RevenueReportView } from './views/RevenueReportView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('data-khach-hang');
  const [selectedFacility, setSelectedFacility] = useState<FacilityId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Core CRM Datasets
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [rooms, setRooms] = useState<ApartmentRoom[]>(initialRooms);
  const [bills, setBills] = useState<UtilityBill[]>(initialUtilityBills);
  const [events, setEvents] = useState<OperationalEvent[]>(initialEvents);

  // Modals state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);

  // Lead CRUD handlers
  const handleSaveLead = (leadData: Partial<Lead>) => {
    if (leadData.id) {
      // Edit existing
      setLeads((prev) =>
        prev.map((l) => (l.id === leadData.id ? ({ ...l, ...leadData } as Lead) : l))
      );
    } else {
      // Add new
      const nextIdNum =
        leads.reduce((max, l) => {
          const num = parseInt(l.id.replace('LD-', ''), 10);
          return !isNaN(num) && num > max ? num : max;
        }, 1048) + 1;

      const newLead: Lead = {
        id: `LD-${nextIdNum}`,
        fullName: leadData.fullName || 'Khách Hàng Mới',
        phone: leadData.phone || '',
        channel: leadData.channel || 'zalo',
        channelAccount: leadData.channelAccount || '',
        status: leadData.status || 'chua_lien_he',
        demand: leadData.demand || 'co_thue_ngay',
        facilityId: leadData.facilityId || 'tvh',
        roomPreference: leadData.roomPreference || '20 Trương Văn Hiến - Căn Studio',
        budget: leadData.budget || 6000000,
        hasPet: !!leadData.hasPet,
        callCount: leadData.callCount || 0,
        notes: leadData.notes || '',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
      };

      setLeads((prev) => [newLead, ...prev]);
    }
    setEditingLead(null);
  };

  const handleImportLeads = (newLeadsData: Partial<Lead>[]) => {
    let nextNum =
      leads.reduce((max, l) => {
        const num = parseInt(l.id.replace('LD-', ''), 10);
        return !isNaN(num) && num > max ? num : max;
      }, 1048) + 1;

    const formatted: Lead[] = newLeadsData.map((d) => ({
      id: `LD-${nextNum++}`,
      fullName: d.fullName || 'Khách Hàng',
      phone: d.phone || '',
      channel: d.channel || 'call',
      channelAccount: d.channelAccount || '',
      status: d.status || 'chua_lien_he',
      demand: d.demand || 'co_thue_ngay',
      facilityId: d.facilityId || 'tvh',
      roomPreference: d.roomPreference || '20 Trương Văn Hiến - Căn Studio',
      budget: d.budget || 6500000,
      hasPet: !!d.hasPet,
      callCount: 0,
      notes: d.notes || '',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    }));

    setLeads((prev) => [...formatted, ...prev]);
  };

  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleBulkDeleteLeads = (ids: string[]) => {
    setLeads((prev) => prev.filter((l) => !ids.includes(l.id)));
  };

  const handleUpdateCallCount = (id: string, delta: number) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const newCount = Math.max(0, l.callCount + delta);
          return {
            ...l,
            callCount: newCount,
            status: newCount > 0 && l.status === 'chua_lien_he' ? 'da_lien_he' : l.status,
            lastContactAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
        }
        return l;
      })
    );
  };

  const handleUpdateLeadStatus = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
    if (detailLead && detailLead.id === id) {
      setDetailLead((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  // Room Handlers
  const handleUpdateRoomStatus = (roomId: string, status: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status } : r))
    );
  };

  const handleAddRoom = (newRoom: Partial<ApartmentRoom>) => {
    const r: ApartmentRoom = {
      id: `rm-${Date.now()}`,
      code: newRoom.code || 'P.000',
      facilityId: newRoom.facilityId || 'tvh',
      facilityName: newRoom.facilityName || '20 Trương Văn Hiến',
      floor: newRoom.floor || 1,
      type: newRoom.type || 'Studio',
      area: newRoom.area || 30,
      rentPrice: newRoom.rentPrice || 6000000,
      status: newRoom.status || 'available',
      petFriendly: !!newRoom.petFriendly,
      hasBalcony: !!newRoom.hasBalcony
    };
    setRooms((prev) => [...prev, r]);
  };

  // Utility Bill Handlers
  const handleUpdateBillStatus = (billId: string, status: BillStatus, method?: string) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? {
              ...b,
              status,
              paidAt: status === 'paid' ? new Date().toISOString().slice(0, 16).replace('T', ' ') : undefined,
              paymentMethod: method || b.paymentMethod
            }
          : b
      )
    );
  };

  const handleAddNewBill = (newBill: Partial<UtilityBill>) => {
    const b: UtilityBill = {
      id: `bill-${Date.now()}`,
      invoiceCode: newBill.invoiceCode || `INV-${Date.now()}`,
      roomCode: newBill.roomCode || 'P.101',
      facilityId: newBill.facilityId || 'tvh',
      facilityName: newBill.facilityName || '20 Trương Văn Hiến',
      billingMonth: newBill.billingMonth || '10/2026',
      tenantName: newBill.tenantName || 'Khách thuê',
      tenantPhone: newBill.tenantPhone || '0905000111',
      rentAmount: newBill.rentAmount || 5000000,
      elecOld: newBill.elecOld || 0,
      elecNew: newBill.elecNew || 0,
      elecUsage: newBill.elecUsage || 0,
      elecUnitPrice: newBill.elecUnitPrice || 3800,
      elecAmount: newBill.elecAmount || 0,
      waterOld: newBill.waterOld || 0,
      waterNew: newBill.waterNew || 0,
      waterUsage: newBill.waterUsage || 0,
      waterUnitPrice: newBill.waterUnitPrice || 25000,
      waterAmount: newBill.waterAmount || 0,
      managementFee: newBill.managementFee || 150000,
      internetFee: newBill.internetFee || 100000,
      cleaningFee: newBill.cleaningFee || 80000,
      parkingSlots: newBill.parkingSlots || 1,
      parkingFee: newBill.parkingFee || 100000,
      totalAmount: newBill.totalAmount || 6000000,
      status: 'pending',
      dueDate: '2026-10-15'
    };
    setBills((prev) => [b, ...prev]);
  };

  // Schedule Event Handlers
  const handleAddEvent = (newEvent: Partial<OperationalEvent>) => {
    const evt: OperationalEvent = {
      id: `ev-${Date.now()}`,
      title: newEvent.title || 'Sự kiện vận hành',
      type: newEvent.type || 'viewing',
      roomCode: newEvent.roomCode || 'P.201',
      facilityId: newEvent.facilityId || 'tvh',
      customerName: newEvent.customerName || '',
      customerPhone: newEvent.customerPhone || '',
      dateTime: newEvent.dateTime || new Date().toISOString().slice(0, 10),
      timeSlot: newEvent.timeSlot || '15:00 - 15:30',
      status: 'upcoming',
      assignedStaff: newEvent.assignedStaff || 'Nguyễn Thành Nam',
      notes: newEvent.notes || ''
    };
    setEvents((prev) => [evt, ...prev]);
  };

  const handleUpdateEventStatus = (id: string, status: 'upcoming' | 'completed' | 'cancelled') => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#121c2a] flex flex-col font-sans antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          selectedFacility={selectedFacility}
          onChangeFacility={setSelectedFacility}
          leadCount={leads.length}
        />
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative w-72 max-w-xs h-full bg-white z-10 shadow-2xl">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                setIsMobileMenuOpen(false);
              }}
              selectedFacility={selectedFacility}
              onChangeFacility={setSelectedFacility}
              leadCount={leads.length}
            />
          </div>
        </div>
      )}

      {/* Main content area shifted by 288px on desktop */}
      <div className="lg:pl-72 flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <TopHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFacility={selectedFacility}
          onChangeFacility={setSelectedFacility}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Dynamic Views */}
        <main className="w-full pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1">
          {currentTab === 'data-khach-hang' && (
            <LeadsView
              leads={leads}
              selectedFacility={selectedFacility}
              searchQuery={searchQuery}
              onAddLeadClick={() => {
                setEditingLead(null);
                setIsLeadModalOpen(true);
              }}
              onImportLeadClick={() => setIsImportModalOpen(true)}
              onSelectLead={(lead) => setDetailLead(lead)}
              onEditLead={(lead) => {
                setEditingLead(lead);
                setIsLeadModalOpen(true);
              }}
              onDeleteLead={handleDeleteLead}
              onBulkDelete={handleBulkDeleteLeads}
              onUpdateCallCount={handleUpdateCallCount}
            />
          )}

          {currentTab === 'lich-van-hanh' && (
            <ScheduleView
              events={events}
              selectedFacility={selectedFacility}
              onAddEvent={handleAddEvent}
              onUpdateEventStatus={handleUpdateEventStatus}
            />
          )}

          {currentTab === 'bang-thu-phi-dien-nuoc' && (
            <UtilityBillingView
              bills={bills}
              selectedFacility={selectedFacility}
              onUpdateBillStatus={handleUpdateBillStatus}
              onAddNewBill={handleAddNewBill}
            />
          )}

          {currentTab === 'quan-ly-can-ho' && (
            <RoomsView
              rooms={rooms}
              selectedFacility={selectedFacility}
              onUpdateRoomStatus={handleUpdateRoomStatus}
              onAddRoom={handleAddRoom}
            />
          )}

          {currentTab === 'bao-cao-doanh-thu' && (
            <RevenueReportView
              bills={bills}
              rooms={rooms}
              selectedFacility={selectedFacility}
            />
          )}

          {currentTab === 'cai-dat' && <SettingsView />}
        </main>
      </div>

      {/* Modals */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        initialLead={editingLead}
      />

      <ImportLeadModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportLeads}
      />

      <LeadDetailModal
        lead={detailLead}
        isOpen={!!detailLead}
        onClose={() => setDetailLead(null)}
        onEdit={(lead) => {
          setEditingLead(lead);
          setIsLeadModalOpen(true);
        }}
        onDelete={handleDeleteLead}
        onUpdateStatus={handleUpdateLeadStatus}
      />
    </div>
  );
}
