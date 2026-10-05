import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Child,
  Parent,
  EventItem,
  Booking,
  Carpool,
  Circle,
  PhoneContact,
  Attendee,
} from '../types';
import { requestAndFetchDeviceContacts } from '../services/contactsService';
import { addEventToDeviceCalendar } from '../services/calendarService';
import { fetchEventsFromGoogleSheet } from '../services/googleSheetsService';

const DEFAULT_PARENT: Parent = {
  id: 'parent-1',
  name: 'Richard Foster',
  phone: '+44 7700 900555',
  email: 'richard.foster@gmail.com',
  workEmail: 'richard.foster@acmecorp.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  children: [
    {
      id: 'child-1',
      name: 'Leo Foster',
      age: 9,
      color: '#111111',
      avatarBg: '#F1F5F9',
      allergies: 'Peanuts (carry EpiPen)',
      clubs: ['West End U10 Strikers', 'Summer Activity Circle'],
    },
    {
      id: 'child-2',
      name: 'Mia Foster',
      age: 7,
      color: '#111111',
      avatarBg: '#F1F5F9',
      allergies: 'None',
      clubs: ['Prima Ballet Academy', 'Summer Activity Circle'],
    },
  ],
};

const INITIAL_CIRCLES: Circle[] = [
  {
    id: 'circle-summer',
    name: 'Summer Holiday Days Out',
    category: 'Google Drive Database',
    code: 'SUMMER-2026',
    icon: 'calendar',
    color: '#111111',
    memberCount: 24,
    adminName: 'Richard Foster',
    description: 'Live 60+ summer activities from Manchester & North West UK database.',
  },
  {
    id: 'circle-school',
    name: 'Year 4 Oak Class Hub',
    category: 'Primary School Class',
    code: 'YEAR4-OAK',
    icon: 'briefcase',
    color: '#111111',
    memberCount: 28,
    adminName: 'Mrs. Higgins & Class Reps',
    description: 'School trips, class parties, and weekend play dates.',
  },
  {
    id: 'circle-1',
    name: 'West End U10 Strikers',
    category: 'Football Club',
    code: 'U10-STRIKERS',
    icon: 'trophy',
    color: '#111111',
    memberCount: 16,
    adminName: 'Marcus Bell (Coach)',
    description: 'Saturday league matches, training fixtures & weekend lift sharing.',
  },
  {
    id: 'circle-2',
    name: 'Prima Ballet Academy',
    category: 'Dance School',
    code: 'PRIMA-BALLET',
    icon: 'music',
    color: '#111111',
    memberCount: 14,
    adminName: 'Miss Clara',
    description: 'Weekly rehearsals, stage costumes & showcase transport.',
  },
];

