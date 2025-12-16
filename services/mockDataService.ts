import { User, Driver, Ride, RideStatus, UserRole, VehicleType } from '../types';
import { LAGOS_COORDS } from '../constants';

const getRandomPos = () => ({
  lat: LAGOS_COORDS.lat + (Math.random() - 0.5) * 0.05,
  lng: LAGOS_COORDS.lng + (Math.random() - 0.5) * 0.05
});

export const getMockUsers = (): User[] => [
  { id: 'u-1', name: "Chioma Adebayo", email: "chioma@example.com", phone: "08012345678", role: UserRole.PASSENGER, walletBalance: 1500, location: getRandomPos() },
  { id: 'u-2', name: "John Doe", email: "john@test.com", phone: "08012345679", role: UserRole.PASSENGER, walletBalance: 500, location: getRandomPos() },
  { id: 'u-3', name: "Sarah Smith", email: "sarah@test.com", phone: "08012345680", role: UserRole.PASSENGER, walletBalance: 12500, location: getRandomPos() },
];

export const getMockDrivers = (): Driver[] => [
    { id: 'd-1', name: "Ibrahim Musa", vehicleType: VehicleType.KEKE, status: "Active", rating: 4.8, isCompany: true, location: getRandomPos(), email: 'd1@test.com', phone: '123', role: UserRole.DRIVER, walletBalance: 0, vehiclePlate: "ABC-123", isOnline: true, totalRides: 10, earnings: {today: 100, week: 500, month: 2000} },
    { id: 'd-2', name: "Samuel Okon", vehicleType: VehicleType.OKADA, status: "Pending", rating: 0, isCompany: false, location: getRandomPos(), email: 'd2@test.com', phone: '123', role: UserRole.DRIVER, walletBalance: 0, vehiclePlate: "ABC-123", isOnline: true, totalRides: 10, earnings: {today: 100, week: 500, month: 2000} },
    { id: 'd-3', name: "Chinedu Eze", vehicleType: VehicleType.BUS, status: "Suspended", rating: 3.2, isCompany: false, location: getRandomPos(), email: 'd3@test.com', phone: '123', role: UserRole.DRIVER, walletBalance: 0, vehiclePlate: "ABC-123", isOnline: true, totalRides: 10, earnings: {today: 100, week: 500, month: 2000} },
    { id: 'd-4', name: "Yusuf Ali", vehicleType: VehicleType.KEKE, status: "Active", rating: 4.9, isCompany: false, location: getRandomPos(), email: 'd4@test.com', phone: '123', role: UserRole.DRIVER, walletBalance: 0, vehiclePlate: "ABC-123", isOnline: true, totalRides: 10, earnings: {today: 100, week: 500, month: 2000} },
    { id: 'd-5', name: "Emmanuel Bassey", vehicleType: VehicleType.BUS, status: "Pending", rating: 0, isCompany: false, location: getRandomPos(), email: 'd5@test.com', phone: '123', role: UserRole.DRIVER, walletBalance: 0, vehiclePlate: "ABC-123", isOnline: true, totalRides: 10, earnings: {today: 100, week: 500, month: 2000} },
];

export const getMockRides = (): Ride[] => [
  { id: 'r-101', passengerId: "u-1", driverId: "d-1", pickupAddress: "Shoprite Ikeja", dropoffAddress: "Maryland Mall", status: RideStatus.IN_PROGRESS, fare: 1200, vehicleType: VehicleType.KEKE, distance: "5km", duration: "10m", createdAt: Date.now() },
];
