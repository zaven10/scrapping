import { IAgent } from './IAgent.interface';

export interface IUseStorage {
  agents: Map<number, IAgent>;
  length: number;
  add(agent: IAgent): Map<number, IAgent>;
  has(id: number): boolean;
}
