import React, { useState } from 'react';
import { OperationalEvent, FacilityId, EventType } from '../types/crm';

interface ScheduleViewProps {
  events: OperationalEvent[];
  selectedFacility: FacilityId;
  onAddEvent: (newEvent: Partial<OperationalEvent>) => void;
  onUpdateEventStatus: (id: string, status: 'upcoming' | 'completed' | 'cancelled') => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  events,
  selectedFacility,
  onAddEvent,
  onUpdateEventStatus
}) => {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('viewing');
  const [roomCode, setRoomCode] = useState('P.301');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 10));
  const [timeSlot, setTimeSlot] = useState('15:00 - 15:30');
  const [assignedStaff, setAssignedStaff] = useState('Nguyễn Thành Nam');
  const [notes, setNotes] = useState('');

  const filteredEvents = events.filter((e) => {
    if (selectedFacility !== 'all' && e.facilityId !== selectedFacility) return false;
    if (typeFilter !== 'all' && e.type !== typeFilter) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !customerName.trim()) return;

    onAddEvent({
      title: title.trim(),
      type,
      roomCode,
      facilityId: selectedFacility === 'db' ? 'db' : 'tvh',
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      dateTime,
      timeSlot,
      status: 'upcoming',
      assignedStaff,
      notes: notes.trim()
    });

    setTitle('');
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100/70 text-[#0f5b54] text-[11px] font-bold uppercase tracking-wider">
              Điều Phối Tác Vụ
            </span>
            <span className="text-slate-400 text-xs">• Lịch xem phòng, check-in & bảo trì</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
            Lịch Vận Hành & Khảo Sát Thực Tế
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Sắp xếp nhân sự dẫn khách xem căn hộ mẫu, kiểm tra chỉ số điện nước bàn giao và lịch bảo dưỡng định kỳ.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f5b54] text-white hover:bg-[#00423d] text-xs font-bold shadow-md transition-all self-start lg:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add_task</span>
          Lên Lịch Hẹn Mới
        </button>
      </div>

      {/* Type filter bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <span className="font-semibold text-slate-500 uppercase text-[10px] mr-1">Phân loại sự kiện:</span>
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            typeFilter === 'all' ? 'bg-[#0f5b54] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Tất cả ({events.length})
        </button>
        <button
          onClick={() => setTypeFilter('viewing')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
            typeFilter === 'viewing' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">visibility</span>
          Dẫn xem phòng ({events.filter((e) => e.type === 'viewing').length})
        </button>
        <button
          onClick={() => setTypeFilter('checkin')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
            typeFilter === 'checkin' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">key</span>
          Check-in nhận phòng ({events.filter((e) => e.type === 'checkin').length})
        </button>
        <button
          onClick={() => setTypeFilter('checkout')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
            typeFilter === 'checkout' ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">logout</span>
          Nghiệm thu trả phòng ({events.filter((e) => e.type === 'checkout').length})
        </button>
        <button
          onClick={() => setTypeFilter('maintenance')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
            typeFilter === 'maintenance' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">build</span>
          Bảo trì kỹ thuật ({events.filter((e) => e.type === 'maintenance').length})
        </button>
      </div>

      {/* Events timeline / list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((evt) => {
          const isDone = evt.status === 'completed';

          return (
            <div
              key={evt.id}
              className={`bg-white rounded-xl border p-4 flex flex-col justify-between shadow-sm transition-all ${
                isDone ? 'border-slate-200 opacity-70 bg-slate-50/50' : 'border-slate-200 hover:border-teal-700/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        evt.type === 'viewing'
                          ? 'bg-blue-100 text-blue-800'
                          : evt.type === 'checkin'
                          ? 'bg-emerald-100 text-emerald-800'
                          : evt.type === 'checkout'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {evt.type === 'viewing' && 'Dẫn Xem Phòng'}
                      {evt.type === 'checkin' && 'Check-in'}
                      {evt.type === 'checkout' && 'Trả Phòng'}
                      {evt.type === 'maintenance' && 'Bảo Trì'}
                    </span>
                    <span className="font-mono font-bold text-teal-800">{evt.roomCode}</span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 font-semibold">{evt.dateTime}</span>
                </div>

                <div className="mt-3">
                  <h4 className={`font-bold text-sm text-slate-800 ${isDone ? 'line-through text-slate-500' : ''}`}>
                    {evt.title}
                  </h4>
                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">schedule</span>
                      <span className="font-semibold">{evt.timeSlot}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">person</span>
                      <span>
                        {evt.customerName} {evt.customerPhone ? `(${evt.customerPhone})` : ''}
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">badge</span>
                      <span>Phụ trách: <strong>{evt.assignedStaff}</strong></span>
                    </p>
                  </div>

                  {evt.notes && (
                    <div className="mt-2.5 p-2 bg-[#f8f9ff] rounded-lg text-[11px] text-slate-600 border border-slate-100 italic">
                      "{evt.notes}"
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span
                  className={`text-[10px] font-bold ${
                    isDone ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {isDone ? '✓ ĐÃ HOÀN THÀNH' : '⏳ SẮP DIỄN RA'}
                </span>

                <div className="flex items-center gap-2">
                  {!isDone ? (
                    <button
                      type="button"
                      onClick={() => onUpdateEventStatus(evt.id, 'completed')}
                      className="px-2.5 py-1 rounded-md bg-[#0f5b54] hover:bg-[#00423d] text-white font-semibold text-xs shadow-sm"
                    >
                      Hoàn thành
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onUpdateEventStatus(evt.id, 'upcoming')}
                      className="px-2 py-0.5 rounded text-slate-400 hover:text-slate-600 text-[11px]"
                    >
                      Mở lại
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal create event */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#eff4ff] border-b border-blue-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800">Đặt Lịch Hẹn / Công Việc Mới</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tiêu Đề Công Việc *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="vd: Dẫn khách xem căn Studio tầng 3"
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Loại Công Việc</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  >
                    <option value="viewing">Dẫn khách xem phòng</option>
                    <option value="checkin">Bàn giao & Check-in</option>
                    <option value="checkout">Nghiệm thu & Trả phòng</option>
                    <option value="maintenance">Bảo trì kỹ thuật</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mã Phòng</label>
                  <input
                    type="text"
                    required
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    placeholder="vd: P.301"
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tên Khách Hàng *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="vd: Lê Hoàng Minh"
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">SĐT Khách Hàng</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="vd: 0912 345 678"
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ngày Hẹn</label>
                  <input
                    type="date"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Khung Giờ</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    placeholder="15:00 - 15:30"
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nhân Viên Phụ Trách</label>
                <select
                  value={assignedStaff}
                  onChange={(e) => setAssignedStaff(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                >
                  <option value="Nguyễn Thành Nam">Nguyễn Thành Nam (Telesale Lead)</option>
                  <option value="Trần Hoài Nam">Trần Hoài Nam (Quản lý 91 Đỗ Bá)</option>
                  <option value="Kỹ thuật viên Tùng">Kỹ thuật viên Tùng (Bảo trì cơ điện)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Ghi Chú Chi Tiết</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Yêu cầu kiểm tra nội thất, chuẩn bị mẫu hợp đồng..."
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 focus:outline-none resize-none"
                ></textarea>
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
                  Lưu Lịch Hẹn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
