import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


// Definimos el tipo de los elementos del historial
interface Rutina {
  id: string;
  mensaje: string;
  hora: string;
  dia: string;
}

const RutinasHistorial = () => {
  // Especificamos el tipo del estado como un arreglo de Rutinas
  const [historial, setHistorial] = useState<Rutina[]>([]);

  useEffect(() => {
    const loadHistorial = () => {
      const data: Rutina[] = [
        { id: '1', mensaje: 'Paracetamol', hora: '08:00 AM', dia: 'Lunes' },
        { id: '2', mensaje: 'Amoxicilina', hora: '09:00 AM', dia: 'Martes' },
        { id: '3', mensaje: 'Ejercicio', hora: '10:00 AM', dia: 'Miércoles' },
      ];
      setHistorial(data);
      console.log(data); // Verifica si los datos se están cargando
    };

    loadHistorial();
  }, []);

  const renderItem = ({ item }: { item: Rutina }) => (
    <View style={styles.historialItem}>
      <Text style={styles.itemText}>Mensaje: {item.mensaje}</Text>
      <Text style={styles.itemText}>Hora: {item.hora}</Text>
      <Text style={styles.itemText}>Día: {item.dia}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Rutinas</Text>
      <FlatList
        data={historial}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  historialItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default RutinasHistorial;


