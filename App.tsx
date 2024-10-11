import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
  NativeModules,
  Text,
  Button,
  StyleSheet,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const {MemoryInfo} = NativeModules;

const App = () => {
  const [memoryInfo, setMemoryInfo] = React.useState(null);
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

  useEffect(() => {
    getMemoryInfo();
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
