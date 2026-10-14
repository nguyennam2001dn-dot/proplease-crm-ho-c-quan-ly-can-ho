import React, { useState, useMemo } from 'react';
import { Lead, FacilityId, SocialChannel, ContactStatus, DemandStatus } from '../types/crm';

interface LeadsViewProps {
  leads: Lead[];
  selectedFacility: FacilityId;
  onAddLeadClick: () => void;
  onImportLeadClick: () => void;
  onSelectLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onUpdateCallCount: (id: string, delta: number) => void;
  searchQuery: string;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  selectedFacility,
  onAddLeadClick,
  onImportLeadClick,
  onSelectLead,
  onEditLead,
  onDeleteLead,
  onBulkDelete,
  onUpdateCallCount,
  searchQuery
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [demandFilter, setDemandFilter] = useState<string>('all');
  const [facilityFilter, setFacilityFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [petFilter, setPetFilter] = useState<string>('all');
  const [callFilter, setCallFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Sync facilityFilter with global facility if changed
  const effectiveFacility = selectedFacility !== 'all' ? selectedFacility : facilityFilter;

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Global search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = lead.fullName.toLowerCase().includes(q);
        const matchPhone = lead.phone.toLowerCase().includes(q);
        const matchRoom = lead.roomPreference.toLowerCase().includes(q);
        const matchNotes = lead.notes.toLowerCase().includes(q);
        const matchId = lead.id.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchRoom && !matchNotes && !matchId) return false;
      }

      // Facility
      if (effectiveFacility !== 'all' && lead.facilityId !== effectiveFacility) {
        return false;
      }

      // Quick status pills
      if (statusFilter === 'chua_lien_he' && lead.status !== 'chua_lien_he') return false;
      if (statusFilter === 'da_lien_he' && lead.status !== 'da_lien_he') return false;
      if (statusFilter === 'pet' && !lead.hasPet) return false;
      if (statusFilter === 'da_coc' && lead.demand !== 'da_coc') return false;

      // Dropdown channel
      if (channelFilter !== 'all' && lead.channel !== channelFilter) return false;

      // Dropdown demand
      if (demandFilter !== 'all' && lead.demand !== demandFilter) return false;

      // Dropdown price
      if (priceFilter === 'under_5m' && lead.budget >= 5000000) return false;
      if (priceFilter === '5m_8m' && (lead.budget < 5000000 || lead.budget > 8000000)) return false;
      if (priceFilter === '8m_12m' && (lead.budget < 8000000 || lead.budget > 12000000)) return false;
      if (priceFilter === 'over_12m' && lead.budget <= 12000000) return false;

      // Pet
      if (petFilter === 'yes' && !lead.hasPet) return false;
      if (petFilter === 'no' && lead.hasPet) return false;

