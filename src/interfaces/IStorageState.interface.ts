import { IAgent } from './IAgent.interface';

export interface IStorageState {
  agents: Map<number, IAgent>;
}
