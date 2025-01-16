import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';

import { ZodValidationPipe } from '@/shared/utils/zod-validation.pipe';

import { AuthorizationGuard } from '../auth0/authorization.guard';
import { MintNftDto, MintNftSchema } from './dtos/polygon/mint-nft';
import { Web3Service } from './web3.service';

@Controller({ path: 'web3', version: '1' })
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}

  @UseGuards(AuthorizationGuard)
  @Post('recy-certificate')
  @UsePipes(new ZodValidationPipe(MintNftSchema))
  async mintRecyCertificate(@Body() mintNftDto: MintNftDto) {
    try {
      return this.web3Service.mintRecyCertificate(mintNftDto);
    } catch (error) {
      throw new Error('Error on recy certificate');
    }
  }
}
