import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import {Rutina} from "../interfaces/rutina_interface";
import { Platform } from 'react-native';
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const AgregarRutina = () => {
  const [nombre, setNombre] = useState('');
  const [hora, setHora] = useState(new Date());
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [mostrarTimePicker, setMostrarTimePicker] = useState(false);
  const navigation = useNavigation();

  const guardarRutina = async () => {
    if (!nombre || !hora || diasSeleccionados.length === 0) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const nuevaRutina: Rutina = {
      id: Math.random().toString(36).substr(2, 9),
      nombre,
      hora: hora.toTimeString().substring(0, 5),
      dias: diasSeleccionados,
    };

    try {
      const rutinasGuardadas = await AsyncStorage.getItem('rutinas');
      const rutinas = rutinasGuardadas ? JSON.parse(rutinasGuardadas) : [];
      rutinas.push(nuevaRutina);
      await AsyncStorage.setItem('rutinas', JSON.stringify(rutinas));

      // Programar notificaciones para cada día seleccionado
      for (const dia of diasSeleccionados) {
        await programarNotificacion(nuevaRutina, dia);
      }

      Alert.alert('Éxito', 'Rutina guardada correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar la rutina:', error);
      Alert.alert('Error', 'No se pudo guardar la rutina.');
    }
  };

  const programarNotificacion = async (rutina: Rutina, dia: string) => {
    const diasSemanaMap: { [key: string]: number } = {
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
      Domingo: 0,
    };

    const [horas, minutos] = rutina.hora.split(':').map(Number);

  // Obtener la fecha actual
  const ahora = new Date();
  const fechaNotificacion = new Date(ahora);

  // Establecer la hora de la notificación
  fechaNotificacion.setHours(horas, minutos, 0, 0);

  // Calcular el próximo día de la semana
  const diaSemanaActual = ahora.getDay(); // 0 (Domingo) a 6 (Sábado)
  const diaSemanaDeseado = diasSemanaMap[dia]; // 1 (Lunes) a 7 (Domingo)

  // Calcular la diferencia de días
  let diferenciaDias = diaSemanaDeseado - diaSemanaActual;
  if (diferenciaDias < 0) {
    diferenciaDias += 7; // Si ya pasó el día, programar para la próxima semana
  }

  // Añadir la diferencia de días a la fecha de notificación
  fechaNotificacion.setDate(ahora.getDate() + diferenciaDias);

  // Programar la notificación
  if (Platform.OS === 'ios') {
    // Usar trigger 'calendar' en iOS
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '¡Es hora!',
        body: rutina.nombre,
        sound: true,
      },
      trigger: {
        type: 'calendar',
        weekday: diaSemanaDeseado,
        hour: horas,
        minute: minutos,
        repeats: true,
      } as Notifications.NotificationTriggerInput,
    });
  } else {
    // Usar trigger 'date' en Android
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '¡Es hora!',
        body: rutina.nombre,
        sound: true,
      },
      trigger: {
        type: 'date',
        date: fechaNotificacion, // Fecha y hora de la notificación
        repeats: true, // Repetir semanalmente
      } as Notifications.NotificationTriggerInput,
    });
  }
  };

  const onChangeHora = (event: DateTimePickerEvent, selectedTime: Date | undefined) => {
    setMostrarTimePicker(false);
    if (selectedTime) {
      setHora(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del aviso:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ej: Tomar remedio"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Hora:</Text>
      <TouchableOpacity
        style={styles.horaButton}
        onPress={() => setMostrarTimePicker(true)}
      >
        <Text style={styles.horaButtonText}>
          {hora.toTimeString().substring(0, 5)}
        </Text>
      </TouchableOpacity>

      {mostrarTimePicker && (
        <DateTimePicker
          value={hora}
          mode="time"
          display="spinner"
          onChange={onChangeHora}
        />
      )}

      <Text style={styles.label}>Días de la semana:</Text>
      <View style={styles.diasContainer}>
        {diasSemana.map((dia) => (
          <TouchableOpacity
            key={dia}
            style={[
              styles.diaButton,
              diasSeleccionados.includes(dia) && styles.diaButtonSelected,
            ]}
            onPress={() => {
              if (diasSeleccionados.includes(dia)) {
                setDiasSeleccionados(diasSeleccionados.filter((d) => d !== dia));
              } else {
                setDiasSeleccionados([...diasSeleccionados, dia]);
              }
            }}
          >
            <Text style={styles.diaButtonText}>
              {dia} {diasSeleccionados.includes(dia) ? '✓' : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.guardarButton} onPress={guardarRutina}>
        <Text style={styles.guardarButtonText}>Guardar Rutina</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  horaButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  horaButtonText: {
    fontSize: 18,
    color: '#333',
  },
  diasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  diaButton: {
    width: '48%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  diaButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  diaButtonText: {
    fontSize: 18,
    color: '#333',
  },
  guardarButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  guardarButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AgregarRutina;