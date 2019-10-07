import { Chat } from './models/Chat';
import { mockChats } from './__mocks__/chat';

export class ChatService {

    static async loadAll(): Promise<Chat[]> {
        const { debug } = (window as any).store.getState();
        await new Promise(resolve => setTimeout(resolve, debug.latency));
        if (debug.shouldRequestsFail) {
            throw new Error('Simulated failure');
        }
        return mockChats;
    }
}
