import React, { useState } from 'react';
import { ApartmentRoom, FacilityId, RoomStatus } from '../types/crm';

interface RoomsViewProps {
  rooms: ApartmentRoom[];
  selectedFacility: FacilityId;
  onUpdateRoomStatus: (roomId: string, status: RoomStatus) => void;
  onAddRoom: (newRoom: Partial<ApartmentRoom>) => void;
}

export const RoomsView: React.FC<RoomsViewProps> = ({
  rooms,
  selectedFacility,
  onUpdateRoomStatus,
  onAddRoom
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New room state
  const [code, setCode] = useState('P.402');
  const [facilityId, setFacilityId] = useState<'tvh' | 'db'>('tvh');
  const [floor, setFloor] = useState(4);
  const [type, setType] = useState<'Studio' | '1PN' | '2PN'>('Studio');
  const [area, setArea] = useState(32);
  const [rentPrice, setRentPrice] = useState('6.000.000');
  const [petFriendly, setPetFriendly] = useState(true);
  const [hasBalcony, setHasBalcony] = useState(true);

  const filteredRooms = rooms.filter((r) => {
    if (selectedFacility !== 'all' && r.facilityId !== selectedFacility) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    return true;
  });

  const availableCount = rooms.filter((r) => r.status === 'available').length;
  const rentedCount = rooms.filter((r) => r.status === 'rented').length;
  const depositCount = rooms.filter((r) => r.status === 'deposit').length;
  const maintenanceCount = rooms.filter((r) => r.status === 'maintenance').length;
  const occupancyRate = rooms.length > 0 ? Math.round(((rentedCount + depositCount) / rooms.length) * 100) : 0;

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPrice = parseInt(rentPrice.replace(/\D/g, ''), 10) || 6000000;

    onAddRoom({
      code: code.trim(),
      facilityId,
      facilityName: facilityId === 'tvh' ? '20 Trương Văn Hiến' : '91 Đỗ Bá',
      floor,
      type,
      area,
      rentPrice: cleanPrice,
      status: 'available',
      petFriendly,
      hasBalcony
    });

    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100/70 text-[#0f5b54] text-[11px] font-bold uppercase tracking-wider">
              Hiện Trạng Quỹ Phòng
            </span>
            <span className="text-slate-400 text-xs">• Tỷ lệ lấp đầy: {occupancyRate}%</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
            Quản Lý Danh Sách Căn Hộ
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Sơ đồ phòng thực tế tại 2 cơ sở Trương Văn Hiến & Đỗ Bá, hỗ trợ check nhanh phòng trống để tư vấn và chốt cọc.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f5b54] text-white hover:bg-[#00423d] text-xs font-bold shadow-md transition-all self-start lg:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add_home</span>
          Thêm Căn Hộ Mới
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
          <span className="text-[10px] font-bold uppercase text-emerald-800">Phòng Trống (Sẵn sàng)</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">{availableCount}</span>
            <span className="text-xs text-emerald-600 font-semibold">phòng</span>
          </div>
        </div>

        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
          <span className="text-[10px] font-bold uppercase text-blue-800">Đang Có Khách Thuê</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-blue-700 font-mono tabular-nums">{rentedCount}</span>
            <span className="text-xs text-blue-600 font-semibold">phòng</span>
          </div>
        </div>

        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-[10px] font-bold uppercase text-amber-800">Đã Cọc (Chờ Check-in)</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-amber-700 font-mono tabular-nums">{depositCount}</span>
            <span className="text-xs text-amber-600 font-semibold">phòng</span>
          </div>
        </div>

        <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl">
          <span className="text-[10px] font-bold uppercase text-slate-700">Đang Sửa Chữa / Dọn</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-800 font-mono tabular-nums">{maintenanceCount}</span>
            <span className="text-xs text-slate-600 font-semibold">phòng</span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-slate-500 uppercase text-[10px] mr-1">Trạng thái:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              statusFilter === 'all' ? 'bg-[#0f5b54] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả ({rooms.length})
          </button>
          <button
            onClick={() => setStatusFilter('available')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              statusFilter === 'available' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Trống ({availableCount})
          </button>
          <button
            onClick={() => setStatusFilter('rented')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              statusFilter === 'rented' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Đang thuê ({rentedCount})
          </button>
          <button
            onClick={() => setStatusFilter('deposit')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              statusFilter === 'deposit' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Đã cọc ({depositCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Loại phòng:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 font-semibold"
          >
            <option value="all">Tất cả kiểu căn</option>
            <option value="Studio">Căn Studio</option>
            <option value="1PN">Căn 1 Phòng Ngủ</option>
            <option value="2PN">Căn 2 Phòng Ngủ</option>
          </select>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          return (
            <div
              key={room.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:border-teal-700/50 transition-all"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xl font-extrabold text-slate-800">{room.code}</span>
                    <span className="text-[11px] text-slate-400 block">{room.facilityName} · Tầng {room.floor}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      room.status === 'available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : room.status === 'rented'
                        ? 'bg-blue-100 text-blue-800'
                        : room.status === 'deposit'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {room.status === 'available' && '● Trống'}
                    {room.status === 'rented' && '● Đang thuê'}
                    {room.status === 'deposit' && '● Đã cọc'}
                    {room.status === 'maintenance' && '● Đang sửa'}
                  </span>
                </div>

                <div className="mt-3 py-2 border-y border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">{room.type}</span>
                  <span>{room.area} m²</span>
                  {room.hasBalcony && <span className="text-teal-800 font-medium">Ban công</span>}
                  {room.petFriendly && <span title="Cho phép nuôi pet">🐾 Pet OK</span>}
                </div>

                <div className="mt-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Giá niêm yết</span>
                  <div className="text-lg font-extrabold text-[#0f5b54] font-mono tabular-nums">
                    {room.rentPrice.toLocaleString('vi-VN')} ₫
                    <span className="text-xs font-normal text-slate-400 ml-1">/tháng</span>
                  </div>
                </div>

                {/* Tenant info if rented */}
                {room.tenantName && (
                  <div className="mt-3 p-2 bg-[#f8f9ff] rounded-lg text-[11px] text-slate-600 border border-slate-100">
                    <span className="font-semibold text-slate-800 block">{room.tenantName}</span>
                    <span className="font-mono text-slate-500">{room.tenantPhone}</span>
                    {room.contractEnd && (
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Hạn HĐ: {room.contractEnd}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Status Switcher Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] font-semibold text-slate-400">Đổi trạng thái:</span>
                <select
                  value={room.status}
                  onChange={(e) => onUpdateRoomStatus(room.id, e.target.value as RoomStatus)}
                  className="px-2 py-1 bg-white border border-slate-200 rounded font-semibold text-[11px] text-slate-700 cursor-pointer focus:outline-none"
                >
                  <option value="available">Trống</option>
                  <option value="rented">Đang thuê</option>
                  <option value="deposit">Đặt cọc</option>
                  <option value="maintenance">Sửa chữa</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#eff4ff] border-b border-blue-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800">Thêm Căn Hộ Vào Hệ Thống</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateRoom} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mã Phòng *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="P.402"
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cơ Sở</label>
                  <select
                    value={facilityId}
                    onChange={(e) => setFacilityId(e.target.value as 'tvh' | 'db')}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="tvh">20 Trương Văn Hiến</option>
                    <option value="db">91 Đỗ Bá</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tầng</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={floor}
                    onChange={(e) => setFloor(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kiểu Căn</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'Studio' | '1PN' | '2PN')}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Studio">Studio</option>
                    <option value="1PN">1PN</option>
                    <option value="2PN">2PN</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Diện Tích (m²)</label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(parseInt(e.target.value, 10) || 30)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Giá Thuê Niêm Yết (VNĐ/tháng)</label>
                <input
                  type="text"
                  required
                  value={rentPrice}
                  onChange={(e) => setRentPrice(e.target.value)}
                  placeholder="6.000.000"
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasBalcony}
                    onChange={(e) => setHasBalcony(e.target.checked)}
                    className="w-4 h-4 text-teal-800 rounded"
                  />
                  <span>Có ban công thoáng mát</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={petFriendly}
                    onChange={(e) => setPetFriendly(e.target.checked)}
                    className="w-4 h-4 text-teal-800 rounded"
                  />
                  <span>Cho nuôi thú cưng 🐾</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0f5b54] hover:bg-[#00423d] text-white font-bold shadow-sm"
                >
                  Lưu Căn Hộ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
