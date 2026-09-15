import * as Contacts from 'expo-contacts';
import { Platform } from 'react-native';
import { PhoneContact } from '../types';

export const INITIAL_MOCK_CONTACTS: PhoneContact[] = [
  {
    id: 'mock-1',
    name: 'Sarah Jenkins (Oliver’s Mum)',
    phone: '+44 7700 900123',
    email: 'sarah.j@example.com',
    isRegisteredUser: true,
    linkedKidNames: ['Oliver Jenkins (Age 9)'],
  },
  {
    id: 'mock-2',
    name: 'Marcus Bell (U10 Coach & Dad)',
    phone: '+44 7700 900456',
    email: 'marcus.b@example.com',
    isRegisteredUser: true,
    linkedKidNames: ['Noah Bell (Age 10)'],
  },
  {
    id: 'mock-3',
    name: 'Elena Rostova (Ballet Mum)',
    phone: '+44 7700 900789',
    email: 'elena.r@example.com',
    isRegisteredUser: true,
    linkedKidNames: ['Sophia Rostova (Age 7)'],
  },
  {
    id: 'mock-4',
    name: 'Dave Wilson',
    phone: '+44 7700 900321',
    email: 'dave.w@example.com',
    isRegisteredUser: false,
    invited: false,
  },
  {
    id: 'mock-5',
    name: 'Claire Davies',
    phone: '+44 7700 900654',
    email: 'claire.d@example.com',
    isRegisteredUser: false,
    invited: true,
  },
  {
    id: 'mock-6',
    name: 'Tom Harrison',
    phone: '+44 7700 900987',
    isRegisteredUser: false,
    invited: false,
  },
];

export async function requestAndFetchDeviceContacts(): Promise<{
  success: boolean;
  contacts: PhoneContact[];
  message?: string;
}> {
  try {
    if (Platform.OS === 'web') {
      return {
        success: true,
        contacts: INITIAL_MOCK_CONTACTS,
        message: 'Loaded demo contacts (browser preview mode). On a physical device, this syncs with your native phone address book.',
      };
    }

    const isAvailable = await Contacts.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        contacts: INITIAL_MOCK_CONTACTS,
        message: 'Contacts API not available on this device platform.',
      };
    }

    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      return {
        success: false,
        contacts: INITIAL_MOCK_CONTACTS,
        message: 'Permission to access contacts was denied. Displaying cached contacts.',
      };
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
      sort: Contacts.SortTypes.FirstName,
    });

    if (data.length > 0) {
      const mapped: PhoneContact[] = data
        .filter((c) => c.name && c.phoneNumbers && c.phoneNumbers.length > 0)
        .map((c) => ({
          id: c.id || Math.random().toString(),
          name: c.name || 'Unnamed Contact',
          phone: c.phoneNumbers?.[0]?.number || '',
          email: c.emails?.[0]?.email,
          isRegisteredUser: false,
        }));

      return {
        success: true,
        contacts: [...INITIAL_MOCK_CONTACTS, ...mapped],
        message: `Successfully synchronized ${mapped.length} phone contacts!`,
      };
    }

    return {
      success: true,
      contacts: INITIAL_MOCK_CONTACTS,
      message: 'No contacts found on device. Displaying mock contacts.',
    };
  } catch (error: any) {
    console.warn('Error reading device contacts:', error);
    return {
      success: false,
      contacts: INITIAL_MOCK_CONTACTS,
      message: error.message || 'Could not sync contacts.',
    };
  }
}
