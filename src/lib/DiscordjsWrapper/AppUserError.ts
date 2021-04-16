export default class AppUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppUserError';
  }
}
