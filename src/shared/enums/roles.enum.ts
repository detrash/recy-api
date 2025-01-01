export const Roles = {
  ADMIN: 'admin',
  AUDITOR: 'auditor',
  NEW_USER: 'new-user',
  PARTNER: 'partner',
  RECYCLER: 'recycler',
  WASTE_GENERATOR: 'waste-generator',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
