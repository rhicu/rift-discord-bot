import CommandSession from '@lib/command/CommandSession';

export default class CreateCharacterSession extends CommandSession {
  name: string|undefined;

  className: string|undefined;
}
