import React, { useState, useEffect } from 'react';
import { Lead, SocialChannel, ContactStatus, DemandStatus } from '../types/crm';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (leadData: Partial<Lead>) => void;
  initialLead?: Lead | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLead
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<SocialChannel>('zalo');
  const [channelAccount, setChannelAccount] = useState('');
  const [status, setStatus] = useState<ContactStatus>('chua_lien_he');
  const [demand, setDemand] = useState<DemandStatus>('co_thue_ngay');
  const [roomPreference, setRoomPreference] = useState('20 Trương Văn Hiến - Căn Studio');
  const [budget, setBudget] = useState('7.000.000');
  const [hasPet, setHasPet] = useState(false);
  const [callCount, setCallCount] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialLead) {
      setFullName(initialLead.fullName);
      setPhone(initialLead.phone);
      setChannel(initialLead.channel);
      setChannelAccount(initialLead.channelAccount || '');
      setStatus(initialLead.status);
      setDemand(initialLead.demand);
      setRoomPreference(initialLead.roomPreference);
      setBudget(initialLead.budget.toLocaleString('vi-VN'));
      setHasPet(initialLead.hasPet);
      setCallCount(initialLead.callCount);
      setNotes(initialLead.notes);
    } else {
      setFullName('');
      setPhone('');
      setChannel('zalo');
      setChannelAccount('');
      setStatus('chua_lien_he');
      setDemand('co_thue_ngay');
      setRoomPreference('20 Trương Văn Hiến - Căn Studio');
      setBudget('7.000.000');
      setHasPet(false);
      setCallCount(0);
      setNotes('');
    }
  }, [initialLead, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    // determine facility
    const facilityId = roomPreference.includes('91 Đỗ Bá') ? 'db' : 'tvh';
    const cleanBudget = parseInt(budget.replace(/\D/g, ''), 10) || 6000000;

    onSave({
      id: initialLead?.id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      channel,
      channelAccount: channelAccount.trim(),
      status,
      demand,
      facilityId,
      roomPreference,
      budget: cleanBudget,
      hasPet,
      callCount,
      notes: notes.trim(),
      createdAt: initialLead?.createdAt || new Date().toISOString().slice(0, 16).replace('T', ' ')
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#eff4ff] flex items-center justify-between border-b border-blue-100/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f5b54] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 leading-tight">
                {initialLead ? 'Chỉnh Sửa Thông Tin Khách Hàng' : 'Thu Thập Data Khách Hàng Thuê'}
              </h3>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Biểu Mẫu Nhập Liệu Chuẩn CRM
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} id="leadEntryForm" className="p-6 overflow-y-auto space-y-4 text-sm">
          {/* Field group: Basic Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs text-slate-700 flex items-center gap-1">
                Họ và Tên Khách Hàng <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="vd: Nguyễn Thị Thảo Nguyên"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f9ff] text-slate-800 text-sm border border-slate-200 focus:border-teal-700 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs text-slate-700 flex items-center gap-1">
                Số Điện Thoại / Zalo <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  phone
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="vd: 0988 123 456"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#f8f9ff] text-slate-800 text-sm border border-slate-200 focus:border-teal-700 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Field group: Phân Loại Trạng Thái & Nhu Cầu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs text-slate-700">Trạng Thái Liên Hệ Ban Đầu</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContactStatus)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f9ff] text-slate-800 text-sm border border-slate-200 focus:border-teal-700 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="chua_lien_he">Chưa liên hệ (Tạo mới cần gọi ngay)</option>
                <option value="da_lien_he">Đã liên hệ sơ bộ qua tin nhắn / gọi điện</option>
                <option value="hen_goi_lai">Hẹn gọi lại sau</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs text-slate-700">Tình Trạng Nhu Cầu Thuê</label>
              <select
                value={demand}
                onChange={(e) => setDemand(e.target.value as DemandStatus)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f9ff] text-slate-800 text-sm border border-slate-200 focus:border-teal-700 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="co_thue_ngay">Có nhu cầu thuê gấp trong tháng</option>
                <option value="khao_sat">Đang cân nhắc / Khảo sát thị trường</option>
                <option value="da_coc">Đã duyệt cọc giữ phòng</option>
                <option value="chua_xac_dinh">Chưa xác định cụ thể</option>
                <option value="khong_thue">Không thuê (Hỏi giúp / Sai số)</option>
              </select>
            </div>
          </div>

          {/* Field group: Kênh MXH & Nguồn Lead */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs text-slate-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-teal-700">share</span>
                Kênh MXH Liên Hệ <span className="text-red-500 font-bold">*</span>
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as SocialChannel)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f9ff] text-slate-800 text-sm border border-slate-200 focus:border-teal-700 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="zalo">Zalo (Cá nhân / OA)</option>
                <option value="facebook">Facebook Messenger / Fanpage</option>
                <option value="tiktok">TikTok Lead Form / Video</option>
                <option value="instagram">Instagram Direct</option>
                <option value="telegram">Telegram</option>
                <option value="call">Gọi Hotline Trực Tiếp</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs text-slate-700">
                Tài Khoản MXH / Link Profile / Ghi Chú Nguồn
              </label>
              <input
                type="text"
                value={channelAccount}
                onChange={(e) => setChannelAccount(e.target.value)}
                placeholder="vd: @username, link Zalo hoặc tên nick FB..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f9ff] text-slate-800 text-sm border border-slate-200 focus:border-teal-700 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Field group: Cơ Sở & Ngân Sách */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs text-slate-700 flex items-center gap-1">
                Cơ Sở & Phòng Mong Muốn <span className="text-red-500 font-bold">*</span>
              </label>
              <select
                value={roomPreference}
                onChange={(e) => setRoomPreference(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f9ff] text-slate-800 text-sm border border-slate-200 focus:border-teal-700 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="20 Trương Văn Hiến - Tất cả loại phòng">20 Trương Văn Hiến - Tất cả loại phòng</option>
                <option value="20 Trương Văn Hiến - Căn Studio">20 Trương Văn Hiến - Căn Studio tiện nghi</option>
                <option value="20 Trương Văn Hiến - Căn 1PN ban công">20 Trương Văn Hiến - Căn 1PN ban công</option>
                <option value="20 Trương Văn Hiến - Căn 1PN / 2PN">20 Trương Văn Hiến - Căn 1PN / 2PN</option>
                <option value="91 Đỗ Bá - Tất cả phòng">91 Đỗ Bá - Tất cả loại phòng</option>
                <option value="91 Đỗ Bá - Studio ban công">91 Đỗ Bá - Studio thoáng mát</option>
                <option value="91 Đỗ Bá - Căn 1PN Full đồ">91 Đỗ Bá - Căn 1PN Full đồ</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs text-slate-700">Khoảng Giá Phòng Dự Kiến (VNĐ)</label>
              <div className="relative">
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="vd: 7.000.000"
                  className="w-full pl-3.5 pr-14 py-2.5 rounded-lg bg-[#f8f9ff] text-slate-800 text-sm border border-slate-200 focus:border-teal-700 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                  ₫/tháng
                </span>
              </div>
            </div>
          </div>

          {/* Field group: Pet Policy */}
          <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-blue-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-blue-700">pets</span>
                Khách có nuôi thú cưng (Pet)?
              </span>
              <span className="text-[11px] text-slate-500">Phân bổ phòng có ban công hoặc chính sách chấp thuận pet</span>
            </div>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="pet_status"
                  checked={!hasPet}
                  onChange={() => setHasPet(false)}
                  className="w-4 h-4 text-teal-800 focus:ring-0"
                />
                <span className="text-xs font-medium text-slate-700">Không nuôi</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="pet_status"
                  checked={hasPet}
                  onChange={() => setHasPet(true)}
                  className="w-4 h-4 text-teal-800 focus:ring-0"
                />
                <span className="text-xs font-bold text-blue-800">Có nuôi pet 🐾</span>
              </label>
            </div>
          </div>

          {/* Counter: Số lần đã liên hệ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1">
            <div className="flex flex-col">
              <label className="font-semibold text-xs text-slate-700">Số lần liên hệ trước</label>
              <span className="text-[11px] text-slate-500">Ghi nhận lần tương tác telesale</span>
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <div className="inline-flex items-center bg-[#f8f9ff] border border-slate-200 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setCallCount(Math.max(0, callCount - 1))}
                  className="w-8 h-8 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={callCount}
                  onChange={(e) => setCallCount(parseInt(e.target.value, 10) || 0)}
                  className="w-12 text-center bg-transparent text-slate-800 font-bold text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setCallCount(callCount + 1)}
                  className="w-8 h-8 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-sm"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-500">lần gọi điện thoại / Zalo</span>
            </div>
          </div>

          {/* Detailed Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-xs text-slate-700">Ghi Chú Nhu Cầu Chi Tiết Của Khách</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="vd: Khách cần tầng cao thoáng mát, dọn vào đầu tháng tới, nuôi 1 bé mèo lông ngắn đã tiêm phòng, thích view nội khu yên tĩnh..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#f8f9ff] text-slate-800 text-sm border border-slate-200 focus:border-teal-700 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 resize-none"
            ></textarea>
          </div>
        </form>

        {/* Modal Footer Action */}
        <div className="px-6 py-4 bg-[#eff4ff] border-t border-blue-100/70 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#0f5b54]">lock</span>
            Tự động gắn thẻ Lead ID hệ thống
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              form="leadEntryForm"
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#0f5b54] text-white hover:bg-[#00423d] font-semibold text-xs shadow-sm transition-all"
            >
              {initialLead ? 'Cập Nhật Khách Hàng' : 'Lưu Khách Hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
