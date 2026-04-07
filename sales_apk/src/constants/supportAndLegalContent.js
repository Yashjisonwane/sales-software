export const TERMS_LAST_UPDATED = 'April 2026';
export const TERMS_APP_NAME = 'HinesQ';

export const TERMS_SECTIONS = [
  {
    title: '1. Scope of service',
    content:
      'HinesQ connects customers with service professionals. You agree to perform work professionally, on time, and in line with applicable laws and safety rules.',
  },
  {
    title: '2. Payments',
    content:
      'Customer payments may be collected through integrated providers (e.g. card or wallet). Platform or processing fees, if any, are shown before you confirm a job or invoice.',
  },
  {
    title: '3. Accounts & data',
    content:
      'You are responsible for account security and accurate profile information. We may suspend accounts that abuse the platform or put users at risk.',
  },
  {
    title: '4. Conduct',
    content:
      'Harassment, fraud, and illegal activity are prohibited. Prefer in-app messaging for job-related communication when available.',
  },
  {
    title: '5. Limitation of liability',
    content:
      'HinesQ is a marketplace; disputes about workmanship or timing are primarily between customer and professional. Our liability is limited to the extent permitted by law.',
  },
];

export const HELP_CONTACT_OPTIONS = [
  {
    icon: 'mail-outline',
    title: 'Email support',
    desc: 'We usually reply within one business day.',
    color: '#8B5CF6',
    url: 'mailto:support@hinesq.com?subject=HinesQ%20app%20help',
  },
  {
    icon: 'call-outline',
    title: 'Phone',
    desc: 'Mon–Fri, 9am–6pm (your local time).',
    color: '#10B981',
    url: 'tel:+18005550199',
  },
  {
    icon: 'chatbubble-ellipses-outline',
    title: 'In-app messages',
    desc: 'For job-specific questions, use chat on the relevant job.',
    color: '#0062E1',
    url: null,
  },
];

export const HELP_FAQ_ITEMS = [
  {
    q: 'How do I update my business name?',
    a: 'Admin: Settings → Business name. It is saved to your account on the server.',
  },
  {
    q: 'Where do payout bank details go?',
    a: 'Settings → Bank details saves masked account info (last digits) on your profile. Full banking integrations can be added later.',
  },
  {
    q: 'Why are some screens marked preview?',
    a: 'Team, tax, inventory, and campaigns may show sample content until those modules are connected to your backend. Profile, jobs, and invoices already sync with the server.',
  },
  {
    q: 'How do I reset my password?',
    a: 'Use Security in settings to set a new password, or the reset flow from the login screen if you are signed out.',
  },
];
