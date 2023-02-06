import got from 'got';

import { writeFileSync, existsSync, mkdirSync } from 'fs';

import { resolve, dirname } from 'path';

import { fileURLToPath } from 'url';

import { URLS } from '../enums';

import { IUseStorage, IAgent } from '../interfaces';

import { Logger, RegExpAgent } from '../utils';

export class Scrapper {
  private _previousItems: string;

  constructor(private storage: IUseStorage) {
    this._filter = this._filter.bind(this);
    this._paginate = this._paginate.bind(this);
    this._transform = this._transform.bind(this);
    this._getAgent = this._getAgent.bind(this);
    this._saveAsJson = this._saveAsJson.bind(this);
  }

  private _paginate({ response, currentItems }) {
    if (this._previousItems === currentItems?.join('')) {
      return false;
    }

    const { searchParams }: any = response.request.options;

    const previousPage = Number(searchParams?.get('page') ?? 1);

    this._previousItems = currentItems?.join('') ?? '';

    return {
      searchParams: {
        page: previousPage + 1,
      },
    };
  }

  private _transform(response: any) {
    return response.body
      .match(RegExpAgent.LIST_OF_AGENTS)
      .map((item) => item.replace(/[\n\t]+/gi, '').replace(/\s\s+/gi, ''));
  }

  private _filter({ item }: any) {
    return !RegExpAgent.LOCATION('NA').test(item as string);
  }

  private _getAgent(raw: string): IAgent {
    const [id] = raw?.match(RegExpAgent.ID) ?? [];
    const [firstName, lastName] =
      raw?.match(RegExpAgent.AGENT_NAME)?.[0]?.split(' ') ?? [];
    const [location] = raw?.match(RegExpAgent.LOCATION()) ?? [];
    const [rsac] = raw?.match(RegExpAgent.RSAC) ?? [];
    const [email] = raw?.match(RegExpAgent.EMAIL) ?? [];
    const [phone] = raw?.match(RegExpAgent.PHONE_NUMBER) ?? [];
    const [website] = raw?.match(RegExpAgent.WEBSITE) ?? [];

    return {
      id: +id,
      rsac: +rsac,
      firstName,
      lastName,
      location,
      phone,
      email,
      website: website ?? '',
    };
  }

  private _saveAsJson() {
    try {
      const PATH = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'db');

      const FILE_NAME = resolve(PATH, `agents__${Date.now()}.json`);

      if (!existsSync(PATH)) {
        mkdirSync(PATH);
      }

      const content = JSON.stringify(
        {
          agents: [...this.storage.agents.values()],
          numberOfAgents: this.storage.length,
        },
        null,
        2,
      );

      writeFileSync(FILE_NAME, content);

      Logger.log(`🤖🎉 Completed, please check the ${FILE_NAME} file 🎉🤖`);
    } catch (e) {
      console.error(e);
    }
  }

  public async run() {
    const pagination = got.paginate(URLS.ROOT, {
      pagination: {
        paginate: this._paginate,
        transform: this._transform,
        filter: this._filter,
        stackAllItems: false,
        countLimit: 2,
      },
    });

    let sequence = await pagination.next();

    while (!sequence.done) {
      const agent: IAgent = this._getAgent(sequence.value);

      this.storage.add(agent);

      Logger.log(`Number of agents: ${this.storage.length}`);

      sequence = await pagination.next();
    }

    this._saveAsJson();
  }
}
