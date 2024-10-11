import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
  Text,
  Button,
  StyleSheet,
  NativeModules,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import MemoryInfo, {MemoryInfoResponse} from './modules/MemoryInfo';
import {
  addListenerToEvent,
  LoginEvent,
  removeListenerFromEvent,
} from './modules/NativeView';

const App = () => {
  const [memoryInfo, setMemoryInfo] = React.useState<MemoryInfoResponse | null>(
    null,
  );
  const [eventData, setEventData] = React.useState<LoginEvent | null>(null);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const getMemoryInfo = async () => {
    try {
      const resp = await MemoryInfo.getMemoryInfo();
      setMemoryInfo(resp);
    } catch (error) {
      console.log(error);
    }
  };

  const openNativeView = () => {
    NativeModules.NativeView.open();
  };

  useEffect(() => {
    getMemoryInfo();
  }, []);

  //
  useEffect(() => {
    addListenerToEvent('onLogin', data => {
      console.log('Event received:', data);
      setEventData(data);
    });

    return () => {
      removeListenerFromEvent('onLogin');
    };
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={[
            {
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            },
            styles.container,
          ]}>
          <Text style={styles.text}>
            {memoryInfo ? JSON.stringify(memoryInfo, null, 2) : '---'}
          </Text>
          <Button title="Get Memory Info" onPress={getMemoryInfo} />
          <Text style={styles.text}>
            {eventData ? JSON.stringify(eventData, null, 2) : '---'}
          </Text>
          <Button title="Open Native View" onPress={openNativeView} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // spacing between children
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
  },
});
