import React, { useState } from 'react';
import { Auth } from './views/Auth';
import { LandingPage } from './views/LandingPage';
import { PassengerPortal } from './views/PassengerPortal';
import { DriverPortal } from './views/DriverPortal';
import { AdminDashboard } from './views/AdminDashboard';
import { ChatWidget } from './components/ChatWidget';
import { ToastContainer } from './components/Toast';
import { UserRole, AppNotification, VehicleType, WithdrawalRequest } from './types';
import { MOCK_USER, MOCK_DRIVER, PRICING as DEFAULT_PRICING, DEFAULT_COMMISSION } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useLocalStorage<UserRole | null>('currentRole', null);
  const [showLanding, setShowLanding] = useState(true);
  
  // User/Driver State (with localStorage persistence)
  const [passengerData, setPassengerData] = useLocalStorage(
    'passengerData',
    MOCK_USER
  );
  const [driverData, setDriverData] = useLocalStorage(
    'driverData',
    MOCK_DRIVER
  );

  // Global Ride/History State (Persistence)
  const [passengerHistory, setPassengerHistory] = useLocalStorage<any[]>('passengerHistory', [
    { id: 'mock-1', pickup: 'Market Square', dropoff: 'Office', date: 'Today, 8:30 AM', price: 450, status: 'Completed', vehicle: VehicleType.KEKE },
    { id: 'mock-2', pickup: 'Church', dropoff: 'Home', date: 'Yesterday', price: 800, status: 'Completed', vehicle: VehicleType.OKADA }
  ]);
  const [driverHistory, setDriverHistory] = useLocalStorage<any[]>('driverHistory', [
      { id: 'h-1', type: 'Trip Payment', time: 'Today, 2:30 PM', amount: 650 },
      { id: 'h-2', type: 'Trip Payment', time: 'Today, 1:15 PM', amount: 900 },
      { id: 'h-3', type: 'Trip Payment', time: 'Today, 11:00 AM', amount: 1200 },
  ]);
  const [driverDailyEarnings, setDriverDailyEarnings] = useLocalStorage('driverDailyEarnings', 8500);

  // Global Admin State (with localStorage persistence)
  const [pricing, setPricing] = useLocalStorage('platformPricing', DEFAULT_PRICING);
  const [commissionRate, setCommissionRate] = useLocalStorage('commissionRate', DEFAULT_COMMISSION);
  const [surge, setSurge] = useLocalStorage('surgeMultiplier', 1.0);
  const [withdrawalRequests, setWithdrawalRequests] = useLocalStorage<WithdrawalRequest[]>('withdrawalRequests', [
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
    setShowLanding(false);
    
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
          status: (userData.status as any) || 'Pending' 
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
    setShowLanding(true);
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
    // Show landing page first
    if (showLanding) {
      return <LandingPage onGetStarted={() => setShowLanding(false)} />;
    }

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
            // Filter withdrawals for the current driver
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
      {/* Show AI Chat Widget for Passengers only (not on landing page) */}
      {currentRole === UserRole.PASSENGER && !showLanding && (
        <ChatWidget />
      )}
    </div>
  );
};

export default App;