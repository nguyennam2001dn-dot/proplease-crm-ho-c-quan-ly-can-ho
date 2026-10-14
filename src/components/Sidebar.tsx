import React from 'react';
import { FacilityId } from '../types/crm';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  selectedFacility: FacilityId;
  onChangeFacility: (f: FacilityId) => void;
  leadCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  selectedFacility,
  onChangeFacility,
  leadCount
}) => {
  const navItems = [
    { id: 'data-khach-hang', label: 'Data Khách Hàng', icon: 'group' },
    { id: 'lich-van-hanh', label: 'Lịch Vận Hành', icon: 'calendar_month' },
    { id: 'bang-thu-phi-dien-nuoc', label: 'Thu Phí Điện Nước', icon: 'receipt_long' },
    { id: 'quan-ly-can-ho', label: 'Quản Lý Căn Hộ', icon: 'holiday_village' },
    { id: 'bao-cao-doanh-thu', label: 'Báo Cáo Doanh Thu', icon: 'monitoring' },
    { id: 'cai-dat', label: 'Cài Đặt Hệ Thống', icon: 'settings' }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-white z-50 flex flex-col border-r border-slate-200 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      {/* Brand Logo */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-[#0f5b54] flex items-center justify-center text-white shadow-sm">
          <span className="material-symbols-outlined text-[22px]">apartment</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[16px] text-[#00423d] tracking-tight leading-tight">PROPLEASE CRM</span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">manager apartment</span>
        </div>
      </div>

      {/* Facility Selector */}
      <div className="px-4 py-3">
        <div className="bg-[#eff4ff] rounded-lg p-2.5 flex items-center justify-between border border-blue-100/60">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#0f5b54] animate-pulse shrink-0"></span>
            <select
              value={selectedFacility}
              onChange={(e) => onChangeFacility(e.target.value as FacilityId)}
              className="bg-transparent text-[#121c2a] text-xs font-semibold focus:outline-none cursor-pointer w-full truncate"
            >
              <option value="all">2 Cơ sở: Trương Văn Hiến & Đỗ Bá</option>
              <option value="tvh">Cơ sở 1: 20 Trương Văn Hiến</option>
              <option value="db">Cơ sở 2: 91 Đỗ Bá</option>
            </select>
          </div>
          <span className="text-[10px] font-bold text-slate-400 ml-1 shrink-0">v2.4</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-[#0f5b54] text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-[#eff4ff] hover:text-[#00423d] font-medium text-sm'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-slate-500'}`}>
                {item.icon}
              </span>
              <span className="text-[13.5px] leading-snug">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Daily Lead Quota Card */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-[#eff4ff] rounded-xl p-3.5 flex flex-col gap-1.5 border border-blue-100/60">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Định Mức Lead Ngày</span>
            <span className="text-xs text-[#00423d] font-bold">{leadCount}/25</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0f5b54] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((leadCount / 25) * 100))}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span>Tỷ lệ chốt hợp đồng:</span>
            <span className="font-semibold text-teal-800">28%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
