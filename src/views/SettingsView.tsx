import React, { useState } from 'react';
import { facilities } from '../data/mockData';

export const SettingsView: React.FC = () => {
  const [elecPrice, setElecPrice] = useState('3.800');
  const [waterPrice, setWaterPrice] = useState('25.000');
  const [internetFee, setInternetFee] = useState('100.000');
  const [cleaningFee, setCleaningFee] = useState('80.000');
  const [parkingFee, setParkingFee] = useState('100.000');
  const [dailyQuota, setDailyQuota] = useState('25');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100/70 text-[#0f5b54] text-[11px] font-bold uppercase tracking-wider">
              Cấu Hình Quản Trị
            </span>
            <span className="text-slate-400 text-xs">• Cập nhật các thông số vận hành</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
            Cài Đặt Hệ Thống & Biểu Phí Dịch Vụ
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Thiết lập đơn giá điện nước sinh hoạt, định mức lead telesale mỗi ngày và tài khoản ngân hàng thụ hưởng VietQR.
          </p>
        </div>

        {savedNotice && (
          <span className="px-3.5 py-2 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 animate-in fade-in">
            ✓ Đã lưu cài đặt thành công!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Card 1: Facility Information */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <span className="material-symbols-outlined text-teal-800 text-[20px]">apartment</span>
            <h3 className="font-bold text-sm text-slate-800">Thông Tin 2 Cơ Sở Trực Thuộc</h3>
          </div>

          <div className="space-y-4">
            {facilities.map((f) => (
              <div key={f.id} className="p-3.5 bg-[#f8f9ff] rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">{f.name}</span>
                  <span className="px-2 py-0.5 bg-teal-50 text-teal-800 font-bold rounded font-mono text-[10px]">
                    {f.totalRooms} căn hộ
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">{f.address}</p>
                <div className="pt-1 grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Quản lý:</span>
                    <strong>{f.manager}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Hotline trực:</span>
                    <strong className="text-teal-800">{f.hotline}</strong>
                  </div>
                </div>
                <div className="pt-1.5 border-t border-slate-200/60 text-[11px] text-slate-600">
                  <span className="text-slate-400">Tài khoản VietQR: </span>
                  <strong className="font-mono">{f.bankAccount.accountNumber}</strong> ({f.bankAccount.bankName})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Utility Price Rates */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <span className="material-symbols-outlined text-teal-800 text-[20px]">bolt</span>
            <h3 className="font-bold text-sm text-slate-800">Biểu Phí Điện Nước & Dịch Vụ Cố Định</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Đơn giá Điện sinh hoạt (VNĐ / kWh)
              </label>
              <input
                type="text"
                value={elecPrice}
                onChange={(e) => setElecPrice(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg font-mono text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Đã bao gồm VAT & khấu hao trạm biến áp</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Đơn giá Nước sinh hoạt (VNĐ / m³)
              </label>
              <input
                type="text"
                value={waterPrice}
                onChange={(e) => setWaterPrice(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg font-mono text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Internet Wifi (VNĐ/phòng)</label>
                <input
                  type="text"
                  value={internetFee}
                  onChange={(e) => setInternetFee(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phí Vệ Sinh (VNĐ/phòng)</label>
                <input
                  type="text"
                  value={cleaningFee}
                  onChange={(e) => setCleaningFee(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg font-mono text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phí Giữ Xe Máy (VNĐ/chiếc/tháng)</label>
              <input
                type="text"
                value={parkingFee}
                onChange={(e) => setParkingFee(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Định Mức Lead Gọi Mỗi Ngày (Chỉ tiêu)</label>
              <input
                type="number"
                value={dailyQuota}
                onChange={(e) => setDailyQuota(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg font-mono text-slate-800"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#0f5b54] hover:bg-[#00423d] text-white font-bold text-xs shadow-md transition-all"
              >
                Lưu Thay Đổi Cài Đặt
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
