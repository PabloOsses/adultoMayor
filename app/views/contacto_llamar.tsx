import React, { useState, useCallback } from 'react';
import {View,Text,FlatList,StyleSheet,Alert,TouchableOpacity,Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Link } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const LlamarContacto = () => {
  const [savedContacts, setSavedContacts] = useState<any[]>([]);

  // Cargar los contactos guardados desde AsyncStorage
  const loadSavedContacts = async () => {
    try {
      const savedContacts = await AsyncStorage.getItem('selectedContacts');
      //console.log('Contactos cargados:', savedContacts);
      if (savedContacts) {
        setSavedContacts(JSON.parse(savedContacts));
      } else {
        Alert.alert('📵 Sin contactos', 'No tienes contactos guardados.');
      }
    } catch (error) {
      console.error('Error al cargar los contactos guardados:', error);
      Alert.alert('⚠️ Error', 'Hubo un problema al cargar los contactos.');
    }
  };

  // Función para realizar una llamada
  const makeCall = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url);
  };

  // Ejecutar cada vez que la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      loadSavedContacts();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📞 Contactos Directos</Text>
      {savedContacts.length === 0 ? (
        <Text style={styles.noContactsText}>No hay contactos guardados.</Text>
      ) : (
        <FlatList
          data={savedContacts}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.contactContainer}
              activeOpacity={0.7}
              onPress={() => {
                const phoneNumber = item.phoneNumbers && item.phoneNumbers[0]?.number;
                if (phoneNumber) {
                  makeCall(phoneNumber);
                } else {
                  Alert.alert('📵 Sin número', 'Este contacto no tiene un número válido.');
                }
              }}
            >
              <Text style={styles.contactName}>👤 {item.name}</Text>
              <Text style={styles.contactPhone}>📲 {item.phoneNumbers?.[0]?.number || 'Número no disponible'}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      
      {/* Botón para editar lista de contactos */}
      <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
        <Link href="/views/contacto_lista" asChild>
          <Text style={styles.editButtonText}>✏️ Editar lista</Text>
        </Link>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  noContactsText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  listContainer: {
    width: '100%',
    paddingBottom: 20, // Mayor espacio inferior
  },
  contactContainer: {
    marginBottom: 20, // Más espacio entre contactos
    paddingVertical: 18, // Mayor padding
    paddingHorizontal: 24,
    backgroundColor: '#FFF',
    borderRadius: 12,
    width: '100%', // Más ancho
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Sombra en Android
  },
  contactName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  contactPhone: {
    fontSize: 18,
    color: '#555',
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 4, // Sombra en Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LlamarContacto;
