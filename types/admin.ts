// Admin Platform Configuration Types

export interface BrandingSettings {
  platformName: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
  supportUrl: string;
  privacyUrl: string;
  termsUrl: string;
}

export interface PaymentProvider {
  id: string;
  name: 'paystack' | 'flutterwave' | 'monnify' | 'manual';
  isActive: boolean;
  apiKey?: string;
  secretKey?: string;
  publicKey?: string;
  merchantId?: string;
  // For manual gateway
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
  };
}

export interface EmailProvider {
  id: string;
  provider: 'resend' | 'smtp';
  isActive: boolean;
  resendConfig?: {
    apiKey: string;
  };
  smtpConfig?: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
    fromEmail: string;
  };
}

export interface SMSProvider {
  id: string;
  provider: 'twilio';
  isActive: boolean;
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

export interface PushNotificationProvider {
  id: string;
  provider: 'onesignal' | 'firebase';
  isActive: boolean;
  oneSignalConfig?: {
    appId: string;
    apiKey: string;
  };
  firebaseConfig?: {
    projectId: string;
    apiKey: string;
    messagingSenderId: string;
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  createdAt: number;
  updatedAt: number;
}

export interface SMSTemplate {
  id: string;
  name: string;
  body: string;
  variables: string[];
  createdAt: number;
  updatedAt: number;
}

export interface StaffRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: number;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  isActive: boolean;
  createdAt: number;
}

export interface AccessControl {
  id: string;
  name: string;
  type: 'region' | 'ip' | 'device' | 'os' | 'country';
  rules: string[];
  isRestriction: boolean; // true for blacklist, false for whitelist
  isActive: boolean;
}

export interface PlatformSettings {
  branding: BrandingSettings;
  paymentProviders: PaymentProvider[];
  emailProvider: EmailProvider;
  smsProvider: SMSProvider;
  pushNotificationProvider: PushNotificationProvider;
  emailTemplates: EmailTemplate[];
  smsTemplates: SMSTemplate[];
  staffRoles: StaffRole[];
  staffMembers: StaffMember[];
  accessControls: AccessControl[];
  enableMonetization: boolean;
  enableInAppNotifications: boolean;
  enableVoiceNotifications: boolean;
}
