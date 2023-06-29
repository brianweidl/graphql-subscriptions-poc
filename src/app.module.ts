import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { Context } from 'graphql-ws';
import { conversations } from './util';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      subscriptions: {
        'graphql-ws': {
          onConnect: (context: Context<any>) => {
            const { connectionParams } = context;
            console.log(`${connectionParams.name} has connected in graphql-ws`);
            console.log(connectionParams);
          },
          onDisconnect: (context: Context<any>) => {
            const { connectionParams, extra } = context;

            console.log(`${connectionParams.name} has disconnected`);

            const conversation = conversations.find(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              (conv) => conv.id === parseInt(extra.conversationSid),
            );

            conversation.viewers = conversation.viewers.filter(
              (viewer) => viewer.id !== connectionParams.id,
            );
          },
          onClose: (context: Context<any>) => {
            console.log('Connection closed');
          },
        },
        'subscriptions-transport-ws': {
          onConnect: (connectionParams) => {
            console.log('Connected in subscriptions-transport-ws');
          },
        },
      },
    }),
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
