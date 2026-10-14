import React from 'react';
import { Lead } from '../types/crm';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, updates: Partial<Lead>) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onUpdateStatus
}) => {
  if (!isOpen || !lead) return null;

  const handleLogCall = () => {
    onUpdateStatus(lead.id, {
      callCount: lead.callCount + 1,
      status: 'da_lien_he',
      lastContactAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    });
  };

  const handleDeposit = () => {
    onUpdateStatus(lead.id, {
      demand: 'da_coc',
      status: 'da_lien_he',
      notes: `${lead.notes}\n[${new Date().toLocaleDateString('vi-VN')}]: Đã chốt cọc giữ phòng.`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#eff4ff] flex items-center justify-between border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#0f5b54] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {lead.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-800">{lead.fullName}</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                  {lead.id}
                </span>
              </div>
              <p className="text-xs text-slate-500">Tiếp nhận: {lead.createdAt}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Contact quick actions */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${lead.phone.replace(/\s+/g, '')}`}
              onClick={handleLogCall}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-teal-50 text-[#00423d] hover:bg-teal-100 font-semibold border border-teal-200/80 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              Gọi Ngay ({lead.phone})
            </a>
            <a
              href={`https://zalo.me/${lead.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold border border-blue-200/80 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              Nhắn Tin Zalo
            </a>
          </div>

          {/* Details list */}
          <div className="bg-[#f8f9ff] rounded-xl p-4 border border-slate-200/80 space-y-2.5">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Trạng thái liên hệ:</span>
              <span className="font-semibold text-slate-800">
                {lead.status === 'chua_lien_he' && '🟡 Chưa liên hệ (Cần gọi ngay)'}
                {lead.status === 'da_lien_he' && '🟢 Đã liên hệ'}
                {lead.status === 'hen_goi_lai' && '🔵 Hẹn gọi lại'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Nhu cầu thuê:</span>
              <span className="font-semibold text-slate-800">
                {lead.demand === 'co_thue_ngay' && '🔥 Thuê gấp trong tháng'}
                {lead.demand === 'khao_sat' && 'Đang cân nhắc / Khảo sát'}
                {lead.demand === 'da_coc' && '🎉 Đã duyệt cọc giữ phòng'}
                {lead.demand === 'chua_xac_dinh' && 'Chưa xác định'}
                {lead.demand === 'khong_thue' && 'Hủy / Không thuê'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Cơ sở & Loại phòng:</span>
              <span className="font-semibold text-slate-800">{lead.roomPreference}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Ngân sách dự kiến:</span>
              <span className="font-bold text-teal-800 font-mono text-[13px]">
                {lead.budget.toLocaleString('vi-VN')} ₫/tháng
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Thú cưng (Pet):</span>
              <span className={`font-semibold ${lead.hasPet ? 'text-blue-700 font-bold' : 'text-slate-600'}`}>
                {lead.hasPet ? '🐾 Có nuôi thú cưng' : '🚫 Không nuôi'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Kênh tiếp nhận:</span>
              <span className="font-semibold text-slate-800 uppercase">{lead.channel} {lead.channelAccount ? `(${lead.channelAccount})` : ''}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Số lần gọi telesale:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm font-mono">{lead.callCount} lần</span>
                <button
                  onClick={handleLogCall}
                  className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-teal-50 text-teal-800 text-[11px] font-semibold"
                >
                  + Ghi nhận 1 cuộc gọi
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
            <span className="font-bold text-amber-900 block mb-1">Ghi chú nhu cầu & tư vấn:</span>
            <p className="text-slate-700 whitespace-pre-line leading-relaxed">{lead.notes || 'Chưa có ghi chú'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Bạn có chắc chắn muốn xóa lead này?')) {
                onDelete(lead.id);
                onClose();
              }
            }}
            className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 font-medium text-xs flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            Xóa Lead
          </button>
          <div className="flex items-center gap-2">
            {lead.demand !== 'da_coc' && (
              <button
                type="button"
                onClick={handleDeposit}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Chuyển Đã Cọc Phòng
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onEdit(lead);
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-[#0f5b54] hover:bg-[#00423d] text-white font-semibold text-xs transition-colors shadow-sm"
            >
              Chỉnh Sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
