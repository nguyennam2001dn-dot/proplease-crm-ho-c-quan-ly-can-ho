import React, { useState } from 'react';
import { FacilityId } from '../types/crm';

interface TopHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedFacility: FacilityId;
  onChangeFacility: (f: FacilityId) => void;
  onOpenMobileMenu?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedFacility,
  onChangeFacility,
  onOpenMobileMenu
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHotline, setShowHotline] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-white/95 backdrop-blur-xl z-40 border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="w-full h-16 px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Search & Facility */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            title="Mở menu"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          {/* Search bar */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm khách thuê, SĐT, mã căn (VD: P9.1402)..."
              className="w-full pl-9 pr-4 py-2 bg-[#eff4ff] hover:bg-[#e6eeff] focus:bg-white border border-transparent focus:border-teal-700/30 rounded-lg text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Facility quick dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#eff4ff] border border-blue-100/70 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="material-symbols-outlined text-slate-500 text-[18px]">
              location_city
            </span>
            <select
              value={selectedFacility}
              onChange={(e) => onChangeFacility(e.target.value as FacilityId)}
              className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer max-w-[210px] truncate"
            >
              <option value="all">Tất cả 2 cơ sở (TVH & Đỗ Bá)</option>
              <option value="tvh">Cơ sở 1: 20 Trương Văn Hiến</option>
              <option value="db">Cơ sở 2: 91 Đỗ Bá</option>
            </select>
          </div>
        </div>

        {/* Right: Actions & User profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notification Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowHotline(false);
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              title="Thông báo hệ thống"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 px-4 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-800">Thông báo mới</span>
                  <span className="text-[11px] text-teal-700 font-semibold cursor-pointer hover:underline">
                    Đã đọc hết
                  </span>
                </div>
                <div className="mt-2 space-y-2.5 max-h-64 overflow-y-auto">
                  <div className="p-2 bg-blue-50/70 rounded-lg">
                    <p className="font-semibold text-slate-800">Lead mới cần liên hệ</p>
                    <p className="text-slate-600 text-[11px]">Nguyễn Thị Thảo Nguyên vừa để lại SĐT qua Zalo OA.</p>
                    <span className="text-[10px] text-slate-400">2 phút trước</span>
                  </div>
                  <div className="p-2 hover:bg-slate-50 rounded-lg">
                    <p className="font-semibold text-slate-800">Lịch xem phòng lúc 16:00</p>
                    <p className="text-slate-600 text-[11px]">Khách Lê Hoàng Minh đến xem phòng P.301 tại 91 Đỗ Bá.</p>
                    <span className="text-[10px] text-slate-400">1 giờ trước</span>
                  </div>
                  <div className="p-2 hover:bg-slate-50 rounded-lg">
                    <p className="font-semibold text-slate-800">Thanh toán hóa đơn tháng 10</p>
                    <p className="text-slate-600 text-[11px]">Phòng P.101 (20 TVH) đã chuyển khoản 6.381.000đ.</p>
                    <span className="text-[10px] text-slate-400">Hôm nay, 14:22</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hotline / Support Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowHotline(!showHotline);
                setShowNotifications(false);
              }}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              title="Tổng đài trực ban"
            >
              <span className="material-symbols-outlined text-[20px]">headset_mic</span>
            </button>

            {showHotline && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3.5 z-50 text-xs">
                <span className="font-bold text-slate-800 block mb-1">Hotline Quản Lý Tòa Nhà</span>
                <p className="text-slate-600 text-[11px] mb-2.5">
                  Đang có 3 chuyên viên trực ban tiếp nhận cuộc gọi:
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">20 Trương Văn Hiến:</span>
                    <a href="tel:0905123456" className="text-teal-700 font-bold hover:underline">
                      0905 123 456
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">91 Đỗ Bá:</span>
                    <a href="tel:0935987654" className="text-teal-700 font-bold hover:underline">
                      0935 987 654
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200"></div>

          {/* Profile */}
          <div className="flex items-center gap-2 pl-1">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-semibold text-xs text-slate-800 leading-tight">Nguyen Thanh Nam</span>
              <span className="text-[10px] text-slate-500 font-medium">Telesale Lead & QLVH</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#00423d] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-teal-100">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
