import { AppService } from './app.service';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Conversation } from './entities/conversation.entity';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => [Conversation])
  getConversations() {
    return this.appService.getConversations();
  }

  @Query(() => Conversation)
  getConversation(@Args('conversationSid') conversationSid: string) {
    return this.appService.getConversation(conversationSid);
  }

  @Mutation(() => Conversation)
  addViewer() {
    return this.appService.addViewer();
  }

  @Subscription(() => Conversation, { name: 'conversationPresence' })
  subscribeToConversationPresence(
    @Context() context,
    @Args('conversationSid') conversationSid: string,
  ) {
    context.req.extra.conversationSid = conversationSid;

    return this.appService.handleConnection(
      conversationSid,
      context.req.connectionParams,
    );
  }
}
