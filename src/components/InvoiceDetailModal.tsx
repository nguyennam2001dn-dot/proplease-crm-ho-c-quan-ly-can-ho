import React, { useState } from 'react';
import { UtilityBill } from '../types/crm';

interface InvoiceDetailModalProps {
  bill: UtilityBill | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkPaid: (billId: string, method: string) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  bill,
  isOpen,
  onClose,
  onMarkPaid
}) => {
  const [showQr, setShowQr] = useState(false);

  if (!isOpen || !bill) return null;

  // VietQR quick URL generator for Vietcombank/MBBank demo
  const bankAccount = '9905123456789';
  const bankBin = '970422'; // MB Bank
  const qrUrl = `https://img.vietqr.io/image/${bankBin}-${bankAccount}-compact2.png?amount=${bill.totalAmount}&addInfo=${encodeURIComponent(
    `${bill.roomCode} ${bill.billingMonth.replace('/', '')}`
  )}&accountName=${encodeURIComponent('NGUYEN THANH NAM')}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#eff4ff] flex items-center justify-between border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f5b54] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">
                Phiếu Báo Phí Căn Hộ {bill.roomCode}
              </h3>
              <p className="text-xs text-slate-500">
                {bill.facilityName} · Kỳ thu: Tháng {bill.billingMonth}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            ✕
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
          <div className="p-5 bg-[#f8f9ff] border border-slate-200 rounded-xl shadow-inner relative">
            {/* Watermark / Unit code badge */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider block">
                  PROPLEASE APARTMENT BILLING
                </span>
                <span className="font-bold text-base text-slate-800">{bill.roomCode}</span>
                <span className="text-slate-500 block text-[11px]">{bill.facilityName}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono font-semibold text-slate-500 block">
                  {bill.invoiceCode}
                </span>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] mt-1 ${
                    bill.status === 'paid'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : bill.status === 'overdue'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {bill.status === 'paid' && '✓ ĐÃ THANH TOÁN'}
                  {bill.status === 'pending' && '⏳ CHỜ THANH TOÁN'}
                  {bill.status === 'overdue' && '⚠️ QUÁ HẠN NỘP TIỀN'}
                </span>
              </div>
            </div>

            {/* Tenant details */}
            <div className="py-2.5 grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-b border-slate-200">
              <div>
                <span className="text-slate-400">Khách thuê: </span>
                <strong className="text-slate-800">{bill.tenantName}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400">SĐT: </span>
                <strong className="text-slate-800 font-mono">{bill.tenantPhone}</strong>
              </div>
              <div>
                <span className="text-slate-400">Hạn thanh toán: </span>
                <strong className="text-slate-800">{bill.dueDate}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Phương thức: </span>
                <strong className="text-slate-800">{bill.paymentMethod || 'Chuyển khoản VietQR'}</strong>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="py-3 space-y-2.5">
              {/* Rent */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">1. Tiền thuê phòng kỳ T{bill.billingMonth}</span>
                  <span className="block text-[11px] text-slate-400">Đơn giá niêm yết theo hợp đồng</span>
                </div>
                <span className="font-bold text-slate-800 font-mono text-[13px] tabular-nums">
                  {bill.rentAmount.toLocaleString('vi-VN')} ₫
                </span>
              </div>

              {/* Electricity */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">2. Tiền điện sinh hoạt</span>
                  <span className="block text-[11px] text-slate-500 font-mono">
                    Chỉ số: {bill.elecOld} ➔ {bill.elecNew} ({bill.elecUsage} kWh × {bill.elecUnitPrice.toLocaleString('vi-VN')} đ)
                  </span>
                </div>
                <span className="font-bold text-slate-800 font-mono text-[13px] tabular-nums">
                  {bill.elecAmount.toLocaleString('vi-VN')} ₫
                </span>
              </div>

              {/* Water */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">3. Tiền nước sinh hoạt</span>
                  <span className="block text-[11px] text-slate-500 font-mono">
                    Chỉ số: {bill.waterOld} ➔ {bill.waterNew} ({bill.waterUsage} m³ × {bill.waterUnitPrice.toLocaleString('vi-VN')} đ)
                  </span>
                </div>
                <span className="font-bold text-slate-800 font-mono text-[13px] tabular-nums">
                  {bill.waterAmount.toLocaleString('vi-VN')} ₫
                </span>
              </div>

              {/* Management, Wifi, Cleaning, Parking */}
              <div className="flex justify-between items-center text-slate-700">
                <span>4. Phí dịch vụ quản lý tòa nhà & thang máy</span>
                <span className="font-mono tabular-nums">{bill.managementFee.toLocaleString('vi-VN')} ₫</span>
              </div>

              <div className="flex justify-between items-center text-slate-700">
                <span>5. Internet Wi-Fi tốc độ cao</span>
                <span className="font-mono tabular-nums">{bill.internetFee.toLocaleString('vi-VN')} ₫</span>
              </div>

              <div className="flex justify-between items-center text-slate-700">
                <span>6. Phí vệ sinh khu vực chung & đổ rác</span>
                <span className="font-mono tabular-nums">{bill.cleaningFee.toLocaleString('vi-VN')} ₫</span>
              </div>

              {bill.parkingFee > 0 && (
                <div className="flex justify-between items-center text-slate-700">
                  <span>7. Phí giữ xe máy ({bill.parkingSlots} xe)</span>
                  <span className="font-mono tabular-nums">{bill.parkingFee.toLocaleString('vi-VN')} ₫</span>
                </div>
              )}
            </div>

            {/* Perforated divider line */}
            <div className="relative py-2">
              <div className="border-t-2 border-dashed border-slate-300 w-full"></div>
            </div>

            {/* Grand Total */}
            <div className="pt-2 flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-slate-500">TỔNG CỘNG CẦN NỘP</span>
                <span className="block text-[11px] text-slate-400">Đã bao gồm tất cả các khoản mục</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-[#0f5b54] font-mono tabular-nums">
                  {bill.totalAmount.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>
          </div>

          {/* VietQR Section */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-teal-800">qr_code_scanner</span>
                <span className="font-bold text-slate-800">Thanh toán tức thì qua VietQR / Napas247</span>
              </div>
              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                className="text-teal-800 font-semibold hover:underline text-xs"
              >
                {showQr ? 'Ẩn mã QR' : 'Hiện mã VietQR'}
              </button>
            </div>

            {showQr && (
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <img
                  src={qrUrl}
                  alt="Mã QR thanh toán ngân hàng"
                  className="w-48 h-48 object-contain bg-white p-2 rounded-lg shadow-sm"
                  onError={(e) => {
                    // Fallback if image proxy is unavailable
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="mt-3 text-center space-y-0.5 text-[11px] text-slate-600">
                  <p className="font-bold text-slate-800">STK: 9905123456789 - MB Bank</p>
                  <p>Chủ TK: NGUYEN THANH NAM</p>
                  <p className="text-teal-800 font-mono font-semibold">
                    Nội dung: {bill.roomCode} {bill.billingMonth.replace('/', '')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            In Hóa Đơn
          </button>

          <div className="flex items-center gap-2">
            {bill.status !== 'paid' && (
              <button
                type="button"
                onClick={() => {
                  onMarkPaid(bill.id, 'Chuyển khoản VietQR');
                  onClose();
                }}
                className="px-4 py-1.5 rounded-lg bg-[#0f5b54] hover:bg-[#00423d] text-white font-semibold text-xs shadow-sm transition-all"
              >
                Xác Nhận Đã Thanh Toán
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
