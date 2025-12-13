/**
 * Fraud Detection Service
 * Detects suspicious behavior patterns and flags potential fraud
 */

export interface FraudAlert {
  id: string;
  userId: string;
  userType: 'user' | 'driver';
  alertType: 'fake_booking' | 'multiple_cancellations' | 'unusual_location' | 'rating_manipulation' | 'payment_anomaly';
  riskScore: number; // 0-100
  description: string;
  evidence: string[];
  timestamp: string;
  action?: 'warning' | 'suspended' | 'escalated';
}

export interface UserBehavior {
  userId: string;
  userType: 'user' | 'driver';
  totalRides: number;
  cancellationRate: number;
  avgRating: number;
  ratingCount: number;
  lastLocationChange: { lat: number; lng: number; time: string };
  consecutiveBookings: number;
  paymentFailures: number;
  accountAge: number; // in days
  deviceCount: number;
  unusualActivity: boolean;
}

class FraudDetectionService {
  /**
   * Analyze user behavior and detect fraud patterns
   */
  static detectFraud(behavior: UserBehavior): FraudAlert | null {
    const alerts: FraudAlert[] = [];
    let riskScore = 0;
    const evidence: string[] = [];

    // Check 1: Excessive Cancellations
    if (behavior.cancellationRate > 0.5) {
      riskScore += 25;
      evidence.push(`High cancellation rate: ${(behavior.cancellationRate * 100).toFixed(1)}%`);
    }

    // Check 2: New Account with High Activity
    if (behavior.accountAge < 7 && behavior.totalRides > 20) {
      riskScore += 20;
      evidence.push(`New account (${behavior.accountAge} days) with ${behavior.totalRides} rides`);
    }

    // Check 3: Rating Manipulation
    if (behavior.ratingCount > 50 && behavior.avgRating > 4.8) {
      riskScore += 15;
      evidence.push(`Unusually high rating: ${behavior.avgRating} from ${behavior.ratingCount} ratings`);
    }

    // Check 4: Consecutive Bookings Without Completion
    if (behavior.consecutiveBookings > 5) {
      riskScore += 20;
      evidence.push(`${behavior.consecutiveBookings} consecutive bookings`);
    }

    // Check 5: Payment Failures
    if (behavior.paymentFailures > 3) {
      riskScore += 20;
      evidence.push(`${behavior.paymentFailures} payment failures`);
    }

    // Check 6: Multiple Devices from Different Locations
    if (behavior.deviceCount > 5) {
      riskScore += 15;
      evidence.push(`Activity from ${behavior.deviceCount} different devices`);
    }

    // Check 7: Multiple Accounts Detection
    if (behavior.totalRides === 0 && behavior.accountAge < 1) {
      riskScore += 30;
      evidence.push('New account with no activity - possible test account');
    }

    // Check 8: Unusual Location Jumps
    const locationJump = this.detectUnusualLocationJump(behavior.lastLocationChange);
    if (locationJump) {
      riskScore += 20;
      evidence.push(`Unusual location: ${locationJump}`);
    }

    // If risk score is significant, create alert
    if (riskScore >= 25) {
      const alertType = this.determineAlertType(evidence, behavior);
      return {
        id: `fraud_${behavior.userId}_${Date.now()}`,
        userId: behavior.userId,
        userType: behavior.userType,
        alertType,
        riskScore: Math.min(riskScore, 100),
        description: this.generateDescription(alertType, riskScore),
        evidence,
        timestamp: new Date().toISOString(),
        action: riskScore >= 70 ? 'suspended' : riskScore >= 50 ? 'escalated' : 'warning'
      };
    }

    return null;
  }

