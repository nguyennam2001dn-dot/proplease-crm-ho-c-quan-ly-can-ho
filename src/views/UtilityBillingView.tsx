import React, { useState } from 'react';
import { UtilityBill, FacilityId } from '../types/crm';
import { InvoiceDetailModal } from '../components/InvoiceDetailModal';

interface UtilityBillingViewProps {
  bills: UtilityBill[];
  selectedFacility: FacilityId;
  onUpdateBillStatus: (billId: string, status: 'paid' | 'pending' | 'overdue', method?: string) => void;
  onAddNewBill: (newBill: Partial<UtilityBill>) => void;
}

export const UtilityBillingView: React.FC<UtilityBillingViewProps> = ({
  bills,
  selectedFacility,
  onUpdateBillStatus,
  onAddNewBill
}) => {
  const [selectedBill, setSelectedBill] = useState<UtilityBill | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [searchRoom, setSearchRoom] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New bill form states
  const [newRoomCode, setNewRoomCode] = useState('P.102');
  const [newTenantName, setNewTenantName] = useState('Nguyễn Văn Tuấn');
  const [newTenantPhone, setNewTenantPhone] = useState('0905 889 771');
  const [newRentAmount, setNewRentAmount] = useState('6500000');
  const [newElecOld, setNewElecOld] = useState('1200');
  const [newElecNew, setNewElecNew] = useState('1360');
  const [newWaterOld, setNewWaterOld] = useState('50');
  const [newWaterNew, setNewWaterNew] = useState('60');

  // Filter bills
  const filteredBills = bills.filter((b) => {
    if (selectedFacility !== 'all' && b.facilityId !== selectedFacility) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchRoom.trim()) {
      const q = searchRoom.toLowerCase().trim();
      const matchRoom = b.roomCode.toLowerCase().includes(q);
      const matchName = b.tenantName.toLowerCase().includes(q);
      if (!matchRoom && !matchName) return false;
    }
    return true;
  });

  // Calculate totals
  const totalAmount = filteredBills.reduce((acc, b) => acc + b.totalAmount, 0);
  const totalPaid = filteredBills.filter((b) => b.status === 'paid').reduce((acc, b) => acc + b.totalAmount, 0);
  const totalPending = filteredBills.filter((b) => b.status === 'pending').reduce((acc, b) => acc + b.totalAmount, 0);
  const totalOverdue = filteredBills.filter((b) => b.status === 'overdue').reduce((acc, b) => acc + b.totalAmount, 0);

  const handleOpenReceipt = (bill: UtilityBill) => {
    setSelectedBill(bill);
    setIsInvoiceModalOpen(true);
  };

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    const eOld = parseInt(newElecOld, 10) || 0;
    const eNew = parseInt(newElecNew, 10) || 0;
    const eUsage = Math.max(0, eNew - eOld);
    const ePrice = 3800;
    const eAmount = eUsage * ePrice;

    const wOld = parseInt(newWaterOld, 10) || 0;
    const wNew = parseInt(newWaterNew, 10) || 0;
    const wUsage = Math.max(0, wNew - wOld);
    const wPrice = 25000;
    const wAmount = wUsage * wPrice;

    const rent = parseInt(newRentAmount.replace(/\D/g, ''), 10) || 6000000;
    const mgmt = 180000;
    const internet = 100000;
    const cleaning = 80000;
    const parking = 100000;

    const total = rent + eAmount + wAmount + mgmt + internet + cleaning + parking;
    const facilityId = selectedFacility === 'db' ? 'db' : 'tvh';

    onAddNewBill({
      invoiceCode: `INV-202610-${newRoomCode.replace('.', '')}`,
      roomCode: newRoomCode,
      facilityId,
      facilityName: facilityId === 'db' ? '91 Đỗ Bá' : '20 Trương Văn Hiến',
      billingMonth: '10/2026',
      tenantName: newTenantName,
      tenantPhone: newTenantPhone,
      rentAmount: rent,
      elecOld: eOld,
      elecNew: eNew,
      elecUsage: eUsage,
      elecUnitPrice: ePrice,
      elecAmount: eAmount,
      waterOld: wOld,
      waterNew: wNew,
      waterUsage: wUsage,
      waterUnitPrice: wPrice,
      waterAmount: wAmount,
      managementFee: mgmt,
      internetFee: internet,
      cleaningFee: cleaning,
      parkingFee: parking,
      parkingSlots: 1,
      totalAmount: total,
      status: 'pending',
      dueDate: '2026-10-15'
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100/70 text-[#0f5b54] text-[11px] font-bold uppercase tracking-wider">
              Kỳ Thu Tháng 10/2026
            </span>
            <span className="text-slate-400 text-xs">• Biểu phí chuẩn EVN & Cấp thoát nước</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
            Bảng Thu Phí Căn Hộ & Điện Nước T10/2026
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Quản lý chỉ số công tơ điện nước, tính toán định mức, xuất phiếu thu hóa đơn và tạo mã VietQR chuyển khoản tự động.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            In Toàn Bộ Bảng Thu
          </button>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#0f5b54] text-white hover:bg-[#00423d] text-xs font-bold shadow-md transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Ghi Chỉ Số & Tạo Hóa Đơn
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <span className="text-[11px] uppercase font-bold text-slate-500">Tổng Cần Thu Kỳ Này</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-800 font-mono tabular-nums">
              {totalAmount.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-slate-400 font-semibold">₫</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-2">Gồm {filteredBills.length} căn hộ phát sinh phí</span>
        </div>

        {/* Paid */}
        <div className="p-4 bg-white border border-emerald-200 bg-emerald-50/20 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-emerald-800">Đã Thu Thành Công</span>
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
              {totalPaid.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">₫</span>
          </div>
          <span className="text-[11px] text-emerald-700 block mt-2 font-medium">
            {totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0}% tiến độ thu tiền
          </span>
        </div>

        {/* Pending */}
        <div className="p-4 bg-white border border-amber-200 bg-amber-50/20 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-amber-800">Chờ Cư Dân Chuyển Khoản</span>
            <span className="material-symbols-outlined text-amber-600 text-[18px]">hourglass_top</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-amber-700 font-mono tabular-nums">
              {totalPending.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-amber-600 font-semibold">₫</span>
          </div>
          <span className="text-[11px] text-amber-700 block mt-2">
            Hạn thanh toán định kỳ: ngày 15 hàng tháng
          </span>
        </div>

        {/* Overdue */}
        <div className="p-4 bg-white border border-red-200 bg-red-50/20 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-red-800">Công Nợ Quá Hạn</span>
            <span className="material-symbols-outlined text-red-600 text-[18px]">warning</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-red-600 font-mono tabular-nums">
              {totalOverdue.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-red-500 font-semibold">₫</span>
          </div>
          <span className="text-[11px] text-red-700 block mt-2 font-medium">
            Cần gửi tin nhắn Zalo nhắc cước
          </span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500 uppercase text-[10px]">Lọc theo trạng thái:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              statusFilter === 'all' ? 'bg-[#0f5b54] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả ({bills.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Chờ thanh toán ({bills.filter((b) => b.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              statusFilter === 'paid' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Đã thanh toán ({bills.filter((b) => b.status === 'paid').length})
          </button>
          <button
            onClick={() => setStatusFilter('overdue')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              statusFilter === 'overdue' ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Quá hạn ({bills.filter((b) => b.status === 'overdue').length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchRoom}
            onChange={(e) => setSearchRoom(e.target.value)}
            placeholder="Tìm theo mã phòng, khách thuê..."
            className="px-3 py-1.5 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none w-56"
          />
        </div>
      </div>

      {/* Bill Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f8f9ff] text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Mã Căn Hộ</th>
                <th className="py-3 px-4">Khách Thuê / SĐT</th>
                <th className="py-3 px-3">Tiền Nhà</th>
                <th className="py-3 px-3">Điện (Số cũ ➔ mới)</th>
                <th className="py-3 px-3">Nước (Số cũ ➔ mới)</th>
                <th className="py-3 px-3">Phí Dịch Vụ</th>
                <th className="py-3 px-4">Tổng Cộng</th>
                <th className="py-3 px-3">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Phiếu Thu & QLVH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-[#f8f9ff] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    <span className="font-mono text-sm text-[#0f5b54]">{bill.roomCode}</span>
                    <span className="block text-[10px] text-slate-400 font-normal">{bill.facilityName}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 block">{bill.tenantName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{bill.tenantPhone}</span>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-slate-800 tabular-nums">
                    {bill.rentAmount.toLocaleString('vi-VN')} ₫
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-mono text-slate-800">
                      {bill.elecUsage} kWh
                      <span className="text-[11px] text-slate-500 font-normal block">
                        ({bill.elecOld} ➔ {bill.elecNew})
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-teal-800 font-mono">
                      {bill.elecAmount.toLocaleString('vi-VN')} ₫
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-mono text-slate-800">
                      {bill.waterUsage} m³
                      <span className="text-[11px] text-slate-500 font-normal block">
                        ({bill.waterOld} ➔ {bill.waterNew})
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-blue-800 font-mono">
                      {bill.waterAmount.toLocaleString('vi-VN')} ₫
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-600 font-mono tabular-nums">
                    {(bill.managementFee + bill.internetFee + bill.cleaningFee + bill.parkingFee).toLocaleString(
                      'vi-VN'
                    )}{' '}
                    ₫
                  </td>

                  <td className="py-3.5 px-4 font-mono font-extrabold text-sm text-[#0f5b54] tabular-nums">
                    {bill.totalAmount.toLocaleString('vi-VN')} ₫
                  </td>

                  <td className="py-3.5 px-3">
                    {bill.status === 'paid' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        ✓ Đã thanh toán
                      </span>
                    )}
                    {bill.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        ⏳ Chờ thanh toán
                      </span>
                    )}
                    {bill.status === 'overdue' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                        ⚠️ Quá hạn
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenReceipt(bill)}
                        className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs flex items-center gap-1 border border-teal-200"
                        title="Xem chi tiết phiếu thu & mã QR"
                      >
                        <span className="material-symbols-outlined text-[15px]">receipt</span>
                        Phiếu Thu
                      </button>

                      {bill.status !== 'paid' ? (
                        <button
                          type="button"
                          onClick={() => onUpdateBillStatus(bill.id, 'paid', 'Tiền mặt/Chuyển khoản')}
                          className="px-2.5 py-1 rounded-lg bg-[#0f5b54] hover:bg-[#00423d] text-white font-semibold text-xs"
                          title="Đánh dấu đã nộp"
                        >
                          Thu Tiền
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onUpdateBillStatus(bill.id, 'pending')}
                          className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-600 text-[10px]"
                          title="Chuyển về chưa thu"
                        >
                          Hủy thu
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal with VietQR */}
      <InvoiceDetailModal
        bill={selectedBill}
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setSelectedBill(null);
        }}
        onMarkPaid={(id, method) => onUpdateBillStatus(id, 'paid', method)}
      />

      {/* Create New Bill Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#eff4ff] border-b border-blue-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800">Ghi Chỉ Số & Tạo Hóa Đơn Mới</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateBill} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mã Phòng</label>
                  <input
                    type="text"
                    required
                    value={newRoomCode}
                    onChange={(e) => setNewRoomCode(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tiền Thuê Phòng (VNĐ)</label>
                  <input
                    type="text"
                    required
                    value={newRentAmount}
                    onChange={(e) => setNewRentAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Khách Thuê</label>
                  <input
                    type="text"
                    required
                    value={newTenantName}
                    onChange={(e) => setNewTenantName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số Điện Thoại</label>
                  <input
                    type="text"
                    required
                    value={newTenantPhone}
                    onChange={(e) => setNewTenantPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Electricity meters */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">Chỉ số Điện (kWh) - Đơn giá 3.800 đ/kWh</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 block mb-0.5">Chỉ số cũ</label>
                    <input
                      type="number"
                      value={newElecOld}
                      onChange={(e) => setNewElecOld(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5">Chỉ số mới</label>
                    <input
                      type="number"
                      value={newElecNew}
                      onChange={(e) => setNewElecNew(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Water meters */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">Chỉ số Nước (m³) - Đơn giá 25.000 đ/m³</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 block mb-0.5">Chỉ số cũ</label>
                    <input
                      type="number"
                      value={newWaterOld}
                      onChange={(e) => setNewWaterOld(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5">Chỉ số mới</label>
                    <input
                      type="number"
                      value={newWaterNew}
                      onChange={(e) => setNewWaterNew(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0f5b54] hover:bg-[#00423d] text-white font-bold shadow-sm"
                >
                  Tạo Hóa Đơn & Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
