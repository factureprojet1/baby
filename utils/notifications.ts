import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('feeding-reminders', {
          name: 'Feeding Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FFB6C1',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  },

  async scheduleFeeding(
    triggerTime: Date,
    suggestedSide: 'left' | 'right' | 'bottle'
  ): Promise<string | null> {
    try {
      await this.cancelAllNotifications();

      const now = new Date();
      const triggerSeconds = Math.floor((triggerTime.getTime() - now.getTime()) / 1000);

      if (triggerSeconds <= 0) {
        console.warn('Cannot schedule notification in the past');
        return null;
      }

      const sideText = suggestedSide === 'bottle'
        ? 'Time to prepare a bottle'
        : `Suggested side: ${suggestedSide.charAt(0).toUpperCase() + suggestedSide.slice(1)} breast`;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time to feed the baby 🍼',
          body: sideText,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          seconds: triggerSeconds,
          channelId: 'feeding-reminders',
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  },

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  },
};
