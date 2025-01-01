import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ManagementClient } from 'auth0';

import { Role } from '@/utils/enums/roles.enum';

@Injectable()
export class Auth0Service {
  private managementClient: ManagementClient;

  constructor(private configService: ConfigService) {
    const domain = this.configService.get('AUTH0_DOMAIN');
    const clientId = this.configService.get('AUTH0_CLIENT_ID');
    const clientSecret = this.configService.get('AUTH0_CLIENT_SECRET');

    if (!domain || !clientId || !clientSecret) {
      throw new Error('Missing Auth0 configuration values.');
    }

    const options = {
      domain,
      clientId,
      clientSecret,
    };

    this.managementClient = new ManagementClient(options);
  }

  async getUser(userId: string) {
    try {
      const user = await this.managementClient.users.get({ id: userId });
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error retrieving user: ${error.message}`);
      }
    }
  }

  async updateRole(userId: string, roleNames: Role[]) {
    try {
      const response = await this.managementClient.roles.getAll();
      const roles = response.data;

      type RoleData = { id: string; name: string; description?: string };

      if (!roles) {
        throw new Error('Failed to retrieve roles from Auth0.');
      }

      const roleIds = roles
        .filter((role: RoleData) => {
          return roleNames.includes(role.name as Role);
        })
        .map((role: RoleData) => role.id);

      if (roleIds.length === 0) {
        throw new Error('No matching roles found for the provided role names.');
      }

      await this.managementClient.users.assignRoles(
        { id: userId },
        { roles: roleIds },
      );

      return {
        message: `Roles [${roleNames.join(
          ', ',
        )}] successfully assigned to user with ID: ${userId}`,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating roles: ${error.message}`);
      }
      throw error;
    }
  }

  async deleteRole(userId: string, roleName: string): Promise<void> {
    try {
      const response = await this.managementClient.roles.getAll();
      const roles = response.data;

      if (!roles) {
        throw new Error('Failed to retrieve roles from Auth0.');
      }

      const roleToRemove = roles.find((role) => role.name === roleName);

      if (!roleToRemove) {
        console.warn(`Role "${roleName}" not found in Auth0.`);
        return;
      }

      await this.managementClient.users.deleteRoles(
        { id: userId },
        { roles: [roleToRemove.id] },
      );

      console.log(
        `Role "${roleName}" successfully removed from user ${userId}.`,
      );
    } catch (error) {
      console.error(`Error removing role "${roleName}" from Auth0:`, error);
      throw new Error(`Failed to remove role "${roleName}" from Auth0.`);
    }
  }

  async updateMetadata(authId: string, metadata: object): Promise<void> {
    try {
      await this.managementClient.users.update(
        { id: authId },
        {
          user_metadata: metadata,
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error updating metadata for user ${authId}: ${error.message}`,
        );
      }
    }
  }
}
