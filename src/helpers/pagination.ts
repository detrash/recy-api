import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { Type as DataType } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

class Pagination {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  constructor(page: number, limit: number, totalPages: number) {
    this.page = page;
    this.limit = limit;
    this.totalPages = totalPages;
  }
}

export class PaginatedDto<T> {
  @ApiProperty({ type: {} })
  data: T[];

  @ApiProperty()
  pagination: Pagination;

  constructor(data: T[], meta: Pagination) {
    this.data = data;
    this.pagination = meta;
  }
}

type Constructor<T> = new () => T;

export function PaginationQuery<T>(superClass: Constructor<T>) {
  class Class extends (superClass as Constructor<{}>) {
    @IsNumber()
    @IsOptional()
    @DataType(() => Number)
    @ApiPropertyOptional({ default: 1, description: 'Page number' })
    @Min(1)
    readonly page?: number = 1;

    @IsNumber()
    @IsOptional()
    @DataType(() => Number)
    @ApiPropertyOptional({
      default: 20,
      description: 'Number of items per page',
    })
    @Min(5)
    @Max(100)
    readonly limit?: number = 20;

    @IsOptional()
    @ApiPropertyOptional({
      enum: Object.getOwnPropertyNames(
        superClass['_OPENAPI_METADATA_FACTORY'](),
      ),
      default: 'createdAt',
      description: 'Sort by field',
    })
    readonly sortBy?: string = 'createdAt';

    @IsOptional()
    @ApiPropertyOptional({
      enum: ['asc', 'desc'],
      default: 'asc',
      description: 'Sort order',
    })
    readonly orderBy?: string = 'asc';
  }

  return Class as Constructor<T & Class>;
}

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  options?: Omit<ApiResponseOptions, 'schema'>,
) =>
  applyDecorators(
    ApiExtraModels(PaginatedDto, dataDto),
    ApiOkResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );