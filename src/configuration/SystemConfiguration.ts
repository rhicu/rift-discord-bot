import dotenv from 'dotenv';

class SystemConfiguration {
  public CHANNEL_ID: string;

  public SERVER_ID: string;

  public TOKEN: string | undefined;

  constructor() {
    dotenv.config();

    this.CHANNEL_ID = '831997082134511677';

    this.SERVER_ID = '831995258510114856';

    this.TOKEN = process.env.TOKEN;
  }
}

export default new SystemConfiguration();
