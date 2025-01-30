import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, TextInput, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import Checkbox from 'expo-checkbox';

// Configuración de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const RutinasCrear = () => {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
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
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Solicitar permisos al iniciar
  useEffect(() => {
    if (Platform.OS !== 'web') {
      Notifications.requestPermissionsAsync();
    }
  }, []);

  // Función para programar la notificación
  const scheduleNotification = async () => {
    if (Platform.OS === 'web') {
      console.log('Las notificaciones no están disponibles en la web.');
      return; // Salir si estamos en la web
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

    let notificationScheduled = false; // Variable para verificar si se programó alguna notificación

    Object.entries(selectedDays).forEach(async ([day, isSelected]) => {
      if (isSelected) {
        // Crear el mensaje dinámico para la notificación
        const dynamicMessage = notificationMessage
          ? `Es hora de tus ${notificationMessage}`
          : 'Es hora de realizar tu acción programada'; // Si no hay mensaje personalizado, usa uno por defecto

        // Agregar la hora seleccionada al mensaje de la notificación
        const hour = selectedTime.getHours().toString().padStart(2, '0');
        const minute = selectedTime.getMinutes().toString().padStart(2, '0');
        const timeString = `${hour}:${minute}`;

        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Recordatorio',
            body: `${dynamicMessage} a las ${timeString}`, // Usar la hora seleccionada en el mensaje
          },
          trigger: {
            hour: selectedTime.getHours(),
            minute: selectedTime.getMinutes(),
            weekday: daysMapping[day],
            repeats: true,
          } as Notifications.CalendarTriggerInput,
        });

        // Marca que se ha programado al menos una notificación
        notificationScheduled = true;
      }
    });

    // Si se programó una notificación, muestra el mensaje de confirmación
    if (notificationScheduled) {
      const hour = selectedTime.getHours().toString().padStart(2, '0');
      const minute = selectedTime.getMinutes().toString().padStart(2, '0');
      const timeString = `${hour}:${minute}`;
      setConfirmationMessage(
        `Notificación programada: "${notificationMessage || 'Recordatorio de acción'}" a las ${timeString}`
      );
    }
  };

  // Renderizar los días seleccionables
  const renderDaysSelector = () => {
    return Object.keys(selectedDays).map((day) => (
      <View key={day} style={styles.checkboxContainer}>
        <Checkbox
          value={selectedDays[day]}
          onValueChange={(newValue) => setSelectedDays({ ...selectedDays, [day]: newValue })}
        />
        <Text style={styles.dayText}>
          {day.charAt(0).toUpperCase() + day.slice(1)}
        </Text>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Selector de hora */}
      <Text style={styles.title}>Selecciona la hora</Text>
      <Button title="Elegir hora" onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setSelectedTime(date);
          }}
        />
      )}

      {/* Selector de días */}
      <Text style={styles.title}>Selecciona los días</Text>
      {renderDaysSelector()}

      {/* Campo de mensaje */}
      <TextInput
        style={styles.input}
        placeholder="Escribe tu mensaje de notificación"
        value={notificationMessage}
        onChangeText={setNotificationMessage}
      />

      {/* Botón para programar la notificación */}
      <Button title="Programar Notificación" onPress={scheduleNotification} />

      {/* Mensaje de confirmación */}
      {confirmationMessage ? (
        <Text style={styles.confirmationMessage}>{confirmationMessage}</Text>
      ) : null}
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1C1C1C', // Gris oscuro
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#D3D3D3', // Gris muy claro
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  dayText: {
    marginLeft: 10,
    color: '#B0B0B0', // Gris intermedio
  },
  input: {
    height: 40,
    borderColor: '#007AFF', // Azul para el borde
    borderWidth: 1,
    marginTop: 20,
    paddingLeft: 10,
    color: '#D3D3D3', // Gris muy claro para el texto
    backgroundColor: '#2A2A2A', // Gris intermedio para el fondo
  },
  confirmationMessage: {
    marginTop: 20,
    fontSize: 16,
    color: '#A9A9A9', // Gris claro para el mensaje de confirmación
    fontWeight: 'bold',
  },
});

export default RutinasCrear;









