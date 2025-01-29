import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Alert, 
  TouchableOpacity 
} from 'react-native';
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const Contactos = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);

  const loadContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });
        setContacts(data);
      } else {
        Alert.alert('🚫 Permiso denegado', 'Se necesitan permisos para acceder a tus contactos.');
      }
    } catch (error) {
      console.error('Error al cargar los contactos:', error);
      Alert.alert('⚠️ Error', 'Hubo un problema al acceder a los contactos.');
    }
  };

  const loadSelectedContacts = async () => {
    try {
      const savedContacts = await AsyncStorage.getItem('selectedContacts');
      setSelectedContacts(savedContacts ? JSON.parse(savedContacts) : []);
    } catch (error) {
      console.error('Error al cargar contactos seleccionados:', error);
      Alert.alert('⚠️ Error', 'Hubo un problema al cargar los contactos seleccionados.');
    }
  };

  const saveSelectedContacts = async () => {
    try {
      await AsyncStorage.removeItem('selectedContacts');
      await AsyncStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
      Alert.alert('✅ Guardado', 'Tus contactos han sido guardados exitosamente.');
      router.replace("/");
    } catch (error) {
      console.error('Error al guardar contactos:', error);
      Alert.alert('⚠️ Error', 'Hubo un problema al guardar los contactos seleccionados.');
    }
  };

  const toggleSelection = (contact: any) => {
    setSelectedContacts((prev) => {
      if (prev.find((item) => item.id === contact.id)) {
        return prev.filter((item) => item.id !== contact.id);
      } else {
        return prev.length < 3 ? [...prev, contact] : prev;
      }
    });

    if (selectedContacts.length >= 3 && !selectedContacts.find((item) => item.id === contact.id)) {
      Alert.alert('⚠️ Límite alcanzado', 'Solo puedes seleccionar hasta 3 contactos.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadContacts();
      loadSelectedContacts();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Selecciona hasta 3 Contactos</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.contactContainer,
              selectedContacts.find((contact) => contact.id === item.id) && styles.selected,
            ]}
            onPress={() => toggleSelection(item)}
          >
            <Text style={styles.contactName}>👤 {item.name || 'Nombre no disponible'}</Text>
            <Text style={styles.contactPhone}>📞 {item.phoneNumbers?.[0]?.number || 'Número no disponible'}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={saveSelectedContacts}>
        <Text style={styles.saveButtonText}>💾 Guardar Contactos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  listContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  contactContainer: {
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selected: {
    backgroundColor: '#D1E7FF',
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contactPhone: {
    fontSize: 16,
    color: '#555',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Contactos;
