import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface Rutina {
  id: string;
  nombre: string;
  hora: string;
  dias: string;
}

interface RutinasListaProps {
  rutinas: Rutina[]; // Recibimos las rutinas como propiedad
}

const RutinasLista: React.FC<RutinasListaProps> = ({ rutinas = [] }) => { // Aseguramos que 'rutinas' tenga un valor predeterminado de arreglo vacío
  return (
    <View style={styles.container}>
      {rutinas.length > 0 ? (
        <FlatList
          data={rutinas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.rutinaItem}>
              <Text style={styles.nombre}>Nombre: {item.nombre}</Text>
              <Text style={styles.datos}>Hora: {item.hora}</Text>
              <Text style={styles.datos}>Días: {item.dias}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noRutinas}>No hay rutinas programadas.</Text>
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
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  datos: {
    fontSize: 14,
    color: '#555',
  },
  noRutinas: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default RutinasLista;
