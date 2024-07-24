import {
  Field,
  Float,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { Timestamp } from '@/dto/timestamp.dto';
import { Form } from '@/forms';

export enum ResidueType {
  GLASS = 'GLASS',
  METAL = 'METAL',
  ORGANIC = 'ORGANIC',
  PAPER = 'PAPER',
  PLASTIC = 'PLASTIC',
  TEXTILE = 'TEXTILE',
  LANDFILL_WASTE = 'LANDFILL_WASTE',
}

registerEnumType(ResidueType, {
  name: 'ResidueType',
  description: 'Represents the residue type',
});

@ObjectType()
export class Document extends Timestamp {
  @Field(() => ID)
  id: string;

  @Field(() => ResidueType)
  residueType: ResidueType;

  @Field(() => Float)
  amount: number;

  @Field({ nullable: true })
  videoFileName: string;

  @Field(() => [String])
  invoicesFileName: string[];

  @Field(() => Form)
  form: Form;
  formId: string;
}
