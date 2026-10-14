import React from 'react';
import { UtilityBill, ApartmentRoom, FacilityId } from '../types/crm';

interface RevenueReportViewProps {
  bills: UtilityBill[];
  rooms: ApartmentRoom[];
  selectedFacility: FacilityId;
}

export const RevenueReportView: React.FC<RevenueReportViewProps> = ({
  bills,
  rooms,
  selectedFacility
}) => {
  const filteredBills = bills.filter(
    (b) => selectedFacility === 'all' || b.facilityId === selectedFacility
  );
  const filteredRooms = rooms.filter(
    (r) => selectedFacility === 'all' || r.facilityId === selectedFacility
  );

  const totalRent = filteredBills.reduce((acc, b) => acc + b.rentAmount, 0);
  const totalElec = filteredBills.reduce((acc, b) => acc + b.elecAmount, 0);
  const totalWater = filteredBills.reduce((acc, b) => acc + b.waterAmount, 0);
  const totalService = filteredBills.reduce(
    (acc, b) => acc + b.managementFee + b.internetFee + b.cleaningFee + b.parkingFee,
    0
  );
  const grandTotal = totalRent + totalElec + totalWater + totalService;

  const totalCollected = filteredBills
    .filter((b) => b.status === 'paid')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  const collectionRate = grandTotal > 0 ? ((totalCollected / grandTotal) * 100).toFixed(1) : '0';

  const rentedRooms = filteredRooms.filter((r) => r.status === 'rented' || r.status === 'deposit').length;
  const occupancyRate = filteredRooms.length > 0 ? Math.round((rentedRooms / filteredRooms.length) * 100) : 0;

  // Monthly mockup bars
  const monthsData = [
    { month: 'T05/26', total: 68500000, collected: 68500000 },
    { month: 'T06/26', total: 72100000, collected: 72100000 },
    { month: 'T07/26', total: 76800000, collected: 76800000 },
    { month: 'T08/26', total: 82400000, collected: 81200000 },
    { month: 'T09/26', total: 85900000, collected: 84300000 },
    { month: 'T10/26', total: grandTotal, collected: totalCollected }
  ];

  const maxVal = Math.max(...monthsData.map((m) => m.total), 1);

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100/70 text-[#0f5b54] text-[11px] font-bold uppercase tracking-wider">
              Báo Cáo Tài Chính & Dòng Tiền
            </span>
            <span className="text-slate-400 text-xs">• Thời gian thực T10/2026</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
            Báo Cáo Doanh Thu & Thu Chi Tòa Nhà
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Tổng hợp cơ cấu doanh thu từ tiền phòng, phụ thu dịch vụ tiện ích, tỷ lệ thực thu qua VietQR và dự phóng dòng tiền.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all self-start lg:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">file_download</span>
          Xuất Báo Cáo QLVH
        </button>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Tổng Doanh Số Tháng 10</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-[#0f5b54] font-mono tabular-nums">
              {grandTotal.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-slate-500">₫</span>
          </div>
          <span className="text-[11px] text-teal-800 font-semibold block mt-2">+8.4% so với tháng 09/2026</span>
        </div>

        <div className="p-5 bg-white border border-emerald-200 bg-emerald-50/20 rounded-xl shadow-sm">
          <span className="text-[11px] font-bold text-emerald-800 uppercase">Thực Thu Đã Về Tài Khoản</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
              {totalCollected.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-emerald-600">₫</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-2">
            Đạt {collectionRate}% tổng doanh số
          </span>
        </div>

        <div className="p-5 bg-white border border-blue-200 bg-blue-50/20 rounded-xl shadow-sm">
          <span className="text-[11px] font-bold text-blue-800 uppercase">Tỷ Lệ Lấp Đầy Phòng</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-blue-800 font-mono tabular-nums">{occupancyRate}%</span>
            <span className="text-xs text-blue-600 font-semibold">
              ({rentedRooms}/{filteredRooms.length} phòng)
            </span>
          </div>
          <span className="text-[11px] text-blue-700 font-semibold block mt-2">Chỉ còn ít phòng trống</span>
        </div>

        <div className="p-5 bg-white border border-amber-200 bg-amber-50/20 rounded-xl shadow-sm">
          <span className="text-[11px] font-bold text-amber-800 uppercase">Doanh Thu Tiền Điện Nước</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-amber-700 font-mono tabular-nums">
              {(totalElec + totalWater).toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-amber-600">₫</span>
          </div>
          <span className="text-[11px] text-amber-700 font-semibold block mt-2">Điện: {totalElec.toLocaleString('vi-VN')}đ</span>
        </div>
      </div>

      {/* Revenue Structure Breakdown & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Bar Chart */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-800">Xu Hướng Doanh Thu 6 Tháng Gần Nhất</span>
              <span className="text-xs text-slate-400 font-mono">Đơn vị: Triệu VNĐ</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Tăng trưởng ổn định nhờ tỷ lệ duy trì hợp đồng tái ký & chiến dịch telesale kênh Zalo/TikTok.
            </p>
          </div>

          <div className="mt-6 flex items-end justify-between gap-3 h-48 pt-4">
            {monthsData.map((item, idx) => {
              const heightPct = Math.round((item.total / maxVal) * 100);
              const collectedPct = Math.round((item.collected / item.total) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-600 tabular-nums">
                    {(item.total / 1000000).toFixed(1)}Tr
                  </span>
                  <div className="w-full max-w-[44px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end" style={{ height: `${heightPct}%` }}>
                    <div
                      className="w-full bg-[#0f5b54] rounded-t-lg transition-all duration-500"
                      style={{ height: `${collectedPct}%` }}
                      title={`Đã thu: ${item.collected.toLocaleString('vi-VN')} đ`}
                    ></div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#0f5b54]"></span>
              <span>Đã thực thu (VietQR / Tiền mặt)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-200"></span>
              <span>Kế hoạch doanh số tổng</span>
            </div>
          </div>
        </div>

        {/* Revenue Composition Breakdown */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-800">Cơ Cấu Thu Nhập T10/2026</span>
              <span className="text-xs text-teal-800 font-bold">{grandTotal.toLocaleString('vi-VN')} ₫</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Phân loại chi tiết nguồn tiền phát sinh trong kỳ thu.</p>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            {/* Rent */}
            <div>
              <div className="flex justify-between py-1 text-slate-700">
                <span className="font-semibold">Tiền thuê căn hộ niêm yết</span>
                <span className="font-mono font-bold">{totalRent.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-800 rounded-full"
                  style={{ width: `${grandTotal > 0 ? (totalRent / grandTotal) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Electricity */}
            <div>
              <div className="flex justify-between py-1 text-slate-700">
                <span className="font-semibold">Tiền điện sinh hoạt</span>
                <span className="font-mono font-bold">{totalElec.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 rounded-full"
                  style={{ width: `${grandTotal > 0 ? (totalElec / grandTotal) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Water */}
            <div>
              <div className="flex justify-between py-1 text-slate-700">
                <span className="font-semibold">Tiền nước sinh hoạt</span>
                <span className="font-mono font-bold">{totalWater.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${grandTotal > 0 ? (totalWater / grandTotal) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Service & Parking */}
            <div>
              <div className="flex justify-between py-1 text-slate-700">
                <span className="font-semibold">Phí quản lý, Wifi, Vệ sinh & Gửi xe</span>
                <span className="font-mono font-bold">{totalService.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full"
                  style={{ width: `${grandTotal > 0 ? (totalService / grandTotal) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#eff4ff] rounded-xl border border-blue-100 text-[11px] text-slate-600">
            <strong>Mục tiêu tháng tới:</strong> Duy trì tỷ lệ thu hồi nợ trên 98% trước ngày 15 hàng tháng để đảm bảo thanh toán hóa đơn điện lực EVN đúng hạn.
          </div>
        </div>
      </div>
    </div>
  );
};
