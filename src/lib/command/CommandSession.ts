import { AppMessage } from '@lib/DiscordjsWrapper';

export default abstract class CommandSession {
  nextStep: (message: AppMessage, session: CommandSession) => void;

  constructor(nextStep: (message: AppMessage, session: any) => void) {
    this.nextStep = nextStep;
  }
}
