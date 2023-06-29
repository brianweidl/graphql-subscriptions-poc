import { Injectable } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { conversations } from './util';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class AppService {
  public conversations: Conversation[] = [
    {
      id: 1,
      name: 'Conversation 1',
      viewers: [],
    },
    {
      id: 2,
      name: 'Conversation 2',
      viewers: [],
    },
    {
      id: 3,
      name: 'Conversation 3',
      viewers: [],
    },
  ];

  pubSub = new PubSub();

  addViewer() {
    const conv = conversations.find((conv) => conv.id === 2);
    const newViewer = {
      id: 25,
      name: `Omar`,
    };
    conv.viewers.push(newViewer);
    this.pubSub.publish('conversationPresence', { conversationPresence: conv });
    return conv;
  }

  getConversations() {
    return conversations;
  }

  getConversation(conversationSid) {
    return conversations.find((conv) => conv.id === parseInt(conversationSid));
  }

  handleConnection(conversationSid, viewer) {
    const conversation = conversations.find(
      (conv) => conv.id === parseInt(conversationSid),
    );
    const { id, name } = viewer;
    conversation.viewers.push({
      id,
      name,
    });
    return this.pubSub.asyncIterator('conversationPresence');
  }
}
