import { Message } from '../types';

export const mockMessages: Message[] = [
    {
        id: '1',
        text: 'hi',
        sent: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        sender: 'them',
        recipientId: '',
    },
    {
        id: '2',
        text: 'hey',
        sent: new Date(Date.now() - 1000 * 60 * 2.5).toISOString(),
        sender: 'you',
        recipientId: '',
    },
    {
        id: '3',
        text: 'sup',
        sent: new Date(Date.now() - 1000 * 60 * 2.25).toISOString(),
        sender: 'them',
        recipientId: '',
    },
];

const shuffle = <T>(arr: T[]): T[] => {
    return [ ...arr ].sort(() => Math.random() - 0.5);
};

export const getRandomMessages = (recipientId: string) => {
    const texts = [ 'hey', 'hi', 'sup', 'yo', 'you up?' ];
    const randomTexts = shuffle(texts).slice(0, Math.ceil(Math.random() * texts.length));

    return randomTexts.map((text, i) => ({
        id: String(i),
        text,
        sent: new Date(Date.now() - 1000 * i).toISOString(),
        sender: 'you',
        recipientId,
    }));
};
