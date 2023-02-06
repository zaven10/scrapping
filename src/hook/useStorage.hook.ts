import { IAgent, IStorageState, IUseStorage } from '../interfaces';

export function useStorage(): IUseStorage {
  const state: IStorageState = {
    agents: new Map(),
  };

  const add = (agent: IAgent): Map<number, IAgent> =>
    state.agents.set(agent.id, agent);

  const has = (id: number): boolean => state.agents.has(id);

  return {
    get agents(): Map<number, IAgent> {
      return state.agents;
    },
    get length(): number {
      return state.agents.size;
    },
    add,
    has,
  };
}
