import { Injectable } from '@nestjs/common';
import { conversations } from './util';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class AppService {
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
