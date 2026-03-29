/**
 * Sidebar navigation — mirrors the HTML prototype sections/items.
 * badgeKey references data computed in PrototypeLayout.
 */

export const NAV_CONFIG = {
  admin: [
    { section: 'Overview', items: [{ pageKey: 'admin-dashboard', label: 'Dashboard', icon: '⊞' }] },
    {
      section: 'Management',
      items: [
        { pageKey: 'admin-users', label: 'User Management', icon: '👥', badgeKey: 'userCount', badgeCls: 'muted' },
        { pageKey: 'admin-expenses', label: 'All Expenses', icon: '🗂', badgeKey: 'expenseCount', badgeCls: 'muted' },
        { pageKey: 'admin-approvers', label: 'Approval Flows', icon: '🔀' },
      ],
    },
    {
      section: 'Governance',
      items: [
        { pageKey: 'admin-audit', label: 'Audit Trail', icon: '📋' },
        { pageKey: 'admin-policy', label: 'Policy Engine', icon: '⚙' },
        { pageKey: 'admin-analytics', label: 'Analytics', icon: '📊' },
      ],
    },
  ],
  executive: [
    {
      section: 'Strategic',
      items: [
        { pageKey: 'exec-overview', label: 'Overview', icon: '⊞' },
        { pageKey: 'exec-trends', label: 'Spend Trends', icon: '📈' },
        { pageKey: 'exec-departments', label: 'Departments', icon: '🏢' },
      ],
    },
    {
      section: 'Governance',
      items: [
        { pageKey: 'exec-fraud', label: 'Fraud Summary', icon: '🛡' },
        {
          pageKey: 'exec-escalations',
          label: 'Escalations',
          icon: '⚠',
          badgeKey: 'highRiskQueue',
        },
      ],
    },
  ],
  manager: [
    { section: 'Overview', items: [{ pageKey: 'mgr-dashboard', label: 'Dashboard', icon: '⊞' }] },
    {
      section: 'Approvals',
      items: [
        { pageKey: 'mgr-queue', label: 'Approval Queue', icon: '📋', badgeKey: 'mgrQueue' },
        { pageKey: 'mgr-history', label: 'Decision History', icon: '🕐' },
      ],
    },
    {
      section: 'Team',
      items: [
        { pageKey: 'mgr-team', label: 'My Team', icon: '👥', badgeKey: 'teamCount', badgeCls: 'muted' },
        { pageKey: 'mgr-settings', label: 'Workflow Rules', icon: '⚙' },
      ],
    },
  ],
  employee: [
    {
      section: 'Overview',
      items: [
        { pageKey: 'emp-home', label: 'Home', icon: '⊞' },
        { pageKey: 'emp-notifs', label: 'Notifications', icon: '🔔', badgeKey: 'notifCount' },
      ],
    },
    {
      section: 'Expenses',
      items: [
        { pageKey: 'emp-submit', label: 'New Expense', icon: '＋' },
        { pageKey: 'emp-expenses', label: 'My Expenses', icon: '🗂', badgeKey: 'myExpenseCount', badgeCls: 'muted' },
      ],
    },
    { section: 'Profile', items: [{ pageKey: 'emp-trust', label: 'Trust Score', icon: '✓' }] },
  ],
};

export const CRUMB_MAP = {
  'admin-dashboard': 'Dashboard',
  'admin-users': 'User Management',
  'admin-expenses': 'All Expenses',
  'admin-approvers': 'Approval Flows',
  'admin-audit': 'Audit Trail',
  'admin-policy': 'Policy Engine',
  'admin-analytics': 'Analytics',
  'exec-overview': 'Overview',
  'exec-trends': 'Spend Trends',
  'exec-departments': 'Departments',
  'exec-fraud': 'Fraud Summary',
  'exec-escalations': 'Escalations',
  'mgr-dashboard': 'Dashboard',
  'mgr-queue': 'Approval Queue',
  'mgr-history': 'Decision History',
  'mgr-team': 'My Team',
  'mgr-settings': 'Workflow Rules',
  'emp-home': 'Home',
  'emp-notifs': 'Notifications',
  'emp-submit': 'New Expense',
  'emp-expenses': 'My Expenses',
  'emp-trust': 'Trust Score',
};

export const ENV_LABEL = {
  admin: 'Admin Portal',
  executive: 'Executive View',
  manager: 'Manager Portal',
  employee: 'My Workspace',
};
