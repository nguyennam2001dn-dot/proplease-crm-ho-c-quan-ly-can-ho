export type SocialChannel = 'zalo' | 'facebook' | 'tiktok' | 'instagram' | 'telegram' | 'call';

export type ContactStatus = 'chua_lien_he' | 'da_lien_he' | 'hen_goi_lai';

export type DemandStatus = 'khao_sat' | 'co_thue_ngay' | 'da_coc' | 'chua_xac_dinh' | 'khong_thue';

export type FacilityId = 'all' | 'tvh' | 'db';

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  channel: SocialChannel;
  channelAccount?: string;
  status: ContactStatus;
  demand: DemandStatus;
  facilityId: 'tvh' | 'db';
  roomPreference: string;
  budget: number;
  hasPet: boolean;
  callCount: number;
  notes: string;
  createdAt: string;
  lastContactAt?: string;
}

export type RoomStatus = 'available' | 'rented' | 'deposit' | 'maintenance';

export interface ApartmentRoom {
  id: string;
  code: string;
  facilityId: 'tvh' | 'db';
  facilityName: string;
  floor: number;
  type: 'Studio' | '1PN' | '2PN';
  area: number; // m2
  rentPrice: number; // VND
  status: RoomStatus;
  petFriendly: boolean;
  hasBalcony: boolean;
  tenantName?: string;
  tenantPhone?: string;
  contractStart?: string;
  contractEnd?: string;
  depositAmount?: number;
}

export type BillStatus = 'paid' | 'pending' | 'overdue';

export interface UtilityBill {
  id: string;
  invoiceCode: string;
  roomCode: string;
  facilityId: 'tvh' | 'db';
  facilityName: string;
  billingMonth: string; // "10/2026"
  tenantName: string;
  tenantPhone: string;
  rentAmount: number;
  
  // Electricity
  elecOld: number;
  elecNew: number;
  elecUsage: number;
  elecUnitPrice: number;
  elecAmount: number;

  // Water
  waterOld: number;
  waterNew: number;
  waterUsage: number;
  waterUnitPrice: number;
  waterAmount: number;

  // Additional services
  managementFee: number;
  internetFee: number;
  cleaningFee: number;
  parkingFee: number;
  parkingSlots: number;

  totalAmount: number;
  status: BillStatus;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
}

export type EventType = 'viewing' | 'checkin' | 'checkout' | 'maintenance' | 'contract';

export interface OperationalEvent {
  id: string;
  title: string;
  type: EventType;
  roomCode: string;
  facilityId: 'tvh' | 'db';
  customerName: string;
  customerPhone: string;
  dateTime: string;
  timeSlot: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  assignedStaff: string;
  notes: string;
}

export interface Facility {
  id: 'tvh' | 'db';
  name: string;
  code: string;
  address: string;
  totalRooms: number;
  manager: string;
  hotline: string;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}
