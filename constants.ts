import { UserRole, VehicleType } from './types';
import { Truck, Bike, Bus } from 'lucide-react';

export const APP_NAME = "Keke Napepe Ride";
export const CURRENCY = "₦";
export const DEFAULT_COMMISSION = {
  ride: 15, // 15% for rides
  logistics: 20 // 20% for logistics
};

// Default Center (Ikeja, Lagos)
export const LAGOS_COORDS = { lat: 6.6018, lng: 3.3515 };

// Pricing Config (Naira) with Active Status
export const PRICING = {
  [VehicleType.KEKE]: { base: 200, perKm: 100, isActive: true },
  [VehicleType.OKADA]: { base: 150, perKm: 80, isActive: true },
  [VehicleType.BUS]: { base: 300, perKm: 150, isActive: true },
};

export const VEHICLE_ICONS = {
  [VehicleType.KEKE]: Truck, 
  [VehicleType.OKADA]: Bike,
  [VehicleType.BUS]: Bus,
};

export const MOCK_USER = {
  id: 'u-123',
  name: 'Chioma Adebayo',
  email: 'chioma@example.com',
  phone: '+234 801 234 5678',
  role: UserRole.PASSENGER,
  walletBalance: 5000,
  avatarUrl: 'https://picsum.photos/200/200',
  location: { lat: 6.6018, lng: 3.3515 } // Ikeja
};

export const MOCK_DRIVER = {
  id: 'd-456',
  name: 'Emeka Okafor',
  email: 'emeka@example.com',
  phone: '+234 809 876 5432',
  role: UserRole.DRIVER,
  vehicleType: VehicleType.KEKE,
  vehiclePlate: 'LA-123-KJA',
  isOnline: true,
  rating: 4.8,
  totalRides: 1240,
  status: 'Active',
  walletBalance: 15000,
  earnings: {
    today: 8500,
    week: 42000,
    month: 150000
  },
  avatarUrl: 'https://picsum.photos/201/201',
  location: { lat: 6.6050, lng: 3.3550 } // Nearby
};