      // Call count
      if (callFilter === '0' && lead.callCount !== 0) return false;
      if (callFilter === '1_2' && (lead.callCount < 1 || lead.callCount > 2)) return false;
      if (callFilter === '3plus' && lead.callCount < 3) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt.localeCompare(a.createdAt);
      if (sortBy === 'oldest') return a.createdAt.localeCompare(b.createdAt);
      if (sortBy === 'budget_high') return b.budget - a.budget;
      if (sortBy === 'budget_low') return a.budget - b.budget;
      if (sortBy === 'calls_low') return a.callCount - b.callCount;
      return 0;
    });
  }, [
    leads,
    searchQuery,
    effectiveFacility,
    statusFilter,
    channelFilter,
    demandFilter,
    priceFilter,
    petFilter,
    callFilter,
    sortBy
  ]);

  // KPIs
  const totalLeads = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === 'chua_lien_he').length;
  const closedLeadsCount = leads.filter((l) => l.demand === 'da_coc').length;
  const petLeadsCount = leads.filter((l) => l.hasPet).length;
  const closingRate = totalLeads > 0 ? ((closedLeadsCount / totalLeads) * 100).toFixed(1) : '0.0';
  const petPercentage = totalLeads > 0 ? Math.round((petLeadsCount / totalLeads) * 100) : 0;

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Selection
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedLeads.length && paginatedLeads.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedLeads.map((l) => l.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setChannelFilter('all');
    setDemandFilter('all');
    setFacilityFilter('all');
    setPriceFilter('all');
    setPetFilter('all');
    setCallFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Mã Lead', 'Họ Tên', 'Số Điện Thoại', 'Kênh', 'Trạng Thái', 'Nhu Cầu', 'Cơ Sở', 'Ngân Sách', 'Nuôi Pet', 'Số Lần Gọi', 'Ghi Chú', 'Ngày Nhập'];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.fullName}"`,
      `"${l.phone}"`,
      l.channel,
      l.status,
      l.demand,
      `"${l.roomPreference}"`,
      l.budget,
      l.hasPet ? 'Có' : 'Không',
      l.callCount,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      l.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DS_Khach_Thue_ProPlease_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* TOP HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100/70 text-[#0f5b54] text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0f5b54] animate-pulse"></span>
              Bộ phận Telesale & Khảo sát mặt bằng
            </span>
            <span className="text-slate-400 text-xs">• Cập nhật 2 phút trước</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">
            Quản Lý Data & Khách Thuê Phòng Tiềm Năng
          </h1>
          <p className="text-sm text-slate-500 max-w-3xl">
            Hệ thống tiếp nhận, phân loại phễu nhu cầu thuê và theo dõi số lần tương tác chăm sóc khách hàng theo thời gian thực.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={onImportLeadClick}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">upload_file</span>
            Import Lead
          </button>
          <button
            onClick={handleExportCSV}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">download</span>
            Xuất Excel / CSV
          </button>
          <button
            onClick={onAddLeadClick}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f5b54] text-white hover:bg-[#00423d] shadow-md hover:shadow-lg text-xs font-bold transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Thêm Data Khách Mới
          </button>
        </div>
      </div>

      {/* KPI SUMMARY CARDS (4 METRICS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="relative overflow-hidden rounded-xl bg-white p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Tổng Data Tiếp Nhận
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-800 font-mono tabular-nums">{totalLeads}</span>
                <span className="text-xs text-slate-500 font-medium">hồ sơ</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-lg bg-teal-50 text-[#0f5b54] flex items-center justify-center border border-teal-100">
              <span className="material-symbols-outlined text-[22px]">hub</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-slate-100">
            <span className="inline-flex items-center text-[#0f5b54] text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> +14.2%
            </span>
            <span className="text-[11px] text-slate-500">so với 7 ngày trước</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="relative overflow-hidden rounded-xl bg-white p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Chưa Liên Hệ (Lead Mới)
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-700 font-mono tabular-nums">{newLeadsCount}</span>
                <span className="text-xs text-amber-700 font-medium">cần gọi ngay</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <span className="material-symbols-outlined text-[22px]">phone_missed</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping"></span> Phản hồi dưới 15p
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Ưu tiên số 1</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="relative overflow-hidden rounded-xl bg-white p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Đã Chốt Thuê Thành Công
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-teal-800 font-mono tabular-nums">{closedLeadsCount}</span>
                <span className="text-xs text-teal-800 font-medium">hợp đồng</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-100">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100">
            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0f5b54] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, parseFloat(closingRate))}%` }}
              ></div>
            </div>
            <span className="text-xs text-teal-800 font-bold font-mono">{closingRate}% chốt</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="relative overflow-hidden rounded-xl bg-white p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Khách Có Nuôi Thú Cưng
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-blue-800 font-mono tabular-nums">{petLeadsCount}</span>
                <span className="text-xs text-slate-500 font-medium">yêu cầu Pet-Friendly</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <span className="material-symbols-outlined text-[22px]">pets</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">Chiếm {petPercentage}% tổng nhu cầu</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
              Phòng riêng sàn gạch
            </span>
          </div>
        </div>
      </div>

      {/* MULTI-TIER SEARCH & FILTER BAR */}
      <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200 flex flex-col gap-3">
        {/* Top row: Status pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase mr-1">Trạng thái:</span>
            <button
              onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-[#0f5b54] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({leads.length})
            </button>
            <button
              onClick={() => { setStatusFilter('chua_lien_he'); setCurrentPage(1); }}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === 'chua_lien_he'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Chưa liên hệ ({newLeadsCount})
            </button>
            <button
              onClick={() => { setStatusFilter('da_lien_he'); setCurrentPage(1); }}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === 'da_lien_he'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              Đã liên hệ ({leads.filter((l) => l.status === 'da_lien_he').length})
            </button>
            <button
              onClick={() => { setStatusFilter('pet'); setCurrentPage(1); }}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                statusFilter === 'pet'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-blue-500">pets</span>
              Nuôi Pet ({petLeadsCount})
            </button>
            <button
              onClick={() => { setStatusFilter('da_coc'); setCurrentPage(1); }}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                statusFilter === 'da_coc'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-emerald-500">verified</span>
              Đã Chốt ({closedLeadsCount})
            </button>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Hiển thị: <strong>{filteredLeads.length}</strong> khách</span>
          </div>
        </div>

        {/* Secondary dropdown grid filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {/* Filter: Kênh MXH */}
          <div className="bg-[#f8f9ff] border border-slate-200/80 rounded-lg px-2.5 py-1.5 flex flex-col justify-center">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Kênh MXH</label>
            <select
              value={channelFilter}
              onChange={(e) => { setChannelFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer py-0.5 truncate"
            >
              <option value="all">Tất cả kênh</option>
              <option value="zalo">Zalo OA / Cá nhân</option>
              <option value="facebook">Facebook / Messenger</option>
              <option value="tiktok">TikTok Lead Form</option>
              <option value="instagram">Instagram Direct</option>
              <option value="telegram">Telegram</option>
              <option value="call">Gọi Hotline</option>
            </select>
          </div>

          {/* Filter: Nhu cầu thuê */}
          <div className="bg-[#f8f9ff] border border-slate-200/80 rounded-lg px-2.5 py-1.5 flex flex-col justify-center">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Nhu Cầu Thuê</label>
            <select
              value={demandFilter}
              onChange={(e) => { setDemandFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer py-0.5 truncate"
            >
              <option value="all">Tất cả nhu cầu</option>
              <option value="co_thue_ngay">Thuê gấp trong tháng</option>
              <option value="khao_sat">Đang cân nhắc / Khảo sát</option>
              <option value="da_coc">Đã duyệt cọc giữ phòng</option>
              <option value="khong_thue">Không thuê (Hủy/Sai số)</option>
            </select>
          </div>

          {/* Filter: Khu vực */}
          <div className="bg-[#f8f9ff] border border-slate-200/80 rounded-lg px-2.5 py-1.5 flex flex-col justify-center">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Cơ Sở / Phòng</label>
            <select
              value={facilityFilter}
              onChange={(e) => { setFacilityFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer py-0.5 truncate"
            >
              <option value="all">Tất cả 2 cơ sở</option>
              <option value="tvh">20 Trương Văn Hiến</option>
              <option value="db">91 Đỗ Bá</option>
            </select>
          </div>

          {/* Filter: Phân khúc giá */}
          <div className="bg-[#f8f9ff] border border-slate-200/80 rounded-lg px-2.5 py-1.5 flex flex-col justify-center">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Tầm Giá Thuê</label>
            <select
              value={priceFilter}
              onChange={(e) => { setPriceFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer py-0.5 truncate"
            >
              <option value="all">Mọi khoảng giá</option>
              <option value="under_5m">&lt; 5.000.000 ₫</option>
              <option value="5m_8m">5.000.000 ₫ - 8.000.000 ₫</option>
              <option value="8m_12m">8.000.000 ₫ - 12.000.000 ₫</option>
              <option value="over_12m">&gt; 12.000.000 ₫</option>
            </select>
          </div>

          {/* Filter: Thú cưng */}
          <div className="bg-[#f8f9ff] border border-slate-200/80 rounded-lg px-2.5 py-1.5 flex flex-col justify-center">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Thú Cưng / Pet</label>
            <select
              value={petFilter}
              onChange={(e) => { setPetFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer py-0.5 truncate"
            >
              <option value="all">Tất cả</option>
              <option value="yes">🐾 Có nuôi thú cưng</option>
              <option value="no">🚫 Không nuôi</option>
            </select>
          </div>

          {/* Filter: Số lần liên hệ */}
          <div className="bg-[#f8f9ff] border border-slate-200/80 rounded-lg px-2.5 py-1.5 flex flex-col justify-center">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Số Lần Đã Gọi</label>
            <select
              value={callFilter}
              onChange={(e) => { setCallFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer py-0.5 truncate"
            >
              <option value="all">Mọi lịch sử gọi</option>
              <option value="0">0 lần (Chưa gọi)</option>
              <option value="1_2">1 - 2 lần gọi</option>
              <option value="3plus">3+ lần (Đang bám sát)</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetFilters}
              type="button"
              className="flex-1 h-full min-h-[44px] rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* MAIN DATA TABLE & METADATA BAR */}
      <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Table Header Tools */}
        <div className="px-4 py-3 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-slate-800">
              Danh sách Lead {effectiveFacility === 'tvh' ? 'Cơ sở 20 Trương Văn Hiến' : effectiveFacility === 'db' ? 'Cơ sở 91 Đỗ Bá' : '2 Cơ Sở (20 Trương Văn Hiến & 91 Đỗ Bá)'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold font-mono">
              Hiển thị {filteredLeads.length} / {leads.length} khách
            </span>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Bạn có chắc muốn xóa ${selectedIds.length} lead đã chọn?`)) {
                    onBulkDelete(selectedIds);
                    setSelectedIds([]);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Xóa {selectedIds.length} data đã chọn
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 self-end sm:self-auto">
            <span>Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1 rounded-md bg-[#f8f9ff] border border-slate-200 text-slate-800 font-medium focus:outline-none cursor-pointer"
            >
              <option value="newest">Thời gian tiếp nhận mới nhất</option>
              <option value="oldest">Cũ nhất trước</option>
              <option value="budget_high">Ngân sách cao nhất</option>
              <option value="budget_low">Ngân sách thấp nhất</option>
              <option value="calls_low">Chưa gọi / Gọi ít nhất</option>
            </select>
          </div>
        </div>

        {/* Table Responsive Wrap */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f8f9ff] text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 select-none">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedLeads.length && paginatedLeads.length > 0}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded text-teal-800 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 font-bold text-slate-700 min-w-[200px]">Khách Hàng & Liên Hệ</th>
                <th className="py-3 px-3">Kênh MXH</th>
                <th className="py-3 px-3">Trạng Thái</th>
                <th className="py-3 px-3">Số Lần Gọi</th>
                <th className="py-3 px-3">Nhu Cầu</th>
                <th className="py-3 px-3 min-w-[170px]">Cơ Sở / Phòng Quan Tâm</th>
                <th className="py-3 px-3">Ngân Sách</th>
                <th className="py-3 px-3 text-center">Thú Cưng</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 px-4 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center">
                      <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-[#0f5b54] mb-3 shadow-sm border border-teal-100">
                        <span className="material-symbols-outlined text-[28px]">folder_open</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-800">Không tìm thấy data khách hàng phù hợp</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Hãy thử điều chỉnh bộ lọc hoặc nhấn nút bên dưới để tạo lead mới.
                      </p>
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={handleResetFilters}
                          type="button"
                          className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                        >
                          Đặt Lại Bộ Lọc
                        </button>
                        <button
                          onClick={onAddLeadClick}
                          type="button"
                          className="px-4 py-2 rounded-lg bg-[#0f5b54] text-white hover:bg-[#00423d] font-bold text-xs shadow-sm"
                        >
                          Thêm Khách Mới
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => {
                  const isSelected = selectedIds.includes(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-[#f8f9ff] transition-colors ${
                        isSelected ? 'bg-teal-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(lead.id)}
                          className="w-4 h-4 rounded text-teal-800 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Khách hàng & SĐT */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => onSelectLead(lead)}
                            className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#0f5b54] font-bold flex items-center justify-center text-xs shrink-0 hover:bg-teal-100 transition-colors"
                          >
                            {lead.fullName.slice(0, 2).toUpperCase()}
                          </button>
                          <div className="flex flex-col min-w-0">
                            <button
                              type="button"
                              onClick={() => onSelectLead(lead)}
                              className="font-bold text-slate-800 hover:text-teal-800 text-left truncate leading-tight"
                            >
                              {lead.fullName}
                            </button>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                              <a
                                href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                                className="text-teal-800 hover:underline font-semibold"
                                title="Bấm để gọi"
                              >
                                {lead.phone}
                              </a>
                              <span className="text-slate-300">·</span>
                              <span className="text-slate-400">{lead.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Kênh MXH */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold capitalize">
                          {lead.channel === 'zalo' && <span className="text-blue-600 font-bold">Zalo</span>}
                          {lead.channel === 'facebook' && <span className="text-blue-700 font-bold">FB</span>}
                          {lead.channel === 'tiktok' && <span className="text-slate-900 font-bold">TikTok</span>}
                          {lead.channel === 'instagram' && <span className="text-pink-600 font-bold">Insta</span>}
                          {lead.channel === 'call' && <span className="text-teal-700 font-bold">Hotline</span>}
                          {lead.channel === 'telegram' && <span className="text-sky-600 font-bold">Tele</span>}
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3 px-3">
                        {lead.status === 'chua_lien_he' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                            Chưa gọi
                          </span>
                        )}
                        {lead.status === 'da_lien_he' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-[#0f5b54] text-[11px] font-semibold border border-teal-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0f5b54]"></span>
                            Đã gọi ({lead.callCount})
                          </span>
                        )}
                        {lead.status === 'hen_goi_lai' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-semibold border border-blue-200">
                            Hẹn gọi lại
                          </span>
                        )}
                      </td>

                      {/* Số lần gọi với nút + / - */}
                      <td className="py-3 px-3">
                        <div className="inline-flex items-center bg-[#f8f9ff] border border-slate-200 rounded p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateCallCount(lead.id, -1)}
                            className="w-5 h-5 rounded hover:bg-white text-slate-600 flex items-center justify-center font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-mono font-bold text-slate-800 text-xs">
                            {lead.callCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateCallCount(lead.id, 1)}
                            className="w-5 h-5 rounded hover:bg-white text-slate-600 flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Nhu cầu */}
                      <td className="py-3 px-3">
                        {lead.demand === 'co_thue_ngay' && (
                          <span className="text-amber-800 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            🔥 Thuê gấp
                          </span>
                        )}
                        {lead.demand === 'da_coc' && (
                          <span className="text-emerald-800 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            ✓ Đã cọc giữ
                          </span>
                        )}
                        {lead.demand === 'khao_sat' && (
                          <span className="text-slate-600 text-[11px]">Cân nhắc</span>
                        )}
                        {lead.demand === 'khong_thue' && (
                          <span className="text-slate-400 text-[11px] line-through">Không thuê</span>
                        )}
                        {lead.demand === 'chua_xac_dinh' && (
                          <span className="text-slate-500 text-[11px]">Chưa rõ</span>
                        )}
                      </td>

                      {/* Cơ sở & Phòng */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-800 block truncate max-w-[200px]" title={lead.roomPreference}>
                          {lead.roomPreference}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {lead.facilityId === 'tvh' ? 'Cơ sở Trương Văn Hiến' : 'Cơ sở Đỗ Bá'}
                        </span>
                      </td>

                      {/* Ngân sách */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-800 tabular-nums">
                        {lead.budget.toLocaleString('vi-VN')} ₫
                      </td>

                      {/* Thú cưng */}
                      <td className="py-3 px-3 text-center">
                        {lead.hasPet ? (
                          <span
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold"
                            title="Khách có nuôi thú cưng"
                          >
                            🐾
                          </span>
                        ) : (
                          <span className="text-slate-300 font-mono">—</span>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onSelectLead(lead)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-800 hover:bg-teal-50 transition-colors"
                            title="Xem chi tiết"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditLead(lead)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            title="Sửa thông tin"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa khách hàng ${lead.fullName}?`)) {
                                onDeleteLead(lead.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Xóa lead"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="px-4 py-3 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Trang {currentPage} / {totalPages}</span>
            <span>·</span>
            <span>Tổng cộng {filteredLeads.length} lead</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-medium"
            >
              Trang trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-md font-semibold text-xs transition-colors ${
                  currentPage === p
                    ? 'bg-[#0f5b54] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-medium"
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>

      {/* QUICK STATS FOOTER CALLOUT / PIPELINE SUMMARY */}
      <div className="rounded-xl bg-[#eff4ff] border border-blue-100 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0f5b54] text-white flex items-center justify-center shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[24px]">support_agent</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-slate-800">Mẹo Telesale Đạt Hiệu Suất Cao</span>
            <p className="text-xs text-slate-600 max-w-2xl mt-0.5 leading-relaxed">
              Lead mới dưới 15 phút có tỷ lệ phản hồi & hẹn lịch xem phòng cao gấp 3.8 lần. Ưu tiên xử lý các khách có nhãn màu cam trước khi bắt đầu ca chiều.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#00423d] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white shadow-sm">
              TN
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white shadow-sm">
              HN
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white shadow-sm">
              QA
            </div>
          </div>
          <span className="text-xs text-slate-600 font-medium">3 chuyên viên đang trực Hotline</span>
        </div>
      </div>
    </div>
  );
};
