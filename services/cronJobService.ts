/**
 * Cron Job Service
 * Schedules and manages automated tasks
 */

export interface CronJob {
  id: string;
  name: string;
  description: string;
  schedule: string; // Cron expression or simple schedule (e.g., "daily", "hourly", "every-6h")
  handler: () => Promise<void>;
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
  lastStatus?: 'success' | 'failed';
}

class CronJobService {
  private static jobs: Map<string, CronJob> = new Map();
  private static intervals: Map<string, NodeJS.Timeout> = new Map();
  private static logs: Array<{ jobId: string; timestamp: Date; status: string; message: string }> = [];

  /**
   * Register a cron job
   */
  static registerJob(job: CronJob): void {
    this.jobs.set(job.id, job);
    console.log(`[CronJob] Registered: ${job.name}`);
  }

  /**
   * Start a cron job
   */
  static startJob(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (!job) {
      console.error(`[CronJob] Job not found: ${jobId}`);
      return;
    }

    if (!job.isActive) {
      job.isActive = true;
    }

    const interval = this.getIntervalMs(job.schedule);
    if (interval > 0) {
      const timeout = setInterval(async () => {
        await this.executeJob(job);
      }, interval);

      this.intervals.set(jobId, timeout);
      console.log(`[CronJob] Started: ${job.name}`);
    }
  }

  /**
   * Stop a cron job
   */
  static stopJob(jobId: string): void {
    const interval = this.intervals.get(jobId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(jobId);
      const job = this.jobs.get(jobId);
      if (job) {
        job.isActive = false;
      }
      console.log(`[CronJob] Stopped: ${jobId}`);
    }
  }

  /**
   * Execute a job
   */
  private static async executeJob(job: CronJob): Promise<void> {
    try {
      job.lastRun = new Date();
      await job.handler();
      job.lastStatus = 'success';
      this.addLog(job.id, 'success', 'Job executed successfully');
      console.log(`[CronJob] Success: ${job.name}`);
    } catch (error) {
      job.lastStatus = 'failed';
      this.addLog(job.id, 'failed', `Error: ${error instanceof Error ? error.message : String(error)}`);
      console.error(`[CronJob] Failed: ${job.name}`, error);
    }
  }

  /**
   * Add log entry
   */
  private static addLog(jobId: string, status: string, message: string): void {
    this.logs.push({
      jobId,
      timestamp: new Date(),
      status,
      message
    });

    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs.shift();
    }
  }

  /**
   * Get interval in milliseconds from schedule string
   */
  private static getIntervalMs(schedule: string): number {
    switch (schedule.toLowerCase()) {
      case 'hourly':
        return 3600000; // 1 hour
      case 'daily':
        return 86400000; // 24 hours
      case 'weekly':
        return 604800000; // 7 days
      case 'every-6h':
        return 21600000; // 6 hours
      case 'every-30m':
        return 1800000; // 30 minutes
      case 'every-5m':
        return 300000; // 5 minutes
      default:
        return 0;
    }
  }

  /**
   * Get all jobs
   */
  static getAllJobs(): CronJob[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Get job by ID
   */
  static getJob(jobId: string): CronJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get logs for a job
   */
  static getJobLogs(jobId: string, limit: number = 50): typeof CronJobService.logs {
    return this.logs
      .filter(log => log.jobId === jobId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get all logs
   */
  static getAllLogs(limit: number = 100): typeof CronJobService.logs {
    return this.logs.slice(-limit).reverse();
  }

  /**
   * Start all active jobs
   */
  static startAllJobs(): void {
    this.jobs.forEach((job) => {
      if (job.isActive) {
        this.startJob(job.id);
      }
    });
  }

  /**
   * Stop all jobs
   */
  static stopAllJobs(): void {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
  }
}

// Default cron jobs
export const createDefaultCronJobs = () => {
  // 1. Fraud Detection Job - runs every 6 hours
  CronJobService.registerJob({
    id: 'fraud-detection',
    name: 'Fraud Detection Check',
    description: 'Analyze user behavior patterns for fraud indicators',
    schedule: 'every-6h',
    handler: async () => {
      console.log('[CronJob] Running fraud detection analysis...');
      // In production, this would query database and run FraudDetectionService
      // const users = await getUsersForFraudCheck();
      // users.forEach(user => FraudDetectionService.detectFraud(user));
    },
    isActive: true
  });

  // 2. Cleanup Inactive Sessions - runs daily
  CronJobService.registerJob({
    id: 'cleanup-sessions',
    name: 'Cleanup Inactive Sessions',
    description: 'Remove expired and inactive session tokens',
    schedule: 'daily',
    handler: async () => {
      console.log('[CronJob] Cleaning up inactive sessions...');
      // await cleanupInactiveSessions();
    },
    isActive: true
  });

  // 3. Generate Reports - runs daily at midnight
  CronJobService.registerJob({
    id: 'daily-reports',
    name: 'Generate Daily Reports',
    description: 'Generate daily revenue and usage reports',
    schedule: 'daily',
    handler: async () => {
      console.log('[CronJob] Generating daily reports...');
      // await generateDailyReports();
    },
    isActive: true
  });

  // 4. Sync Payment Status - runs every 30 minutes
  CronJobService.registerJob({
    id: 'payment-sync',
    name: 'Sync Payment Status',
    description: 'Check pending payment statuses with payment gateway',
    schedule: 'every-30m',
    handler: async () => {
      console.log('[CronJob] Syncing payment statuses...');
      // await syncPaymentStatuses();
    },
    isActive: true
  });

  // 5. Send Notifications - runs every 5 minutes
  CronJobService.registerJob({
    id: 'send-notifications',
    name: 'Send Pending Notifications',
    description: 'Process and send queued notifications to users',
    schedule: 'every-5m',
    handler: async () => {
      console.log('[CronJob] Processing notifications...');
      // await processPendingNotifications();
    },
    isActive: true
  });

  // 6. Database Maintenance - runs weekly
  CronJobService.registerJob({
    id: 'db-maintenance',
    name: 'Database Maintenance',
    description: 'Optimize database indexes and clean old logs',
    schedule: 'weekly',
    handler: async () => {
      console.log('[CronJob] Running database maintenance...');
      // await optimizeDatabaseIndexes();
      // await cleanOldLogs();
    },
    isActive: false // Disabled by default
  });

  // 7. Check App Updates - runs hourly
  CronJobService.registerJob({
    id: 'check-app-updates',
    name: 'Check for App Updates',
    description: 'Check if forced app updates need to be pushed',
    schedule: 'hourly',
    handler: async () => {
      console.log('[CronJob] Checking app updates...');
      // await checkAndPushUpdates();
    },
    isActive: true
  });

  // 8. Reconcile Accounts - runs daily
  CronJobService.registerJob({
    id: 'account-reconciliation',
    name: 'Account Reconciliation',
    description: 'Reconcile driver and passenger accounts with payment records',
    schedule: 'daily',
    handler: async () => {
      console.log('[CronJob] Reconciling accounts...');
      // await reconcileAccounts();
    },
    isActive: true
  });
};

export default CronJobService;
