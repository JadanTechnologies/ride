import React, { useState } from 'react';
import { Auth } from './views/Auth';
import { PassengerPortal } from './views/PassengerPortal';
import { DriverPortal } from './views/DriverPortal';
import { AdminDashboard } from './views/AdminDashboard';
import { ChatWidget } from './components/ChatWidget';
import { ToastContainer } from './components/Toast';
import { AdminSettingsPanel } from './components/AdminSettingsPanel';
import { InAppNotificationCenter } from './components/InAppNotificationCenter';
import { CommunicationHub } from './components/CommunicationHub';
import { UserRole, AppNotification, VehicleType, WithdrawalRequest, Driver } from './types';
import { MOCK_USER, MOCK_DRIVER, PRICING as DEFAULT_PRICING, DEFAULT_COMMISSION } from './constants';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  
  // User/Driver State
  const [passengerData, setPassengerData] = useState(MOCK_USER);
  const [driverData, setDriverData] = useState<Driver>(MOCK_DRIVER as unknown as Driver);

  // Global Ride/History State (Persistence)
  const [passengerHistory, setPassengerHistory] = useState<any[]>([
    { id: 'mock-1', pickup: 'Market Square', dropoff: 'Office', date: 'Today, 8:30 AM', price: 450, status: 'Completed', vehicle: VehicleType.KEKE },
    { id: 'mock-2', pickup: 'Church', dropoff: 'Home', date: 'Yesterday', price: 800, status: 'Completed', vehicle: VehicleType.OKADA }
  ]);
  const [driverHistory, setDriverHistory] = useState<any[]>([
      { id: 'h-1', type: 'Trip Payment', time: 'Today, 2:30 PM', amount: 650 },
      { id: 'h-2', type: 'Trip Payment', time: 'Today, 1:15 PM', amount: 900 },
      { id: 'h-3', type: 'Trip Payment', time: 'Today, 11:00 AM', amount: 1200 },
  ]);
  const [driverDailyEarnings, setDriverDailyEarnings] = useState(8500);

  // Global Admin State
  const [pricing, setPricing] = useState(DEFAULT_PRICING);
  const [commissionRate, setCommissionRate] = useState(DEFAULT_COMMISSION);
  const [surge, setSurge] = useState(1.0); // 1.0x is normal price
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([
      { id: 'w-1', driverId: 'd-999', driverName: 'Ibrahim Musa', amount: 12500, status: 'Pending', date: 'Today, 10:00 AM' }
  ]);
  
  // Notification System
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addNotification = (type: 'info' | 'success' | 'alert', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleLogin = (role: UserRole, userData?: { name: string; email: string; phone: string; vehicleType?: VehicleType; status?: string }) => {
    setCurrentRole(role);
    
    // Update profile if registering/sending new data
    if (userData) {
      if (role === UserRole.PASSENGER) {
        setPassengerData(prev => ({ ...prev, ...userData }));
        addNotification('success', `Account created! Welcome, ${userData.name}.`);
      } else if (role === UserRole.DRIVER) {
        setDriverData(prev => ({ 
          ...prev, 
          ...userData,
          vehicleType: userData.vehicleType || prev.vehicleType,
          status: (userData.status as Driver['status']) || 'Pending' 
        }));
        
        if (userData.status === 'Pending') {
            addNotification('info', `Registration pending verification. Welcome, ${userData.name}.`);
        } else {
            addNotification('success', `Welcome back, ${userData.name}.`);
        }
      }
    } else {
      // Normal login welcome
      if (role === UserRole.PASSENGER) addNotification('success', `Welcome back, ${passengerData.name}!`);
      if (role === UserRole.DRIVER) addNotification('info', `Drive safe today, ${driverData.name}.`);
    }
  };

  const handleLogout = () => {
    setCurrentRole(null);
    setNotifications([]);
  };

  const handlePassengerRideComplete = (ride: any) => {
      setPassengerHistory(prev => [ride, ...prev]);
      // Deduct from wallet if needed (optional logic)
      setPassengerData(prev => ({ ...prev, walletBalance: prev.walletBalance - ride.price }));
  };

  const handleDriverRideComplete = (earning: number) => {
      setDriverDailyEarnings(prev => prev + earning);
      setDriverHistory(prev => [{
          id: Date.now().toString(),
          type: 'Trip Payment',
          time: 'Just Now',
          amount: earning
      }, ...prev]);
  };

  const handleDriverWithdraw = (amount: number) => {
      const newRequest: WithdrawalRequest = {
          id: `w-${Date.now()}`,
          driverId: driverData.id,
          driverName: driverData.name,
          amount: amount,
          status: 'Pending',
          date: 'Just Now'
      };
      setWithdrawalRequests(prev => [newRequest, ...prev]);
      setDriverDailyEarnings(0);
      addNotification('success', 'Withdrawal request submitted to Admin.');
  };

  const handleApproveWithdrawal = (id: string) => {
      setWithdrawalRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: 'Completed' } : req
      ));
      addNotification('success', 'Withdrawal processed successfully.');
  };

  // Admin Actions on Global State
  const handleUpdateDriverStatus = (status: 'Active' | 'Suspended') => {
      setDriverData(prev => ({ ...prev, status }));
      addNotification('success', `Driver status updated to ${status}`);
  };

  const renderView = () => {
    switch (currentRole) {
      case UserRole.PASSENGER:
        return (
          <PassengerPortal 
            user={passengerData} 
            pricing={pricing}
            surge={surge}
            history={passengerHistory}
            onRideComplete={handlePassengerRideComplete}
            onLogout={handleLogout}
            onNotify={addNotification}
          />
        );
      case UserRole.DRIVER:
        return (
          <DriverPortal 
            user={driverData} 
            pricing={pricing}
            commissionRate={commissionRate}
            surge={surge}
            dailyEarnings={driverDailyEarnings}
            history={driverHistory}
            // Filter withdrawals for the current driver to display history
            withdrawals={withdrawalRequests.filter(w => w.driverId === driverData.id)}
            onRideComplete={handleDriverRideComplete}
            onWithdraw={handleDriverWithdraw}
            onLogout={handleLogout}
            onNotify={addNotification}
          />
        );
      case UserRole.ADMIN:
        return (
          <AdminDashboard 
            currentPricing={pricing} 
            currentCommission={commissionRate}
            currentSurge={surge}
            withdrawalRequests={withdrawalRequests}
            sessionData={{
                passenger: passengerData,
                driver: driverData,
                rides: passengerHistory
            }}
            onUpdatePricing={setPricing} 
            onUpdateCommission={setCommissionRate}
            onUpdateSurge={setSurge}
            onUpdateDriverStatus={handleUpdateDriverStatus}
            onProcessWithdrawal={handleApproveWithdrawal}
            onBroadcast={(msg) => addNotification('info', `📢 ANNOUNCEMENT: ${msg}`)}
            onLogout={handleLogout} 
          />
        );
      default:
        return <Auth onLogin={handleLogin} />;
    }
  };

  return (
    <div className="font-sans text-gray-900 relative">
      <ToastContainer notifications={notifications} onDismiss={dismissNotification} />
      {renderView()}
      {/* Show AI Chat Widget for Passengers and Guests */}
      {(currentRole === UserRole.PASSENGER || currentRole === null) && (
        <ChatWidget />
      )}
      {/* Show In-App Notification Center for logged-in users */}
      {currentRole && <InAppNotificationCenter />}
    </div>
  );
};

export default App;