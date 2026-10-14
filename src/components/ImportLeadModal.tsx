import React, { useState } from 'react';
import { Lead } from '../types/crm';

interface ImportLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newLeads: Partial<Lead>[]) => void;
}

export const ImportLeadModal: React.FC<ImportLeadModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [pasteData, setPasteData] = useState('');
  const [targetFacility, setTargetFacility] = useState<'tvh' | 'db'>('tvh');

  if (!isOpen) return null;

  const handleProcessImport = () => {
    if (!pasteData.trim()) return;

    const lines = pasteData.trim().split('\n');
    const parsed: Partial<Lead>[] = [];

    lines.forEach((line) => {
      // Format can be: Name, Phone, Budget, Notes or Name - Phone
      const parts = line.split(/[,;\t|]/).map((p) => p.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        const fullName = parts[0];
        const phone = parts[1];
        const budgetStr = parts[2] ? parts[2].replace(/\D/g, '') : '';
        const budget = parseInt(budgetStr, 10) || 6500000;
        const notes = parts[3] || 'Imported từ danh sách Excel/CSV';
        const hasPet = line.toLowerCase().includes('pet') || line.toLowerCase().includes('mèo') || line.toLowerCase().includes('chó');

        parsed.push({
          fullName,
          phone,
          channel: 'call',
          status: 'chua_lien_he',
          demand: 'co_thue_ngay',
          facilityId: targetFacility,
          roomPreference: targetFacility === 'tvh' ? '20 Trương Văn Hiến - Căn Studio' : '91 Đỗ Bá - Studio ban công',
          budget,
          hasPet,
          callCount: 0,
          notes,
          createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
        });
      }
    });

    if (parsed.length > 0) {
      onImport(parsed);
      onClose();
    }
  };

  const handleLoadSample = () => {
    setPasteData(
      `Phan Anh Khoa, 0905 111 222, 6500000, Cần phòng thoáng, dọn vào cuối tuần
Trịnh Thu Hằng, 0983 456 789, 8000000, Nuôi 1 bé cún nhỏ, cần ban công
Hoàng Đình Thắng, 0914 888 999, 5500000, Khách công tác 6 tháng tại Đà Nẵng`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        <div className="px-6 py-4 bg-[#eff4ff] flex items-center justify-between border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f5b54] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">Nhập Danh Sách Lead Hàng Loạt</h3>
              <p className="text-xs text-slate-500">Hỗ trợ dán dữ liệu CSV, Excel hoặc văn bản</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-700">Chọn Cơ Sở Phân Bổ</label>
            <select
              value={targetFacility}
              onChange={(e) => setTargetFacility(e.target.value as 'tvh' | 'db')}
              className="px-3 py-1.5 bg-[#f8f9ff] border border-slate-200 rounded-lg font-medium text-slate-800"
            >
              <option value="tvh">Cơ sở 1: 20 Trương Văn Hiến</option>
              <option value="db">Cơ sở 2: 91 Đỗ Bá</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Định dạng mỗi dòng: Họ Tên, SĐT, Ngân Sách, Ghi chú</span>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-teal-700 font-semibold hover:underline"
            >
              Dán dữ liệu mẫu
            </button>
          </div>

          <textarea
            rows={6}
            value={pasteData}
            onChange={(e) => setPasteData(e.target.value)}
            placeholder="Nguyễn Văn A, 0905123456, 7000000, Cần phòng 1PN ban công&#10;Trần Thị B, 0912987654, 5500000, Studio nuôi pet"
            className="w-full p-3 font-mono text-xs bg-[#f8f9ff] border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700 focus:bg-white resize-none"
          ></textarea>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800">
            Hệ thống sẽ tự động tạo ID chuẩn CRM, phân loại kênh Hotline và đánh dấu trạng thái "Chưa liên hệ" để đội Telesale bắt đầu gọi ngay.
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-100"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleProcessImport}
            disabled={!pasteData.trim()}
            className="px-5 py-2 rounded-lg bg-[#0f5b54] text-white font-semibold text-xs hover:bg-[#00423d] disabled:opacity-50 transition-all shadow-sm"
          >
            Bắt Đầu Import Lead
          </button>
        </div>
      </div>
    </div>
  );
};
