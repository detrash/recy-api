import { Field, Float, InputType } from '@nestjs/graphql';

import { ResidueType } from '@/documents';

@InputType()
class ResidueInput {
  @Field(() => Float, { nullable: true })
  amount: number;

  @Field({ nullable: true })
  videoFileName?: string;

  @Field(() => [String])
  invoicesFileName: string[];
}

@InputType()
export class CreateFormInput {
  authUserId: string;

  @Field(() => ResidueInput, { nullable: true })
  [ResidueType.GLASS]?: ResidueInput;

  @Field(() => ResidueInput, { nullable: true })
  [ResidueType.METAL]?: ResidueInput;

  @Field(() => ResidueInput, { nullable: true })
  [ResidueType.ORGANIC]?: ResidueInput;

  @Field(() => ResidueInput, { nullable: true })
  [ResidueType.PAPER]?: ResidueInput;

  @Field(() => ResidueInput, { nullable: true })
  [ResidueType.PLASTIC]?: ResidueInput;

  @Field(() => ResidueInput, { nullable: true })
  [ResidueType.TEXTILE]?: ResidueInput;

  @Field(() => ResidueInput, { nullable: true })
  [ResidueType.LANDFILL_WASTE]?: ResidueInput;

  @Field({ nullable: true })
  walletAddress?: string;
}
