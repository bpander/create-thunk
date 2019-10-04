import { Message } from '../types';

export const mockMessages: Message[] = [
    {
        id: '1',
        text: 'hi',
        sent: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        sender: 'them',
        recipientId: 'lkj',
    },
    {
        id: '2',
        text: 'hey',
        sent: new Date(Date.now() - 1000 * 60 * 2.5).toISOString(),
        sender: 'you',
        recipientId: 'lkj',
    },
    {
        id: '3',
        text: 'sup',
        sent: new Date(Date.now() - 1000 * 60 * 2.25).toISOString(),
        sender: 'them',
        recipientId: 'lkj',
    },
];
