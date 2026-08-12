import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>আমার প্রথম Expo Router App 🎉</Text>

      <TextInput
        style={styles.input}
        placeholder="তোমার নাম লেখো"
        value={name}
        onChangeText={setName}
      />

      {name.length > 0 && (
        <Text style={styles.greeting}>হ্যালো, {name}!</Text>
      )}

      <Text style={styles.counter}>Count: {count}</Text>
      <Button title="Increase Count" onPress={() => setCount(count + 1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '80%',
    marginBottom: 15,
  },
  greeting: {
    fontSize: 18,
    color: 'green',
    marginBottom: 15,
  },
  counter: {
    fontSize: 16,
    marginBottom: 10,
  },
});