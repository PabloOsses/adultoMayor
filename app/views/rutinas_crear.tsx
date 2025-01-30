import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Importar íconos

// Configuración de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

interface Rutina {
  id: string;
  nombre: string;
  hora: string;
  dias: string[];
}

interface RutinasCrearProps {
  navigation: NavigationProp<any>;
}

const RutinasCrear: React.FC<RutinasCrearProps> = ({ navigation }) => {
  const [hora, setHora] = useState('08');
  const [minuto, setMinuto] = useState('00');
  const [selectedDays, setSelectedDays] = useState<{ [key: string]: boolean }>({
    lunes: false,
    martes: false,
    miercoles: false,
    jueves: false,
    viernes: false,
    sabado: false,
    domingo: false,
  });
  const [notificationMessage, setNotificationMessage] = useState('');

  // Solicitar permisos al iniciar
  useEffect(() => {
    if (Platform.OS !== 'web') {
      Notifications.requestPermissionsAsync();
    }
  }, []);

  // Función para programar la notificación
  const scheduleNotification = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Error', 'Las notificaciones no están disponibles en la web.');
      return;
    }

    const daysMapping: { [key: string]: number } = {
      domingo: 0,
      lunes: 1,
      martes: 2,
      miercoles: 3,
      jueves: 4,
      viernes: 5,
      sabado: 6,
    };

    const diasSeleccionados = Object.keys(selectedDays).filter((day) => selectedDays[day]);
    if (diasSeleccionados.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un día.');
      return;
    }

    const horaFormateada = `${hora.padStart(2, '0')}:${minuto.padStart(2, '0')}`;

    const nuevaRutina: Rutina = {
      id: Math.random().toString(),
      nombre: notificationMessage || 'Recordatorio',
      hora: horaFormateada,
      dias: diasSeleccionados,
    };

    // Guardar la rutina en AsyncStorage
    try {
      const rutinasGuardadas = await AsyncStorage.getItem('rutinas');
      const rutinas = rutinasGuardadas ? JSON.parse(rutinasGuardadas) : [];
      rutinas.push(nuevaRutina);
      await AsyncStorage.setItem('rutinas', JSON.stringify(rutinas));
    } catch (error) {
      console.error('Error al guardar la rutina:', error);
    }

    // Programar notificaciones para los días seleccionados
    diasSeleccionados.forEach(async (day) => {
      const trigger: Notifications.CalendarTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: parseInt(hora, 10),
        minute: parseInt(minuto, 10),
        weekday: daysMapping[day],
        repeats: true,
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Recordatorio',
          body: `${notificationMessage || 'Es hora de tu rutina'} a las ${horaFormateada}`,
        },
        trigger,
      });
    });

    Alert.alert('Éxito', 'Rutina programada correctamente.');
    navigation.goBack(); // Regresar a la pantalla anterior
  };

  // Renderizar los días seleccionables
  const renderDaysSelector = () => {
    return Object.keys(selectedDays).map((day) => (
      <View key={day} style={styles.checkboxContainer}>
        <Checkbox
          value={selectedDays[day]}
          onValueChange={(newValue) => setSelectedDays({ ...selectedDays, [day]: newValue })}
          color={selectedDays[day] ? '#007AFF' : undefined}
        />
        <Text style={styles.dayText}>
          {day.charAt(0).toUpperCase() + day.slice(1)}
        </Text>
      </View>
    ));
  };

  // Función para incrementar o decrementar la hora o los minutos
  const adjustTime = (type: 'hora' | 'minuto', delta: number) => {
    if (type === 'hora') {
      let newHora = parseInt(hora, 10) + delta;
      if (newHora < 0) newHora = 23;
      if (newHora > 23) newHora = 0;
      setHora(newHora.toString().padStart(2, '0'));
    } else {
      let newMinuto = parseInt(minuto, 10) + delta;
      if (newMinuto < 0) newMinuto = 59;
      if (newMinuto > 59) newMinuto = 0;
      setMinuto(newMinuto.toString().padStart(2, '0'));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Selector de hora */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hora de la rutina</Text>
          <View style={styles.timePickerContainer}>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => adjustTime('hora', -1)}
            >
              <Ionicons name="chevron-up" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TextInput
              style={styles.timeInput}
              value={hora}
              onChangeText={(text) => setHora(text.replace(/[^0-9]/g, '').slice(0, 2))}
              keyboardType="numeric"
              maxLength={2}
            />
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => adjustTime('hora', 1)}
            >
              <Ionicons name="chevron-down" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.timeSeparator}>:</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => adjustTime('minuto', -1)}
            >
              <Ionicons name="chevron-up" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TextInput
              style={styles.timeInput}
              value={minuto}
              onChangeText={(text) => setMinuto(text.replace(/[^0-9]/g, '').slice(0, 2))}
              keyboardType="numeric"
              maxLength={2}
            />
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => adjustTime('minuto', 1)}
            >
              <Ionicons name="chevron-down" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Selector de días */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Días de la rutina</Text>
          {renderDaysSelector()}
        </View>

        {/* Campo de mensaje */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mensaje de notificación</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Tomar agua"
            value={notificationMessage}
            onChangeText={setNotificationMessage}
          />
        </View>
      </ScrollView>

      {/* Botón de acción */}
      <TouchableOpacity style={styles.saveButton} onPress={scheduleNotification}>
        <Text style={styles.saveButtonText}>Guardar Rutina</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // Espacio para el botón de guardar
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButton: {
    padding: 8,
  },
  timeInput: {
    width: 50,
    height: 40,
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    marginHorizontal: 8,
  },
  timeSeparator: {
    fontSize: 24,
    color: '#333',
    marginHorizontal: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dayText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default RutinasCrear;