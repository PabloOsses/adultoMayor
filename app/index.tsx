import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const Index = () => {
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
          onPress={() => router.navigate("/views/llamar", { relativeToDirectory: true })}
        >
          <Text style={styles.buttonText}>📲 Llamar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        {/* Botón de Contactos */}
        <TouchableOpacity style={[styles.button, { backgroundColor: '#32CD32' }]}>
          <Text style={styles.buttonText}>📇 Contactos</Text>
        </TouchableOpacity>

        {/* Botón de Mensajes */}
        <TouchableOpacity style={[styles.button, { backgroundColor: '#FFD700' }]}>
          <Text style={styles.buttonText}>💬 Mensajes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        {/* Botón de Notificaciones */}
        <TouchableOpacity style={[styles.button, { backgroundColor: '#8A2BE2' }]}>
          <Text style={styles.buttonText}>🔔 Notificaciones</Text>
        </TouchableOpacity>

        {/* Botón de Ajustes Avanzados */}
        <TouchableOpacity style={[styles.button, { backgroundColor: '#DC143C' }]}>
          <Text style={styles.buttonText}>⚙️ Ajustes</Text>
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
