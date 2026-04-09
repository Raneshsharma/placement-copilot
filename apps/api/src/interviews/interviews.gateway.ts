import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class InterviewsGateway {
  @WebSocketServer() server: Server;
  @SubscribeMessage('join') handleJoin(@MessageBody() sessionId: string) { return { event: 'joined', data: { sessionId } }; }
  @SubscribeMessage('answer') handleAnswer(@MessageBody() data: any) { this.server.to(data.sessionId).emit('question', { text: 'Processing...' }); return { event: 'processed', data: {} }; }
}
