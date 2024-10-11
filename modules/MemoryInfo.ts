import {NativeModules} from 'react-native';

const {MemoryInfo} = NativeModules;

export type MemoryInfoResponse = {
  availableMemory: number;
  totalMemory: number;
  usedMemory: number;
};

/**
 * Interface representing memory information retrieval functionality.
 */
interface MemoryInfoInterFace {
  /**
   * Retrieves memory information.
   *
   * @returns A promise that resolves to an object containing:
   * - `availableMemory`: The amount of available memory in bytes.
   * - `totalMemory`: The total amount of memory in bytes.
   * - `usedMemory`: The amount of used memory in bytes.
   */
  getMemoryInfo: () => Promise<MemoryInfoResponse>;
}

export default MemoryInfo as MemoryInfoInterFace;