interface AppContextType {
  parent: Parent;
  children: Child[];
  circles: Circle[];
  events: EventItem[];
  bookings: Booking[];
  carpools: Carpool[];
  contacts: PhoneContact[];
  selectedChildFilter: string;
  selectedCircleFilter: string;
  isSyncingSheet: boolean;
  sheetSyncStatus: string;
  isRegistered: boolean;
  registerParent: (
    parentData: { name: string; phone: string; email: string; workEmail?: string },
    initialChildren: Array<Omit<Child, 'id'>>,
    groupCode?: string
  ) => void;
  loginExisting: (identifier: string) => boolean;
  joinCircleWithCode: (code: string) => { success: boolean; message: string; circle?: Circle };
  updateParentProfile: (parentData: Partial<Parent>) => void;
  logoutAndReset: () => void;
  setSelectedChildFilter: (childId: string) => void;
  setSelectedCircleFilter: (circleId: string) => void;
  syncWithGoogleSheet: () => Promise<string>;
  bookChild: (eventId: string, childId: string) => void;
  cancelBooking: (eventId: string, childId: string) => void;
  payForBooking: (bookingId: string, paymentMethod: string) => void;
  sendCalendarInvite: (
    eventId: string,
    email: string,
    calType: 'work' | 'personal'
  ) => Promise<{ success: boolean; message: string }>;
  offerCarpool: (carpoolData: Omit<Carpool, 'id' | 'passengers' | 'availableSeats'>) => void;
  reserveCarpoolSeat: (carpoolId: string, childId: string, pickupNote?: string) => void;
  cancelCarpoolSeat: (carpoolId: string, childId: string) => void;
  syncDeviceContacts: () => Promise<string>;
  inviteContact: (contactId: string) => void;
  syncEventToPhoneCalendar: (event: EventItem) => Promise<string>;
  addEvent: (newEvent: Omit<EventItem, 'id'>) => void;
  addChild: (childData: Omit<Child, 'id'>) => void;
  deleteChild: (childId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parent, setParent] = useState<Parent>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('kidsync_parent');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_PARENT;
  });

  const [isRegistered, setIsRegistered] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('kidsync_registered');
      if (saved !== null) {
        return saved === 'true';
      }
    }
    return true;
  });

  const [circles, setCircles] = useState<Circle[]>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('kidsync_circles');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_CIRCLES;
  });

  const [events, setEvents] = useState<EventItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [carpools, setCarpools] = useState<Carpool[]>([]);
  const [contacts, setContacts] = useState<PhoneContact[]>([]);
  const [selectedChildFilter, setSelectedChildFilter] = useState<string>('all');
  const [selectedCircleFilter, setSelectedCircleFilter] = useState<string>('all');
  const [isSyncingSheet, setIsSyncingSheet] = useState<boolean>(false);
  const [sheetSyncStatus, setSheetSyncStatus] = useState<string>('');

  useEffect(() => {
    syncDeviceContacts();
    syncWithGoogleSheet();
  }, []);

  const saveStorage = (newParent: Parent, regStatus: boolean, newCircles?: Circle[]) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('kidsync_parent', JSON.stringify(newParent));
      window.localStorage.setItem('kidsync_registered', regStatus ? 'true' : 'false');
      if (newCircles) {
        window.localStorage.setItem('kidsync_circles', JSON.stringify(newCircles));
      }
    }
  };

  const registerParent = (
    parentData: { name: string; phone: string; email: string; workEmail?: string },
    initialChildren: Array<Omit<Child, 'id'>>,
    groupCode?: string
  ) => {
    const newChildren: Child[] = initialChildren.map((c, i) => ({
      ...c,
      id: `child-${Date.now()}-${i}`,
    }));

    const newParent: Parent = {
      id: `parent-${Date.now()}`,
      name: parentData.name,
      phone: parentData.phone,
      email: parentData.email,
      workEmail: parentData.workEmail || '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      children: newChildren,
    };

    let updatedCircles = [...circles];
    if (groupCode) {
      const cleanCode = groupCode.trim().toUpperCase();
      const existing = updatedCircles.find((c) => c.code.toUpperCase() === cleanCode);
      if (!existing) {
        const customCircle: Circle = {
          id: `circle-${Date.now()}`,
          name: `${cleanCode} Activity Group`,
          category: 'Community Group',
          code: cleanCode,
          icon: 'users',
          color: '#111111',
          memberCount: 1,
          adminName: parentData.name,
          description: `Custom group joined with code ${cleanCode}`,
        };
        updatedCircles = [customCircle, ...updatedCircles];
      }
    }

    setParent(newParent);
    setCircles(updatedCircles);
    setIsRegistered(true);
    saveStorage(newParent, true, updatedCircles);
  };

  const loginExisting = (identifier: string): boolean => {
    const trimmed = identifier.trim().toLowerCase();
    if (!trimmed) return false;

    // Check against current parent or saved storage
    if (
      parent.phone.toLowerCase().includes(trimmed) ||
      parent.email.toLowerCase().includes(trimmed) ||
      parent.name.toLowerCase().includes(trimmed) ||
      trimmed === 'demo' ||
      trimmed === 'richard'
    ) {
      setIsRegistered(true);
      saveStorage(parent, true);
      return true;
    }

    // Auto sign-in with identifier as parent
    const quickParent: Parent = {
      id: `parent-${Date.now()}`,
      name: trimmed.includes('@') ? trimmed.split('@')[0] : `Parent (${identifier})`,
      phone: trimmed.includes('@') ? '+44 7700 900111' : identifier,
      email: trimmed.includes('@') ? identifier : `${trimmed.replace(/\s+/g, '')}@family.co.uk`,
      workEmail: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      children: [
        {
          id: `child-${Date.now()}`,
          name: 'My Child',
          age: 8,
          color: '#111111',
          avatarBg: '#F1F5F9',
          allergies: 'None',
          clubs: ['Summer Holiday Days Out'],
        },
      ],
    };

    setParent(quickParent);
    setIsRegistered(true);
    saveStorage(quickParent, true);
    return true;
  };

  const joinCircleWithCode = (code: string): { success: boolean; message: string; circle?: Circle } => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a valid class or club code.' };
    }

    const found = INITIAL_CIRCLES.find((c) => c.code.toUpperCase() === cleanCode);
    const existing = circles.find((c) => c.code.toUpperCase() === cleanCode);

    if (existing) {
      return { success: true, message: `You are already a member of ${existing.name}!`, circle: existing };
    }

    const targetCircle: Circle = found
      ? { ...found, memberCount: found.memberCount + 1 }
      : {
          id: `circle-${Date.now()}`,
          name: `${cleanCode} Class & Activities`,
          category: 'Local Group',
          code: cleanCode,
          icon: 'users',
          color: '#111111',
          memberCount: 1,
          adminName: 'Group Organizer',
          description: `Joined via code ${cleanCode}`,
        };

    const nextCircles = [targetCircle, ...circles];
    setCircles(nextCircles);
    saveStorage(parent, isRegistered, nextCircles);
    return { success: true, message: `Successfully joined ${targetCircle.name}!`, circle: targetCircle };
  };

  const updateParentProfile = (parentData: Partial<Parent>) => {
    setParent((prev) => {
      const updated = { ...prev, ...parentData };
      saveStorage(updated, isRegistered);
      return updated;
    });
  };

  const logoutAndReset = () => {
    setIsRegistered(false);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('kidsync_registered', 'false');
    }
  };

  const syncWithGoogleSheet = async (): Promise<string> => {
    setIsSyncingSheet(true);
    setSheetSyncStatus('Syncing with Google Sheet...');

    const res = await fetchEventsFromGoogleSheet();
    setIsSyncingSheet(false);

    if (res.success && res.events.length > 0) {
      setEvents(res.events);
      setSheetSyncStatus(`Live synced: ${res.events.length} activities from Google Drive`);

      const generatedCarpools: Carpool[] = [
        {
          id: 'cp-sheet-1',
          eventId: res.events[0]?.id || 'event-1',
          driverId: 'parent-marcus',
          driverName: 'Marcus Bell (Parent)',
          driverPhone: '+44 7700 900456',
          vehicle: 'Black Nissan Qashqai (3 booster seats)',
          totalSeats: 3,
          availableSeats: 1,
          departureTime: '10:00 AM',
          pickupLocation: 'West End Community Centre Car Park',
          returnTrip: true,
          notes: 'Heading straight there. Plenty of boot space for bags.',
          passengers: [
            {
              childId: parent.children[0]?.id || 'child-1',
              childName: parent.children[0]?.name || 'Leo Foster',
              parentId: parent.id,
              parentName: parent.name,
              parentPhone: parent.phone,
              seats: 1,
            },
            {
              childId: 'child-noah',
              childName: 'Noah Bell',
              parentId: 'parent-marcus',
              parentName: 'Marcus Bell',
              parentPhone: '+44 7700 900456',
              seats: 1,
            },
          ],
        },
        {
          id: 'cp-sheet-2',
          eventId: res.events[1]?.id || 'event-2',
          driverId: 'parent-elena',
          driverName: 'Elena Rostova',
          driverPhone: '+44 7700 900789',
          vehicle: 'Silver Volvo XC60',
          totalSeats: 4,
          availableSeats: 3,
          departureTime: '11:15 AM',
          pickupLocation: 'School Gates',
          returnTrip: true,
          notes: 'Can drop kids back after event finishes.',
          passengers: [
            {
              childId: 'child-sophia',
              childName: 'Sophia Rostova',
              parentId: 'parent-elena',
              parentName: 'Elena Rostova',
              parentPhone: '+44 7700 900789',
              seats: 1,
            },
          ],
        },
      ];
      setCarpools(generatedCarpools);

      const initialBookings: Booking[] = [
        {
          id: 'b-sheet-1',
          eventId: res.events[0]?.id || 'event-1',
          childId: parent.children[0]?.id || 'child-1',
          childName: parent.children[0]?.name || 'Leo Foster',
          parentId: parent.id,
          parentName: parent.name,
          status: 'confirmed',
          bookedAt: new Date().toISOString(),
          paymentStatus: res.events[0]?.cost > 0 ? 'unpaid' : 'free',
          amountDue: res.events[0]?.cost || 0,
        },
        {
          id: 'b-sheet-2',
          eventId: res.events[1]?.id || 'event-2',
          childId: parent.children[1]?.id || 'child-2',
          childName: parent.children[1]?.name || 'Mia Foster',
          parentId: parent.id,
          parentName: parent.name,
          status: 'confirmed',
          bookedAt: new Date().toISOString(),
          paymentStatus: res.events[1]?.cost > 0 ? 'paid' : 'free',
          amountDue: res.events[1]?.cost || 0,
          paidAt: new Date().toISOString(),
          paymentMethod: 'Apple Pay',
          transactionRef: 'TXN-774910',
        },
      ];
      setBookings(initialBookings);

      return res.message;
    } else {
      setSheetSyncStatus('Using cached activities');
      return res.message;
    }
  };

  const syncDeviceContacts = async () => {
    const res = await requestAndFetchDeviceContacts();
    setContacts(res.contacts);
    return res.message || 'Contacts updated.';
  };

  const inviteContact = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, invited: true } : c))
    );
  };

  const bookChild = (eventId: string, childId: string) => {
    const child = parent.children.find((c) => c.id === childId);
    const event = events.find((e) => e.id === eventId);
    if (!child || !event) return;

    const existing = bookings.find(
      (b) => b.eventId === eventId && b.childId === childId
    );
    if (existing) return;

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      eventId,
      childId,
      childName: child.name,
      parentId: parent.id,
      parentName: parent.name,
      status: 'confirmed',
      bookedAt: new Date().toISOString(),
      paymentStatus: event.paymentRequired ? 'unpaid' : 'free',
      amountDue: event.cost,
    };

    setBookings((prev) => [...prev, newBooking]);

    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        return {
          ...ev,
          attendees: [
            ...ev.attendees,
            {
              id: `att-${Date.now()}`,
              childName: child.name,
              parentName: parent.name,
              avatarBg: child.avatarBg,
              isMyChild: true,
            },
          ],
        };
      })
    );
  };

  const cancelBooking = (eventId: string, childId: string) => {
    setBookings((prev) =>
      prev.filter((b) => !(b.eventId === eventId && b.childId === childId))
    );

    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const child = parent.children.find((c) => c.id === childId);
        return {
          ...ev,
          attendees: ev.attendees.filter((a) => a.childName !== child?.name),
        };
      })
    );

    carpools.forEach((cp) => {
      if (cp.eventId === eventId) {
        cancelCarpoolSeat(cp.id, childId);
      }
    });
  };

  const payForBooking = (bookingId: string, paymentMethod: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          paymentStatus: 'paid',
          paidAt: new Date().toISOString(),
          paymentMethod,
          transactionRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        };
      })
    );
  };

  const sendCalendarInvite = async (
    eventId: string,
    email: string,
    calType: 'work' | 'personal'
  ): Promise<{ success: boolean; message: string }> => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return { success: false, message: 'Event not found' };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Calendar invite for "${event.title}" sent to ${email} (${calType === 'work' ? 'Work Calendar / Outlook' : 'Personal Calendar'}).`,
        });
      }, 500);
    });
  };

  const offerCarpool = (
    data: Omit<Carpool, 'id' | 'passengers' | 'availableSeats'>
  ) => {
    const newCarpool: Carpool = {
      ...data,
      id: `cp-${Date.now()}`,
      availableSeats: data.totalSeats,
      passengers: [],
    };
    setCarpools((prev) => [newCarpool, ...prev]);
  };

  const reserveCarpoolSeat = (
    carpoolId: string,
    childId: string,
    pickupNote?: string
  ) => {
    const child = parent.children.find((c) => c.id === childId);
    if (!child) return;

    setCarpools((prev) =>
      prev.map((cp) => {
        if (cp.id !== carpoolId) return cp;
        if (cp.availableSeats <= 0) return cp;
        if (cp.passengers.some((p) => p.childId === childId)) return cp;

        const updatedPassengers = [
          ...cp.passengers,
          {
            childId: child.id,
            childName: child.name,
            parentId: parent.id,
            parentName: parent.name,
            parentPhone: parent.phone,
            seats: 1,
            pickupNote,
          },
        ];

        return {
          ...cp,
          availableSeats: cp.totalSeats - updatedPassengers.length,
          passengers: updatedPassengers,
        };
      })
    );
  };

  const cancelCarpoolSeat = (carpoolId: string, childId: string) => {
    setCarpools((prev) =>
      prev.map((cp) => {
        if (cp.id !== carpoolId) return cp;
        const updatedPassengers = cp.passengers.filter(
          (p) => p.childId !== childId
        );
        return {
          ...cp,
          availableSeats: cp.totalSeats - updatedPassengers.length,
          passengers: updatedPassengers,
        };
      })
    );
  };

  const syncEventToPhoneCalendar = async (event: EventItem) => {
    const result = await addEventToDeviceCalendar(event);
    return result.message;
  };

  const addEvent = (newEvent: Omit<EventItem, 'id'>) => {
    const item: EventItem = {
      ...newEvent,
      id: `event-${Date.now()}`,
    };
    setEvents((prev) => [item, ...prev]);
  };

  const addChild = (childData: Omit<Child, 'id'>) => {
    const newKid: Child = {
      ...childData,
      id: `child-${Date.now()}`,
    };
    setParent((prev) => ({
      ...prev,
      children: [...prev.children, newKid],
    }));
  };

  const deleteChild = (childId: string) => {
    setParent((prev) => ({
      ...prev,
      children: prev.children.filter((c) => c.id !== childId),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        parent,
        children: parent.children,
        circles,
        events,
        bookings,
        carpools,
        contacts,
        selectedChildFilter,
        selectedCircleFilter,
        isSyncingSheet,
        sheetSyncStatus,
        isRegistered,
        registerParent,
        loginExisting,
        joinCircleWithCode,
        updateParentProfile,
        logoutAndReset,
        setSelectedChildFilter,
        setSelectedCircleFilter,
        syncWithGoogleSheet,
        bookChild,
        cancelBooking,
        payForBooking,
        sendCalendarInvite,
        offerCarpool,
        reserveCarpoolSeat,
        cancelCarpoolSeat,
        syncDeviceContacts,
        inviteContact,
        syncEventToPhoneCalendar,
        addEvent,
        addChild,
        deleteChild,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
