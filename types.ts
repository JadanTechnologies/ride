export enum UserRole {
  PASSENGER = 'PASSENGER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
  GUEST = 'GUEST'
}

export enum VehicleType {
  KEKE = 'KEKE',     // Tricycle
  OKADA = 'OKADA',   // Motorcycle
  BUS = 'BUS'        // Mini Bus / Danfo
}

export enum RideStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  ARRIVING = 'ARRIVING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  walletBalance: number;
  avatarUrl?: string;
}

export interface Driver extends User {
  vehicleType: VehicleType;
  vehiclePlate: string;
  isOnline: boolean;
  rating: number;
  totalRides: number;
  status: 'Active' | 'Pending' | 'Suspended';
  earnings: {
    today: number;
    week: number;
    month: number;
  };
}

export interface Ride {
  id: string;
  passengerId: string;
  driverId?: string;
  vehicleType: VehicleType;
  pickupAddress: string;
  dropoffAddress: string;
  status: RideStatus;
  fare: number;
  distance: string; // e.g., "5.2 km"
  duration: string; // e.g., "15 mins"
  createdAt: number;
}

export interface WithdrawalRequest {
  id: string;
  driverId: string;
  driverName: string;
  amount: number;
  status: 'Pending' | 'Completed';
  date: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'alert';
  message: string;
}