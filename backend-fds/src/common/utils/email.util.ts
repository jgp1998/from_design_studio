export function isCorporateEmail(email: string): boolean {
  const freeDomains = [
    'gmail.com',
    'hotmail.com',
    'yahoo.com',
    'outlook.com',
    'live.com',
    'aol.com',
    'icloud.com',
  ];

  const domain = email.split('@')[1];
  if (!domain) return false;

  return !freeDomains.includes(domain.toLowerCase());
}
