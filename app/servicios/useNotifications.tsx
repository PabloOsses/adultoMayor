import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

export const useNotifications = () => {
  useEffect(() => {
    // Solicitar permisos para notificaciones
    const solicitarPermisos = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Necesitas habilitar los permisos para recibir notificaciones.');
      }
    };

    solicitarPermisos();

    // Escuchar notificaciones recibidas en primer plano
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notificación recibida:', notification);
        // Aquí puedes actualizar el estado de tu app para reflejar la notificación
      }
    );

    // Escuchar cuando el usuario toca una notificación (primer y segundo plano)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Usuario tocó la notificación:', response);
        // Aquí puedes navegar a una pantalla específica o realizar alguna acción
      }
    );

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);
};