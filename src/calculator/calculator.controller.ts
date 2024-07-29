import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Mail } from '@/mail/interfaces/mail.interface';
import { MailService } from '@/mail/mail.service';

import { CalculatorService } from './calculator.service';
import { ResultDto, SupportDto } from './dtos';

@ApiTags('calculator')
@Controller({ path: 'calculator', version: '1' })
export class CalculatorController {
  constructor(
    private readonly calculatorService: CalculatorService,
    private readonly mailService: MailService,
  ) {}

  @Post('contact')
  @ApiOperation({
    summary: 'Request support',
    description: 'Returns contact information',
  })
  @ApiBody({ type: SupportDto })
  @ApiOkResponse({
    description: 'Returns created email response',
  })
  async contact(@Body() supportDto: SupportDto) {
    await this.calculatorService.saveContactInfo(supportDto);

    const mail: Mail = {
      to: supportDto.email,
      from: 'no-reply@recy.life',
      subject: 'Contact Information',
      // Todo: Add a template for the email
      html: `Thank you for contacting us. Here is your information: 
      Company Type: ${supportDto.company_type}, 
      Employees Quantity: ${supportDto.employees_quantity}, 
      Waste Footprint: ${supportDto.waste_foot_print}`,
    };

    try {
      const { data, error } = await this.mailService.sendEmail(mail);

      if (error) {
        return { message: 'Failed to send email', error };
      }

      return { message: 'Email sent successfully', data };
    } catch (error) {
      return { message: 'Failed to send email', error };
    }
  }

  @Post('result')
  @ApiOperation({
    summary: 'Save result',
    description: 'Save result of the calculator',
  })
  @ApiBody({ type: ResultDto })
  async result(@Body() resultDto: ResultDto) {
    await this.calculatorService.saveResultInfo(resultDto);

    return { message: 'Result saved successfully' };
  }
}
