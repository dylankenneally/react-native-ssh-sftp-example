import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import SSHClient from '@dylankenneally/react-native-ssh-sftp';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text style={[ styles.sectionTitle, { color: isDarkMode ? Colors.white : Colors.black } ]}>
        {title}
      </Text>
      <Text style={[ styles.sectionDescription, { color: isDarkMode ? Colors.light : Colors.dark } ]}>
        {children}
      </Text>
    </View>
  );
}

async function sshTest() {
  let host = 'your host here'; // example: '123.321.123.321';
  let user = 'your user name here'; // example: 'root';
  let password = 'your password here'; // example: 'password123!';

  let _log = 'about to connect to ' + host + ' as ' + user;
  let log = (s: any) => { console.log(s); _log += '\n' + s; };

  try {
    // @ts-ignore - the last parameter is optional
    let client = await SSHClient.connectWithPassword(host, 22, user, password);
    log('connected');
    log(JSON.stringify(client, null, 2));

    let command = 'uptime';
    log(`about to execute '${command}'`);

    let output = await client.execute(command);
    log('done, result is:');
    log(output);

    log('about to disconnect');
    client.disconnect();
    log('disconnected');
  } catch (err) {
    log('error');
    log(err);
  } finally {
    return _log;
  }
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [log, setLog] = React.useState<string>('');

  React.useEffect(() => {
    sshTest()
      .then(setLog)
      .catch(console.error);
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

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
          style={{ backgroundColor: isDarkMode ? Colors.black : Colors.white }}>
          <Section title="SSH">
            <Text style={styles.output}>{log}</Text>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  output: {
    fontSize: 24,
  },
});

export default App;
