import { Field, Float, ObjectType } from '@nestjs/graphql';

import { ResidueType } from '../entities/document.entity';

@ObjectType()
class AggregateFormData {
  @Field(() => Float)
  amount: number;

  @Field(() => ResidueType)
  residueType: ResidueType;
}

@ObjectType()
export class AggregateFormByUserProfileResponse {
  @Field()
  id: string;

  @Field(() => [AggregateFormData])
  data: AggregateFormData[];
}
