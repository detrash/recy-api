import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { ulid } from 'ulid';

import { PrismaService } from '@/modules/prisma/prisma.service';
import { paginate, PaginatedResult } from '@/shared/utils/pagination.util';
import {
  calculateTotalMaterials,
  getTotalResidueKgsReported,
} from '@/shared/utils/recycling-report';
import { Role, Roles } from '@/utils/enums/roles.enum';

import { Auth0Service } from '../auth0/auth0.service';
import { Material, Materials } from '../recycling-reports/types';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ValidateUserDto } from './dtos/validate-user.dto';
import { UserQueryParams } from './interface/user.types';
import { ValidateUserResponse } from './types';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth0Service: Auth0Service,
  ) {}

  async checkUserExists(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, name, phone, walletAddress, roleIds, authId, authProvider } =
      createUserDto;

    // Check if the user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists.`);
    }

    // Fetch roles by the provided role IDs
    const roles = await this.prisma.role.findMany({
      where: {
        id: { in: roleIds }, // Fetching roles by the provided IDs
      },
    });

    // Check if any role IDs are invalid (i.e., don't exist in the database)
    const invalidRoleIds = roleIds.filter(
      (roleId) => !roles.some((role) => role.id === roleId),
    );

    if (invalidRoleIds.length > 0) {
      throw new ForbiddenException(
        `One or more Role IDs are invalid: ${invalidRoleIds.join(', ')}`,
      );
    }

    // Check if the "admin" role is being assigned
    const hasAdminRole = roles.some((role) => role.name === Roles.ADMIN);
    if (hasAdminRole) {
      throw new ForbiddenException(
        'You are not allowed to assign the "admin" role.',
      );
    }

    // Check for restrictions between "Waste Generator" or "Partner" roles and "Auditor"
    const hasWasteGeneratorRole = roles.some(
      (role) => role.name === Roles.WASTE_GENERATOR,
    );
    const hasPartnerRole = roles.some((role) => role.name === Roles.PARTNER);
    const hasAuditorRole = roles.some((role) => role.name === Roles.AUDITOR);

    if ((hasWasteGeneratorRole || hasPartnerRole) && !hasAuditorRole) {
      throw new ForbiddenException(
        'Waste Generators or Partners can only be assigned the "Auditor" role in addition to their main role.',
      );
    }

    if (hasAuditorRole && !(hasWasteGeneratorRole || hasPartnerRole)) {
      throw new ForbiddenException(
        'Only Waste Generators or Partners can be assigned the "Auditor" role.',
      );
    }

    // Generate a ULID for the new user ID
    const userId = ulid();

    // Proceed with user creation if all validations pass
    const user = await this.prisma.user.create({
      data: {
        id: userId, // Set the generated ULID as the user ID
        email,
        name,
        phone,
        authProvider,
        authId,
        walletAddress,
        userRoles: {
          create: roles.map((role) => ({
            role: { connect: { id: role.id } }, // Connect roles by their ID
          })),
        },
      },
      include: { userRoles: { include: { role: true } } },
    });

    // Extract role names from the userRoles relation
    const roleNames = user.userRoles.map((userRole) => userRole.role.name);

    if (authId) {
      await this.auth0Service.updateRole(authId, roleNames as Role[]);

      await this.auth0Service.updateMetadata(authId, {
        id: userId,
        walletAddress,
      });
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
        include: { userRoles: { include: { role: true } } },
      });

      if (!existingUser) {
        throw new ConflictException(`User to be updated doesn't exist.`);
      }

      const { roleIds, ...updateData } = updateUserDto;

      if (roleIds?.length) {
        const roles = await this.prisma.role.findMany({
          where: {
            id: { in: roleIds },
          },
        });

        // Add role validation logic here
        const hasAdminRole = roles.some((role) => role.name === Roles.ADMIN);
        if (hasAdminRole) {
          throw new ForbiddenException(
            'You are not allowed to assign the "admin" role.',
          );
        }

        const hasWasteGeneratorRole = roles.some(
          (role) => role.name === Roles.WASTE_GENERATOR,
        );
        const hasPartnerRole = roles.some(
          (role) => role.name === Roles.PARTNER,
        );
        const hasAuditorRole = roles.some(
          (role) => role.name === Roles.AUDITOR,
        );

        if ((hasWasteGeneratorRole || hasPartnerRole) && !hasAuditorRole) {
          throw new ForbiddenException(
            'Waste Generators or Partners can only be assigned the "Auditor" role in addition to their main role.',
          );
        }

        if (hasAuditorRole && !(hasWasteGeneratorRole || hasPartnerRole)) {
          throw new ForbiddenException(
            'Only Waste Generators or Partners can be assigned the "Auditor" role.',
          );
        }

        const currentRoles = existingUser.userRoles.map(
          (userRole) => userRole.role.id,
        );

        // Filter roles to add
        const rolesToAdd = roles.filter(
          (role) => !currentRoles.includes(role.id),
        );

        // Filter roles to remove, ensuring "new-user" is removed if other roles are selected
        const rolesToRemove = existingUser.userRoles.filter(
          (userRole) =>
            !roleIds.includes(userRole.role.id) ||
            (userRole.role.name === Roles.NEW_USER && roleIds.length > 1),
        );

        const hasNewUserRole = existingUser.userRoles.some(
          (item) => item.role.name === Roles.NEW_USER,
        );

        if (hasNewUserRole && (updateData.authId || existingUser.authId))
          this.auth0Service.deleteRole(
            updateData.authId || existingUser.authId || '',
            Roles.NEW_USER,
          );

        // Remove old roles and assign new ones in the database
        await this.prisma.user.update({
          where: { id },
          data: {
            userRoles: {
              deleteMany: {
                id: { in: rolesToRemove.map((userRole) => userRole.id) },
              },
              create: rolesToAdd.map((role) => ({
                role: { connect: { id: role.id } },
              })),
            },
          },
        });
      }

      // Update user data
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateData,
        include: { userRoles: { include: { role: true } } },
      });

      if (updatedUser.authId) {
        if (roleIds?.length) {
          const roleNames = updatedUser.userRoles.map(
            (userRole) => userRole.role.name,
          );

          // Update roles in Auth0
          await this.auth0Service.updateRole(
            updatedUser.authId,
            roleNames as Role[],
          );
        }

        await this.auth0Service.updateMetadata(String(updatedUser.authId), {
          id: updatedUser.id,
          walletAddress: updatedUser.walletAddress,
        });
      }

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);

      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while updating the user.',
      );
    }
  }

  async deleteUser(id: string): Promise<User> {
    this.checkUserExists(id);

    return this.prisma.user.delete({
      where: { id },
      include: { userRoles: { include: { role: true } } },
    });
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: { include: { role: true } },
        audits: true,
        recyclingReports: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return user;
  }

  async findAllUsers(params: UserQueryParams): Promise<PaginatedResult<User>> {
    return paginate<User>(
      () =>
        this.prisma.user.count({
          where: {},
        }),
      (skip, take) =>
        this.prisma.user.findMany({
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            userRoles: { include: { role: true } },
            audits: true,
            recyclingReports: true,
          },
          where: {},
        }),
      params,
    );
  }

  async validateUser(
    validateUserDto: ValidateUserDto,
  ): Promise<ValidateUserResponse> {
    const { authId, email, name, picture, authProvider } = validateUserDto;

    // Check if the user already exists by email, including the 'userRoles' relation
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    // If the user exists but the authId or authProvider are different, update the data
    if (existingUserByEmail) {
      const {
        authId: existingAuthId,
        authProvider: existingAuthProvider,
        picture: existingPicture,
        userRoles, // Agora 'userRoles' está disponível
      } = existingUserByEmail;

      await this.auth0Service.updateMetadata(authId, {
        id: existingUserByEmail.id,
        walletAddress: existingUserByEmail.walletAddress,
      });

      // Check if any value has changed
      const isUpdated =
        existingAuthId !== authId ||
        existingAuthProvider !== authProvider ||
        existingPicture !== picture;

      if (isUpdated) {
        // Update the user if necessary
        const updatedUser = await this.updateUser(existingUserByEmail.id, {
          authId,
          authProvider,
          picture,
        });

        // Extract role names from the userRoles relation
        const roleNames = userRoles.map((userRole) => userRole.role.name);

        // Update roles in Auth0 with role names
        await this.auth0Service.updateRole(authId, roleNames as Role[]);

        // Return the updated user without adding the 'new' role
        return { userExists: true, user: updatedUser };
      }

      // If there are no changes, return the existing user
      return { userExists: true, user: existingUserByEmail };
    }

    // If the user does not exist, create a new one
    // Fetch the 'NEW_USER' role ID from the database
    const newUserRole = await this.prisma.role.findUnique({
      where: { name: Roles.NEW_USER },
    });

    if (!newUserRole) {
      throw new Error(`Role '${Roles.NEW_USER}' does not exist.`);
    }

    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        authId,
        authProvider,
        picture,
        userRoles: {
          create: {
            roleId: newUserRole.id,
          },
        },
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Extract role names from the new user's roles
    const newUserRoleNames = newUser.userRoles.map(
      (userRole) => userRole.role.name,
    );

    // Update metadata and assign the role names in Auth0
    await this.auth0Service.updateMetadata(authId, {
      id: newUser.id,
      walletAddress: newUser.walletAddress,
    });

    await this.auth0Service.updateRole(authId, newUserRoleNames as Role[]);

    return { userExists: false, user: newUser };
  }

  async getStatsForUser(userId: string) {
    // Count the total number of reports submitted by the user
    const totalReports = await this.prisma.recyclingReport.count({
      where: { submittedBy: userId },
    });

    // Fetch all the user's reports (ordered by date)
    const allReports = await this.prisma.recyclingReport.findMany({
      where: { submittedBy: userId },
      orderBy: { reportDate: 'desc' },
      select: {
        id: true,
        reportDate: true,
        materials: true,
        residueEvidence: true,
        metadata: true,
      },
    });

    // Get the current month and the last month
    const currentMonth = new Date();
    const firstDayOfCurrentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    );
    const firstDayOfLastMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1,
    );
    const lastDayOfLastMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      0,
    ); // last day of the previous month

    // Filter reports for the current month
    const currentMonthReports = allReports?.filter((report) => {
      const reportDate = new Date(report.reportDate);
      return reportDate >= firstDayOfCurrentMonth;
    });

    // Filter reports for the last month
    const lastMonthReports = allReports?.filter((report) => {
      const reportDate = new Date(report.reportDate);
      return (
        reportDate >= firstDayOfLastMonth && reportDate <= lastDayOfLastMonth
      );
    });

    // Calculate total residue for all reports (no filtering by month)
    const { totalKg: totalResidueKgAllReports } = getTotalResidueKgsReported(
      allReports
        ?.filter((item) => item.materials)
        .map((item) => item.materials as Material), // Assert that item.materials is of type Material
    );

    // Calculate total residue for the current month
    const {
      totalKg: totalKgCurrentMonth,
      // residueMaterialWeights: residueMaterialWeightsCurrentMonth,
    } = getTotalResidueKgsReported(
      currentMonthReports
        .filter((item) => item.materials)
        .map((item) => item.materials as Material), // Assert that item.materials is of type Material
    );

    // Calculate total residue for the last month
    const {
      totalKg: totalKgLastMonth,
      // residueMaterialWeights: residueMaterialWeightsLastMonth,
    } = getTotalResidueKgsReported(
      lastMonthReports
        .filter((item) => item.materials)
        .map((item) => item.materials as Material), // Assert that item.materials is of type Material
    );

    // Function to calculate the percentage change between current and previous values
    const calculateMonthlyChange = (current: number, previous: number) => {
      if (previous === 0) {
        return {
          percentage: current === 0 ? 0 : 100,
          changeType: current === 0 ? 'noChange' : 'increase',
        };
      }

      if (current === previous) {
        return {
          percentage: 0,
          changeType: 'noChange',
        };
      }

      const percentage = ((current - previous) / previous) * 100;
      let changeType: 'increase' | 'decrease' | 'noChange' = 'noChange';
      if (percentage > 0) changeType = 'increase';
      if (percentage < 0) changeType = 'decrease';

      return { percentage, changeType };
    };

    // Calculate percentage change for residues and reports
    const {
      percentage: percentageChangeResidueKgsMonthly,
      changeType: changeTypeResidueKgsMonthly,
    } = calculateMonthlyChange(totalKgCurrentMonth, totalKgLastMonth);

    const {
      percentage: percentageChangeReportsMonthly,
      changeType: changeTypeReportsMonthly,
    } = calculateMonthlyChange(
      currentMonthReports.length,
      lastMonthReports.length,
    );

    // Fetch the previous stats before update
    const previousStatsBeforeUpdate = await this.prisma.userHistory.findFirst({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });

    // If no previous history exists, create a new entry; otherwise, update the existing one
    if (!previousStatsBeforeUpdate) {
      await this.prisma.userHistory.create({
        data: {
          userId,
          totalResidueKgs: totalResidueKgAllReports,
          totalReports: totalReports,
          percentageChangeResidueKgs: percentageChangeResidueKgsMonthly,
          percentageChangeReports: percentageChangeReportsMonthly,
        },
      });
    } else {
      await this.prisma.userHistory.update({
        where: { id: previousStatsBeforeUpdate.id },
        data: {
          totalResidueKgs: totalResidueKgAllReports,
          totalReports: totalReports,
          percentageChangeResidueKgs: percentageChangeResidueKgsMonthly,
          percentageChangeReports: percentageChangeReportsMonthly,
        },
      });
    }

    const validMaterials = allReports
      .map((item) => item.materials)
      .filter(
        (material) => material && typeof material === 'object',
      ) as Materials;

    // Return the statistics for the user
    return {
      totalReports: totalReports,
      lastsReports: allReports.slice(0, 5),
      totalResidueKg: totalResidueKgAllReports,
      materials: calculateTotalMaterials(validMaterials),
      monthlyChanges: {
        residueKgs: {
          percentageChange: percentageChangeResidueKgsMonthly,
          changeType: changeTypeResidueKgsMonthly,
        },
        reports: {
          percentageChange: percentageChangeReportsMonthly,
          changeType: changeTypeReportsMonthly,
        },
      },
    };
  }
}
