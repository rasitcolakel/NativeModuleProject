import {NativeEventEmitter, NativeModules} from 'react-native';

const {NativeView} = NativeModules;

/**
 * Interface representing native view functionality.
 */
interface NativeViewInterface {
  /**
   * Opens a native view.
   */
  open: () => void;
}

const eventEmitter = new NativeEventEmitter(NativeView);

export type LoginEvent = {
  username: string;
  password: string;
};

export function addListenerToEvent(
  event: string,
  listener: (data: LoginEvent) => void,
) {
  eventEmitter.addListener(event, listener);
}

export function removeListenerFromEvent(event: string) {
  eventEmitter.removeAllListeners(event);
}

export default NativeView as NativeViewInterface;
