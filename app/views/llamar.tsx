import React, { useState } from 'react';
import { router } from 'expo-router';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  Linking, 
  TouchableOpacity 
} from 'react-native';
import { Link } from 'expo-router';

const Llamar = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const makeCall = async () => {
    if (!phoneNumber) {
      Alert.alert('⚠️ Error', 'Por favor, ingresa un número de teléfono.');
      return;
    }
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📞 Llamar a un número</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingresa el número de teléfono"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.callButton} activeOpacity={0.7} onPress={makeCall}>
        <Text style={styles.callButtonText}>📲 Llamar</Text>
      </TouchableOpacity>

      
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7}
          onPress={async () => { router.replace("/");}}
        >
          <Text style={styles.backButtonText}>⬅️ Volver</Text>
        </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '90%',
    height: 55,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 18,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Para Android
  },
  callButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#555',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    elevation: 3,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Llamar;
