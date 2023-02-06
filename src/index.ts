import { useStorage } from './hook';

import { Scrapper } from './utils';

const storage = useStorage();

new Scrapper(storage).run();
