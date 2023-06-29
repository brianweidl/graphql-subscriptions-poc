import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Viewer {
  @Field(() => Int)
  id: number;
  @Field()
  name: string;
}
@ObjectType()
export class Conversation {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field({ nullable: true })
  name: string;

  @Field(() => [Viewer], { nullable: true })
  viewers: Viewer[];
}
