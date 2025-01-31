import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

export const useNotifications = () => {
  useEffect(() => {
    // Configurar el manejador de notificaciones
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Solicitar permisos para notificaciones
    const solicitarPermisos = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Necesitas habilitar los permisos para recibir notificaciones.');
      }
    };

    solicitarPermisos();

    // Escuchar cuando el usuario toca una notificación
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Usuario tocó la notificación:', response);
        // Aquí puedes manejar la navegación o acciones adicionales
      }
    );

    return () => subscription.remove(); // Limpiar el listener al desmontar
  }, []);
};