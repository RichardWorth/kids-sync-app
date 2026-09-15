import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
import { EventItem } from '../types';

export async function addEventToDeviceCalendar(event: EventItem): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    if (Platform.OS === 'web') {
      return {
        success: true,
        message: `Synced "${event.title}" to device calendar! (Simulated on Web)`,
      };
    }

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      return {
        success: false,
        message: 'Permission to access phone calendar was denied.',
      };
    }

    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    let targetCalendar = calendars.find(
      (cal) => cal.allowsModifications && (cal.isPrimary || cal.name === 'KidSync Activities')
    );

    if (!targetCalendar && calendars.length > 0) {
      targetCalendar = calendars.find((cal) => cal.allowsModifications) || calendars[0];
    }

    if (!targetCalendar) {
      return {
        success: false,
        message: 'No writable calendar found on device.',
      };
    }

    // Parse date and times
    // Date format: YYYY-MM-DD, time format: HH:MM
    const [year, month, day] = event.date.split('-').map(Number);
    const [startHour, startMinute] = event.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);

    const startDate = new Date(year, month - 1, day, startHour, startMinute);
    const endDate = new Date(year, month - 1, day, endHour, endMinute);

    await Calendar.createEventAsync(targetCalendar.id, {
      title: `[KidSync] ${event.title}`,
      startDate,
      endDate,
      location: `${event.location} - ${event.address}`,
      notes: `${event.description}\nClub: ${event.circleName}\nContact: ${event.organizerName} (${event.organizerPhone})`,
      alarms: [{ relativeOffset: -60 }], // Remind 1 hour before
    });

    return {
      success: true,
      message: `Successfully added "${event.title}" to your phone's calendar with a 1-hour reminder!`,
    };
  } catch (error: any) {
    console.warn('Error adding event to calendar:', error);
    return {
      success: false,
      message: error.message || 'Could not sync event to calendar.',
    };
  }
}
