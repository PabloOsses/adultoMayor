import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Cambié router.push por useRouter()

const Index = () => {
  const router = useRouter(); // Usamos el hook useRouter para navegación

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Botón de Llamadas */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF6347' }]}
          onPress={() => router.push('/views/contacto_llamar')}
        >
          <Text style={styles.buttonText}>📞 Llamar Contacto</Text>
        </TouchableOpacity>

        {/* Botón de Llamadas Genéricas */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#1E90FF' }]}
          onPress={() => router.push('/views/llamar')} // Modificado para usar router.push
        >
          <Text style={styles.buttonText}>📲 Llamar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        {/* Botón de Crear Aviso */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#32CD32' }]}
          onPress={() => router.push('/views/rutinas_crear')}
        >
          <Text style={styles.buttonText}>🔔 Crear Aviso</Text>
        </TouchableOpacity>

        {/* Botón de Lista de Avisos */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FFD700' }]}
          onPress={() => router.push('/views/rutinas_lista')}
        >
          <Text style={styles.buttonText}>💬 Lista de Avisos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        {/* Botón de Historial */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#8A2BE2' }]}
          onPress={() => router.push('/views/rutinas_historial')} // Cambié a router.push
        >
          <Text style={styles.buttonText}>🗓️ Historial</Text>
        </TouchableOpacity>

        {/* Botón de Ajustes */}
        <TouchableOpacity style={[styles.button, { backgroundColor: '#DC143C' }]}>
          <Text style={styles.buttonText}>⚙️ POR HACER</Text>
        </TouchableOpacity>
      </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    elevation: 5, // Efecto de sombra en Android
    shadowColor: '#000', // Efecto de sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Index;
//PERAS implementa lo que te falta en el index