import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Rutina} from "../interfaces/rutina_interface";

const RutinasLista = () => {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);

  // Cargar las rutinas guardadas al iniciar
  useEffect(() => {
    const cargarRutinas = async () => {
      try {
        const rutinasGuardadas = await AsyncStorage.getItem('rutinas');
        if (rutinasGuardadas) {
          setRutinas(JSON.parse(rutinasGuardadas));
        }
      } catch (error) {
        console.error('Error al cargar las rutinas:', error);
      }
    };

    cargarRutinas();
  }, []);

  // Función para eliminar una rutina
  const eliminarRutina = (id: string) => {
    Alert.alert(
      'Eliminar Rutina',
      '¿Estás seguro de que quieres eliminar esta rutina?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const nuevasRutinas = rutinas.filter((rutina) => rutina.id !== id);
              await AsyncStorage.setItem('rutinas', JSON.stringify(nuevasRutinas));
              setRutinas(nuevasRutinas);
            } catch (error) {
              console.error('Error al eliminar la rutina:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {rutinas.length > 0 ? (
        <FlatList
          data={rutinas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.rutinaItem}>
              <View style={styles.rutinaInfo}>
                <Text style={styles.nombre}>Nombre: {item.nombre}</Text>
                <Text style={styles.datos}>Hora: {item.hora}</Text>
                <Text style={styles.datos}>Días: {item.dias.join(', ')}</Text>
              </View>
              <TouchableOpacity
                style={styles.eliminarButton}
                onPress={() => eliminarRutina(item.id)}
              >
                <Text style={styles.eliminarButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={styles.noRutinasContainer}>
          <Text style={styles.noRutinas}>No hay rutinas programadas.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  rutinaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  rutinaInfo: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  datos: {
    fontSize: 14,
    color: '#555',
  },
  noRutinasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRutinas: {
    fontSize: 24, // Aumentar el tamaño de la fuente
    color: '#888',
    textAlign: 'center',
  },
  eliminarButton: {
    padding: 10,
    backgroundColor: '#ff4444',
    borderRadius: 5,
  },
  eliminarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RutinasLista;