/**
 * SentinelX API entrypoint — Express + WebSocket + prototype seed (SentinelX.in demo roster).
 */
import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { v4 as uuid } from 'uuid';

import { config } from './config/env.js';
import { connectDatabase } from './config/database.js';
import api from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { createLogger } from '../logs/logger.js';
import { attachWebSocket } from '../notifications/websocket.js';
import { hashPassword } from '../auth/auth_service.js';
import { ROLES } from '../auth/role_manager.js';
import * as UserModel from './models/User.js';
import * as ExpenseModel from './models/Expense.js';

const log = createLogger('server');

function makePendingWorkflow(submitterId, note) {
  return {
    status: 'PENDING',
    currentStep: 'MANAGER_REVIEW',
    pendingSteps: ['MANAGER_REVIEW', 'FINANCE_REVIEW'],
    history: [{ at: new Date().toISOString(), by: submitterId, action: 'SUBMITTED', detail: [note || 'seed'] }],
  };
}

async function bootstrap() {
  await connectDatabase();

  const pwd = await hashPassword('password123', config.bcryptRounds);
  const idAdmin = uuid();
  const idExec = uuid();
  const idVikram = uuid();
  const idRitu = uuid();
  const idPriya = uuid();
  const idSneha = uuid();
  const idRahul = uuid();

  UserModel.seedUsers([
    {
      id: idAdmin,
      email: 'admin@sentinelx.in',
      passwordHash: pwd,
      role: ROLES.ADMIN,
      departmentId: 'dept-hq',
      name: 'Arjun Kapoor',
      initials: 'AK',
      departmentLabel: 'IT Administration',
      managerId: null,
      trustScore: 100,
      recentRejections: 0,
    },
    {
      id: idExec,
      email: 'sunita@sentinelx.in',
      passwordHash: pwd,
      role: ROLES.EXECUTIVE,
      departmentId: 'dept-fin',
      name: 'Sunita Rao',
      initials: 'SR',
      departmentLabel: 'Finance',
      managerId: null,
      trustScore: 100,
      recentRejections: 0,
    },
    {
      id: idVikram,
      email: 'vikram@sentinelx.in',
      passwordHash: pwd,
      role: ROLES.MANAGER,
      departmentId: 'dept-eng',
      name: 'Vikram Iyer',
      initials: 'VI',
      departmentLabel: 'Engineering',
      managerId: idExec,
      trustScore: 95,
      recentRejections: 0,
    },
    {
      id: idRitu,
      email: 'ritu@sentinelx.in',
      passwordHash: pwd,
      role: ROLES.MANAGER,
      departmentId: 'dept-fin',
      name: 'Ritu Agarwal',
      initials: 'RA',
      departmentLabel: 'Finance',
      managerId: idExec,
      trustScore: 90,
      recentRejections: 0,
    },
    {
      id: idPriya,
      email: 'priya@sentinelx.in',
      passwordHash: pwd,
      role: ROLES.EMPLOYEE,
      departmentId: 'dept-eng',
      name: 'Priya Sharma',
      initials: 'PS',
      departmentLabel: 'Engineering',
      managerId: idVikram,
      trustScore: 82,
      recentRejections: 0,
    },
    {
      id: idSneha,
      email: 'sneha@sentinelx.in',
      passwordHash: pwd,
      role: ROLES.EMPLOYEE,
      departmentId: 'dept-mkt',
      name: 'Sneha Patel',
      initials: 'SP',
      departmentLabel: 'Marketing',
      managerId: idVikram,
      trustScore: 31,
      recentRejections: 0,
    },
    {
      id: idRahul,
      email: 'rahul@sentinelx.in',
      passwordHash: pwd,
      role: ROLES.EMPLOYEE,
      departmentId: 'dept-sales',
      name: 'Rahul Mehta',
      initials: 'RM',
      departmentLabel: 'Sales',
      managerId: idVikram,
      trustScore: 55,
      recentRejections: 0,
    },
  ]);

  const now = new Date().toISOString();
  const mkExp = (patch) => ({
    id: uuid(),
    currency: 'INR',
    amountBase: patch.amount,
    createdAt: now,
    updatedAt: now,
    workflow: makePendingWorkflow(patch.submitterId, patch.ref),
    ...patch,
  });

  ExpenseModel.seedExpenses([
    mkExp({
      referenceId: 'EX-1043',
      title: 'Leela Palace Mumbai',
      category: 'HOTEL',
      amount: 118000,
      merchant: 'Leela Palace Mumbai',
      description: '',
      submitterId: idSneha,
      departmentId: 'dept-mkt',
      departmentLabel: 'Marketing',
      status: 'PENDING',
      flags: ['Duplicate', 'Off-hours'],
      riskScore: 87,
      trustScore: 31,
      dateDisplay: '27 Mar 2026',
      submittedTime: '2:34 AM',
    }),
    mkExp({
      referenceId: 'EX-1042',
      title: 'Karavalli Bangalore',
      category: 'MEALS',
      amount: 8200,
      merchant: 'Karavalli Bangalore',
      description: 'Client dinner',
      submitterId: idRahul,
      departmentId: 'dept-sales',
      departmentLabel: 'Sales',
      status: 'PENDING',
      flags: ['Off-hours'],
      riskScore: 61,
      trustScore: 55,
      dateDisplay: '28 Mar 2026',
      submittedTime: '2:47 AM',
    }),
    mkExp({
      referenceId: 'EX-1045',
      title: 'Figma Pro Annual',
      category: 'SOFTWARE',
      amount: 11900,
      merchant: 'Figma Pro Annual',
      description: 'Design team subscription renewal',
      submitterId: idPriya,
      departmentId: 'dept-eng',
      departmentLabel: 'Engineering',
      status: 'PENDING',
      flags: [],
      riskScore: 34,
      trustScore: 82,
      dateDisplay: '15 Mar 2026',
      submittedTime: '10:00 AM',
    }),
    mkExp({
      referenceId: 'EX-1041',
      title: 'IndiGo Airlines',
      category: 'TRAVEL',
      amount: 42500,
      merchant: 'IndiGo Airlines',
      description: 'Bangalore–Delhi round trip, conf',
      submitterId: idPriya,
      departmentId: 'dept-eng',
      departmentLabel: 'Engineering',
      status: 'APPROVED',
      flags: [],
      riskScore: 18,
      trustScore: 82,
      dateDisplay: '28 Mar 2026',
      submittedTime: '9:30 AM',
      workflow: {
        status: 'APPROVED',
        currentStep: null,
        pendingSteps: [],
        history: [{ at: now, by: idVikram, action: 'APPROVE', detail: ['seed'] }],
      },
    }),
    mkExp({
      referenceId: 'EX-1040',
      title: 'Taj Conference Centre',
      category: 'CONFERENCE',
      amount: 85000,
      merchant: 'Taj Conference Centre',
      description: 'Tech Summit 2026 registration',
      submitterId: idPriya,
      departmentId: 'dept-eng',
      departmentLabel: 'Engineering',
      status: 'APPROVED',
      flags: [],
      riskScore: 22,
      trustScore: 82,
      dateDisplay: '27 Mar 2026',
      submittedTime: '4:00 PM',
      workflow: {
        status: 'APPROVED',
        currentStep: null,
        pendingSteps: [],
        history: [{ at: now, by: idVikram, action: 'APPROVE', detail: ['seed'] }],
      },
    }),
    mkExp({
      referenceId: 'EX-1029',
      title: 'Hard Rock Café Delhi',
      category: 'MEALS',
      amount: 6800,
      merchant: 'Hard Rock Café Delhi',
      description: 'Team lunch',
      submitterId: idPriya,
      departmentId: 'dept-eng',
      departmentLabel: 'Engineering',
      status: 'REJECTED',
      flags: ['Over limit', 'No receipt'],
      riskScore: 71,
      trustScore: 82,
      dateDisplay: '5 Mar 2026',
      submittedTime: '9:00 PM',
      workflow: {
        status: 'REJECTED',
        currentStep: null,
        pendingSteps: [],
        history: [
          {
            at: now,
            by: idRitu,
            action: 'REJECT',
            detail: ['Amount exceeds per-person meal policy'],
          },
        ],
      },
    }),
  ]);

  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(
    rateLimit({
      windowMs: 60_000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.use(requestLogger);

  app.get('/health', (req, res) => {
    res.json({ ok: true, service: 'sentinelx-api', env: config.nodeEnv });
  });

  app.use('/api/v1', api);
  app.use(errorHandler);

  const server = http.createServer(app);
  const ws = attachWebSocket(server, '/ws');

  server.listen(config.port, () => {
    log.info('listening', { port: config.port });
  });

  globalThis.sentinelxBroadcast = ws.broadcast;

  return { app, server };
}

bootstrap().catch((err) => {
  log.error('fatal', { message: err.message });
  process.exit(1);
});