  /**
   * Detect fake booking patterns
   */
  static detectFakeBooking(
    userId: string,
    pickupLocation: { lat: number; lng: number },
    dropoffLocation: { lat: number; lng: number },
    userBehavior: UserBehavior
  ): FraudAlert | null {
    const alerts: FraudAlert[] = [];
    const evidence: string[] = [];
    let riskScore = 0;

    // Check 1: Same location for pickup and dropoff
    const sameLocation = Math.abs(pickupLocation.lat - dropoffLocation.lat) < 0.001 &&
      Math.abs(pickupLocation.lng - dropoffLocation.lng) < 0.001;
    if (sameLocation) {
      riskScore += 30;
      evidence.push('Pickup and dropoff at same location');
    }

    // Check 2: Very short distance but high fare request
    const distance = this.calculateDistance(pickupLocation, dropoffLocation);
    if (distance < 0.5 && distance > 0) {
      riskScore += 15;
      evidence.push(`Very short distance: ${distance.toFixed(2)} km`);
    }

    // Check 3: Pattern of fake bookings
    if (userBehavior.cancellationRate > 0.6) {
      riskScore += 25;
      evidence.push('High cancellation pattern suggesting fake bookings');
    }

    // Check 4: High frequency of bookings
    if (userBehavior.consecutiveBookings > 10) {
      riskScore += 20;
      evidence.push(`Excessive bookings in short time: ${userBehavior.consecutiveBookings}`);
    }

    if (riskScore >= 25) {
      return {
        id: `fakebooking_${userId}_${Date.now()}`,
        userId,
        userType: 'user',
        alertType: 'fake_booking',
        riskScore: Math.min(riskScore, 100),
        description: `Potential fake booking detected. Risk Level: ${this.getRiskLevel(riskScore)}`,
        evidence,
        timestamp: new Date().toISOString(),
        action: riskScore >= 60 ? 'suspended' : riskScore >= 40 ? 'escalated' : 'warning'
      };
    }

    return null;
  }

  /**
   * Detect unusual location jumps (teleportation)
   */
  private static detectUnusualLocationJump(location: { lat: number; lng: number; time: string }): string | null {
    // Lagos approximate bounds
    const lagosLat = { min: 6.3, max: 6.7 };
    const lagosLng = { min: 3.1, max: 3.5 };

    if (location.lat < lagosLat.min || location.lat > lagosLat.max ||
        location.lng < lagosLng.min || location.lng > lagosLng.max) {
      return `Location outside expected area: ${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`;
    }

    return null;
  }

  /**
   * Calculate distance between two coordinates (simplified)
   */
  private static calculateDistance(loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }): number {
    const latDiff = Math.abs(loc1.lat - loc2.lat);
    const lngDiff = Math.abs(loc1.lng - loc2.lng);
    // Rough approximation: ~111 km per degree
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;
  }

  /**
   * Determine alert type based on evidence
   */
  private static determineAlertType(
    evidence: string[],
    behavior: UserBehavior
  ): FraudAlert['alertType'] {
    const evidenceStr = evidence.join(' ').toLowerCase();

    if (evidenceStr.includes('cancellation')) return 'multiple_cancellations';
    if (evidenceStr.includes('location')) return 'unusual_location';
    if (evidenceStr.includes('rating')) return 'rating_manipulation';
    if (evidenceStr.includes('payment')) return 'payment_anomaly';
    return 'fake_booking';
  }

  /**
   * Generate human-readable description
   */
  private static generateDescription(alertType: FraudAlert['alertType'], riskScore: number): string {
    const level = this.getRiskLevel(riskScore);

    switch (alertType) {
      case 'fake_booking':
        return `Potential fake booking activity detected (${level} risk). User shows suspicious booking patterns.`;
      case 'multiple_cancellations':
        return `Excessive cancellations detected (${level} risk). Pattern suggests possible fraud or service abuse.`;
      case 'unusual_location':
        return `Unusual location activity detected (${level} risk). Activity outside expected area or teleportation detected.`;
      case 'rating_manipulation':
        return `Rating manipulation suspected (${level} risk). Unusually high ratings with unusual patterns.`;
      case 'payment_anomaly':
        return `Payment anomalies detected (${level} risk). Multiple payment failures or unusual payment behavior.`;
      default:
        return `Fraud alert triggered (${level} risk). Review user activity immediately.`;
    }
  }

  /**
   * Get risk level text
   */
  private static getRiskLevel(score: number): string {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Get recommended action based on risk score
   */
  static getRecommendedAction(riskScore: number): 'warning' | 'escalated' | 'suspended' {
    if (riskScore >= 70) return 'suspended';
    if (riskScore >= 50) return 'escalated';
    return 'warning';
  }

  /**
   * Auto-suspend user for fraud
   */
  static shouldAutoSuspend(alert: FraudAlert): boolean {
    return alert.riskScore >= 75 || (alert.action === 'suspended' && alert.alertType === 'fake_booking');
  }
}

export default FraudDetectionService;
