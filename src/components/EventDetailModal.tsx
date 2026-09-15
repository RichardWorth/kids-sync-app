import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { EventItem } from '../types';
import { useApp } from '../context/AppContext';
import { CarpoolCard } from './CarpoolCard';
import { OfferRideModal } from './OfferRideModal';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Car,
  CalendarPlus,
  CheckCircle2,
  XCircle,
  Phone,
  Navigation,
  Share2,
} from 'lucide-react-native';

interface EventDetailModalProps {
  visible: boolean;
  event: EventItem | null;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  visible,
  event,
  onClose,
}) => {
  const {
    children,
    bookings,
    carpools,
    bookChild,
    cancelBooking,
    syncEventToPhoneCalendar,
  } = useApp();

  const [offerModalVisible, setOfferModalVisible] = useState(false);

  if (!event) return null;

  const eventCarpools = carpools.filter((cp) => cp.eventId === event.id);
  const eligibleChildren = children.filter((c) =>
    event.eligibleChildIds.includes(c.id)
  );

  const bookedChildIds = bookings
    .filter((b) => b.eventId === event.id && b.status === 'confirmed')
    .map((b) => b.childId);

  const handleOpenMaps = () => {
    const query = encodeURIComponent(`${event.location}, ${event.address}`);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    if (url) Linking.openURL(url);
  };

  const handleCallOrganizer = () => {
    Linking.openURL(`tel:${event.organizerPhone}`);
  };

  const handleCalendarSync = async () => {
    const msg = await syncEventToPhoneCalendar(event);
    Alert.alert('Device Calendar', msg);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.circleTag}>{event.circleName}</Text>
              <Text style={styles.title}>{event.title}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.scrollContent}>
            {/* When and Where Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Calendar size={16} color="#4F46E5" />
                <Text style={styles.infoText}>
                  <Text style={styles.boldText}>{event.date}</Text> • {event.startTime} - {event.endTime}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <MapPin size={16} color="#EF4444" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.boldText}>{event.location}</Text>
                  <Text style={styles.subText}>{event.address}</Text>
                </View>
              </View>

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={handleOpenMaps}>
                  <Navigation size={14} color="#4F46E5" />
                  <Text style={styles.actionBtnText}>Open in Maps</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} onPress={handleCalendarSync}>
                  <CalendarPlus size={14} color="#15803D" />
                  <Text style={[styles.actionBtnText, { color: '#15803D' }]}>
                    Save to Calendar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Details & Kit Instructions</Text>
              <Text style={styles.descriptionText}>{event.description}</Text>
              {event.kitNotes && (
                <Text style={styles.feeText}>🎽 Kit / Gear: {event.kitNotes}</Text>
              )}
              {event.costLabel && (
                <Text style={styles.feeText}>💰 Fee / Subs: {event.costLabel}</Text>
              )}
            </View>

            {/* Child Attendance RSVP */}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Family RSVP & Attendance</Text>
              {eligibleChildren.map((kid) => {
                const isBooked = bookedChildIds.includes(kid.id);
                return (
                  <View key={kid.id} style={styles.rsvpCard}>
                    <View style={styles.kidIdentity}>
                      <View
                        style={[styles.kidDot, { backgroundColor: kid.color }]}
                      />
                      <View>
                        <Text style={styles.kidName}>{kid.name}</Text>
                        <Text style={styles.kidSub}>
                          {isBooked ? 'Currently attending' : 'Not yet confirmed'}
                        </Text>
                      </View>
                    </View>

                    {isBooked ? (
                      <TouchableOpacity
                        style={styles.cancelRsvpBtn}
                        onPress={() => cancelBooking(event.id, kid.id)}
                      >
                        <XCircle size={14} color="#DC2626" />
                        <Text style={styles.cancelRsvpText}>Change RSVP</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.confirmRsvpBtn}
                        onPress={() => bookChild(event.id, kid.id)}
                      >
                        <CheckCircle2 size={14} color="#FFFFFF" />
                        <Text style={styles.confirmRsvpText}>Confirm Attending</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Carpool Lift Sharing Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderWithAction}>
                <View>
                  <Text style={styles.sectionHeading}>🚗 Lift Sharing & Carpools</Text>
                  <Text style={styles.sectionSub}>
                    Coordinate rides with other parents attending
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.offerRideBtn}
                  onPress={() => setOfferModalVisible(true)}
                >
                  <Car size={14} color="#FFFFFF" />
                  <Text style={styles.offerRideBtnText}>Offer Ride</Text>
                </TouchableOpacity>
              </View>

              {eventCarpools.length > 0 ? (
                eventCarpools.map((cp) => (
                  <CarpoolCard key={cp.id} carpool={cp} event={event} />
                ))
              ) : (
                <View style={styles.emptyCarpoolBox}>
                  <Car size={32} color="#94A3B8" />
                  <Text style={styles.emptyCarpoolTitle}>
                    No lifts offered yet
                  </Text>
                  <Text style={styles.emptyCarpoolSub}>
                    Got spare seats in your car? Tap 'Offer Ride' to help out
                    fellow parents from {event.circleName}.
                  </Text>
                  <TouchableOpacity
                    style={styles.firstOfferBtn}
                    onPress={() => setOfferModalVisible(true)}
                  >
                    <Text style={styles.firstOfferBtnText}>
                      + Be the first to offer a ride
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Organizer Contact */}
            <View style={styles.organizerSection}>
              <Text style={styles.organizerTitle}>Event Organizer</Text>
              <View style={styles.organizerRow}>
                <View>
                  <Text style={styles.organizerName}>{event.organizerName}</Text>
                  <Text style={styles.organizerPhone}>
                    {event.organizerPhone}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={handleCallOrganizer}
                >
                  <Phone size={15} color="#4F46E5" />
                  <Text style={styles.callBtnText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Offer Ride Sub-Modal */}
      <OfferRideModal
        visible={offerModalVisible}
        event={event}
        onClose={() => setOfferModalVisible(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '92%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  circleTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
    gap: 18,
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#334155',
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  subText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 9,
    borderRadius: 10,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  section: {
    gap: 8,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  feeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#047857',
    marginTop: 4,
  },
  rsvpCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  kidIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  kidDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  kidName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  kidSub: {
    fontSize: 12,
    color: '#64748B',
  },
  confirmRsvpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmRsvpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelRsvpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  cancelRsvpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  sectionHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  offerRideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  offerRideBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyCarpoolBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  emptyCarpoolTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 4,
  },
  emptyCarpoolSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
  firstOfferBtn: {
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  firstOfferBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  organizerSection: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  organizerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  organizerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  organizerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  organizerPhone: {
    fontSize: 13,
    color: '#64748B',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  callBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
});
