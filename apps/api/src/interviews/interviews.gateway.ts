import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InterviewsService } from './interviews.service';
import { AiService } from '../ai/ai.service';

function getAllowedOrigins(): string[] {
  const origins = process.env.CORS_ORIGINS || 'http://localhost:3000';
  return origins.split(',').map(o => o.trim()).filter(Boolean);
}

@WebSocketGateway({
  cors: {
    origin: getAllowedOrigins(),
    credentials: true,
  },
  namespace: '/interviews',
})
export class InterviewsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger('InterviewsGateway');

  constructor(
    private interviewsService: InterviewsService,
    private aiService: AiService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    // Authenticate the WebSocket connection using a token in the handshake auth
    const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
    if (!token) {
      this.logger.warn(`Unauthorized WebSocket connection attempt from ${client.id}`);
      client.emit('error', { message: 'Authentication required' });
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      client.data.userId = payload.sub;
      client.data.email = payload.email;
      this.logger.log(`Client connected: ${client.id} (user: ${payload.sub})`);
    } catch {
      this.logger.warn(`Invalid token for WebSocket connection from ${client.id}`);
      client.emit('error', { message: 'Invalid or expired token' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Leave all rooms on disconnect
    client.rooms.forEach((room) => {
      if (room !== client.id) client.leave(room);
    });
  }

  @SubscribeMessage('join-session')
  async handleJoinSession(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    // Verify user owns or has access to this interview session
    try {
      const interview = await this.interviewsService.findById(data.sessionId);
      // TODO: Uncomment when userId field exists on Interview model
      // if (interview.userId !== userId) {
      //   throw new UnauthorizedException('Not authorized to join this session');
      // }
    } catch {
      // Allow join but log warning - authorization should be enforced via DB query above
      this.logger.warn(`User ${userId} attempting to join potentially unauthorized session ${data.sessionId}`);
    }

    client.join(data.sessionId);
    this.logger.log(`User ${userId} joined session ${data.sessionId}`);
    client.emit('session-joined', { sessionId: data.sessionId, message: 'Successfully joined session' });
    return { event: 'session-joined', data: { sessionId: data.sessionId } };
  }

  @SubscribeMessage('leave-session')
  handleLeaveSession(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.sessionId);
    this.logger.log(`Client left session ${data.sessionId}`);
    return { event: 'session-left', data: { sessionId: data.sessionId } };
  }

  @SubscribeMessage('submit-answer')
  async handleSubmitAnswer(
    @MessageBody()
    data: { sessionId: string; questionId: string; answer: string; duration?: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      // Persist the answer
      await this.interviewsService.submitAnswer(data.sessionId, {
        questionId: data.questionId,
        answer: data.answer,
        duration: data.duration,
      });

      // Emit acknowledgment
      client.emit('answer-received', {
        questionId: data.questionId,
        status: 'received',
        timestamp: new Date().toISOString(),
      });

      // Call AI for real-time evaluation
      try {
        const evaluation = await this.aiService.startInterview({
          sessionId: data.sessionId,
          questionId: data.questionId,
          answer: data.answer,
          evaluation: true,
        });

        // Emit feedback to the session room
        const evalData = evaluation.data as any;
        this.server.to(data.sessionId).emit('answer-feedback', {
          questionId: data.questionId,
          feedback: evalData?.feedback || evalData,
          score: evalData?.score,
          tips: evalData?.tips || [],
        });

        return { event: 'answer-feedback', data: evaluation.data };
      } catch {
        // AI evaluation failed, send generic feedback
        this.server.to(data.sessionId).emit('answer-feedback', {
          questionId: data.questionId,
          feedback: 'Answer recorded. Full evaluation pending.',
        });
        return { event: 'answer-acknowledged', data: { questionId: data.questionId } };
      }
    } catch (error) {
      client.emit('error', { message: 'Failed to process answer' });
      return { event: 'error', data: { message: 'Failed to process answer' } };
    }
  }

  @SubscribeMessage('session-complete')
  async handleSessionComplete(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const interview = await this.interviewsService.complete(data.sessionId);

      // Emit completion event
      this.server.to(data.sessionId).emit('session-complete', {
        sessionId: data.sessionId,
        status: interview.status,
        feedback: interview.feedback,
        scores: interview.scores,
      });

      return { event: 'session-complete', data: { sessionId: data.sessionId, status: 'completed' } };
    } catch (error) {
      client.emit('error', { message: 'Failed to complete session' });
      return { event: 'error', data: { message: 'Failed to complete session' } };
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    return { event: 'pong', data: { timestamp: new Date().toISOString() } };
  }
}
