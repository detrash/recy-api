import { Timestamp } from '@/dto/timestamp.dto';

export enum ResidueType {
  GLASS = 'GLASS',
  METAL = 'METAL',
  ORGANIC = 'ORGANIC',
  PAPER = 'PAPER',
  PLASTIC = 'PLASTIC',
  TEXTILE = 'TEXTILE',
  LANDFILL_WASTE = 'LANDFILL_WASTE',
}

export class Document extends Timestamp {
  id: string;

  residueType: ResidueType;

  amount: number;

  videoFileName: string;

  invoicesFileName: string[];

  formId: string;
}
