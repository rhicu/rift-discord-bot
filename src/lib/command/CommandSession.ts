import { AppMessage } from '@lib/DiscordjsWrapper';

export default class CommandSession {
  nextStep: (message: AppMessage, session: CommandSession) => void;

  constructor(nextStep: (message: AppMessage, session: CommandSession) => void) {
    this.nextStep = nextStep;
  }
}
