export default class ConversationTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConversationTimeoutError';
  }
}
