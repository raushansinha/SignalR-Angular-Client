export interface IMessage {
    type: Messageseverity,
    payload: string;
}

export enum Messageseverity{
    success,
    info,
    warn,
    error
}