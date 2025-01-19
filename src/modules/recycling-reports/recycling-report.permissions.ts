import { Permission } from '@/shared/enums/permissions.enums';

export const RecyclingReportPermissionsAdmin = [
  Permission.DELETE_REPORTS,
  Permission.READ_REPORTS,
  Permission.UPDATE_REPORTS,
  Permission.WRITE_REPORTS,
];

export const RecyclingReportPermissions = [Permission.READ_REPORTS, Permission.WRITE_REPORTS];
