export interface Child {
  id: string;
  name: string;
  age: number;
  color: string;
  avatarBg: string;
  allergies?: string;
  clubs: string[];
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
  workEmail?: string;
  avatar: string;
  children: Child[];
}

export type EventCategory = 'match' | 'training' | 'party' | 'club' | 'school';

export interface Attendee {
  id: string;
  childName: string;
  parentName: string;
  avatarBg: string;
  isMyChild?: boolean;
}

export interface EventItem {
  id: string;
  circleId: string;
  circleName: string;
  title: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string;
  address: string;
  description: string;
  cost: number; // in GBP (0 for free)
  costLabel: string; // e.g. "£5 Match Sub", "Free (Birthday Guest)"
  paymentRequired: boolean;
  organizerName: string;
  organizerPhone: string;
  capacity: number;
  eligibleChildIds: string[];
  attendees: Attendee[];
  kitNotes?: string;
}

export interface Booking {
  id: string;
  eventId: string;
  childId: string;
  childName: string;
  parentId: string;
  parentName: string;
  status: 'confirmed' | 'waitlist' | 'declined';
  bookedAt: string;
  paymentStatus: 'paid' | 'unpaid' | 'free';
  amountDue: number;
  paidAt?: string;
  paymentMethod?: string;
  transactionRef?: string;
}

export interface CarpoolPassenger {
  childId: string;
  childName: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  seats: number;
  pickupNote?: string;
}

export interface Carpool {
  id: string;
  eventId: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicle: string;
  totalSeats: number;
  availableSeats: number;
  departureTime: string;
  pickupLocation: string;
  returnTrip: boolean;
  notes?: string;
  passengers: CarpoolPassenger[];
}

export interface Circle {
  id: string;
  name: string;
  category: string;
  code: string;
  icon: string;
  color: string;
  memberCount: number;
  adminName: string;
  description?: string;
}

export interface PhoneContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  isRegisteredUser: boolean;
  linkedKidNames?: string[];
  invited?: boolean;
}
