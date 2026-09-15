import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { EventItem, Booking } from '../types';
import {
  SketchCard,
  SketchCheck,
  SketchClock,
  SketchPin,
  SketchStar,
} from '../components/SketchIcons';
import { X } from 'lucide-react-native';
import { MonotoneTheme } from '../constants/theme';

export const MyEventsPayScreen: React.FC = () => {
  const { events, bookings, payForBooking, parent } = useApp();

  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const myConfirmedBookings = bookings.filter((b) => b.parentId === parent.id);
  const unpaidBookings = myConfirmedBookings.filter((b) => b.paymentStatus === 'unpaid');
  const totalUnpaidAmount = unpaidBookings.reduce((sum, b) => sum + b.amountDue, 0);

  const handleOpenPay = (booking: Booking, event: EventItem) => {
    setSelectedBooking(booking);
    setSelectedEvent(event);
    setCheckoutModalVisible(true);
  };

  const handleExecutePayment = (method: string) => {
    if (!selectedBooking) return;
    setProcessingPayment(true);

    setTimeout(() => {
      payForBooking(selectedBooking.id, method);
      setProcessingPayment(false);
      setCheckoutModalVisible(false);
      Alert.alert(
        'Payment Complete',
        `Paid £${selectedBooking.amountDue.toFixed(2)} via ${method}.`
      );
    }, 600);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <SketchCard size={22} color={MonotoneTheme.colors.ink} />
          <View>
            <Text style={styles.appTitle}>MY EVENTS & SUBS</Text>
            <Text style={styles.subtitle}>
              Committed activities, kit notes, and subs payment
            </Text>
          </View>
        </View>
      </View>

      {/* Outstanding Balance Banner */}
      {totalUnpaidAmount > 0 ? (
        <View style={styles.unpaidBox}>
          <View style={{ flex: 1 }}>
            <Text style={styles.unpaidTitle}>
              Outstanding Subs: £{totalUnpaidAmount.toFixed(2)}
            </Text>
            <Text style={styles.unpaidSubtitle}>
              {unpaidBookings.length} fixture sub due
            </Text>
          </View>

          <TouchableOpacity
            style={styles.payNowBtn}
            onPress={() => {
              if (unpaidBookings[0]) {
                const ev = events.find((e) => e.id === unpaidBookings[0].eventId);
                if (ev) handleOpenPay(unpaidBookings[0], ev);
              }
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.payNowBtnText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.paidBox}>
          <SketchCheck size={16} color={MonotoneTheme.colors.ink80} />
          <Text style={styles.paidBoxText}>
            All club subs & event fees are settled.
          </Text>
        </View>
      )}

      {/* Your Booked Events List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Your Booked Activities ({myConfirmedBookings.length})
        </Text>

        {myConfirmedBookings.map((booking) => {
          const event = events.find((e) => e.id === booking.eventId);
          if (!event) return null;

          return (
            <View key={booking.id} style={styles.eventCard}>
              {/* Event Header */}
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.circleTag}>{event.circleName.toUpperCase()}</Text>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                </View>

                {/* Status Badges */}
                {booking.paymentStatus === 'paid' && (
                  <View style={styles.statusPaidBadge}>
                    <SketchCheck size={12} color={MonotoneTheme.colors.ink80} />
                    <Text style={styles.statusPaidText}>Paid</Text>
                  </View>
                )}

                {booking.paymentStatus === 'unpaid' && (
                  <View style={styles.statusDueBadge}>
                    <Text style={styles.statusDueText}>
                      Due £{booking.amountDue.toFixed(2)}
                    </Text>
                  </View>
                )}

                {booking.paymentStatus === 'free' && (
                  <View style={styles.statusFreeBadge}>
                    <Text style={styles.statusFreeText}>Free</Text>
                  </View>
                )}
              </View>

              {/* Event Specifics: Timings & Location */}
              <View style={styles.specificsBox}>
                <View style={styles.metaRow}>
                  <SketchClock size={13} color={MonotoneTheme.colors.ink60} />
                  <Text style={styles.metaText}>
                    {event.date} • {event.startTime} - {event.endTime}
                  </Text>
                </View>

                <View style={styles.metaRow}>
                  <SketchPin size={13} color={MonotoneTheme.colors.ink60} />
                  <Text style={styles.metaText}>{event.location}</Text>
                </View>

                {/* Kit & Gear Instructions */}
                {event.kitNotes && (
                  <View style={styles.kitNoteBox}>
                    <Text style={styles.kitNoteText}>
                      <Text style={styles.boldText}>Kit / Instructions: </Text>
                      {event.kitNotes}
                    </Text>
                  </View>
                )}
              </View>

              {/* Attendee Child Tag */}
              <Text style={styles.attendingChildText}>
                Participant: <Text style={styles.boldText}>{booking.childName}</Text>
              </Text>

              {/* Cost & Payment Row */}
              <View style={styles.costRow}>
                <View>
                  <Text style={styles.costLabel}>Subs / Fee</Text>
                  <Text style={styles.costAmount}>{event.costLabel}</Text>
                  {booking.paymentStatus === 'paid' && booking.transactionRef && (
                    <Text style={styles.receiptRef}>
                      Receipt: {booking.transactionRef} • {booking.paymentMethod}
                    </Text>
                  )}
                </View>

                {booking.paymentStatus === 'unpaid' && (
                  <TouchableOpacity
                    style={styles.payBtn}
                    onPress={() => handleOpenPay(booking, event)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.payBtnText}>
                      Pay £{booking.amountDue.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                )}

                {booking.paymentStatus === 'paid' && (
                  <View style={styles.settledBadge}>
                    <Text style={styles.settledBadgeText}>Settled</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Monochrome Checkout Modal */}
      <Modal visible={checkoutModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>PAYMENT CHECKOUT</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setCheckoutModalVisible(false)}
              >
                <X size={18} color={MonotoneTheme.colors.ink80} />
              </TouchableOpacity>
            </View>

            {selectedBooking && selectedEvent && (
              <View style={styles.modalBody}>
                {/* Order Summary */}
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryCircle}>{selectedEvent.circleName.toUpperCase()}</Text>
                  <Text style={styles.summaryTitle}>{selectedEvent.title}</Text>
                  <Text style={styles.summaryChild}>
                    Child: {selectedBooking.childName}
                  </Text>
                </View>

                {/* Amount */}
                <View style={styles.amountBox}>
                  <Text style={styles.amountLabel}>Total Amount Due</Text>
                  <Text style={styles.amountValue}>
                    £{selectedBooking.amountDue.toFixed(2)}
                  </Text>
                </View>

                {/* Payment Methods */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.applePayBtn}
                    onPress={() => handleExecutePayment('Apple Pay')}
                    disabled={processingPayment}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.applePayBtnText}>
                      {processingPayment ? 'Processing...' : ' Pay with Apple Pay'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cardPayBtn}
                    onPress={() => handleExecutePayment('Debit / Credit Card')}
                    disabled={processingPayment}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.cardPayBtnText}>
                      {processingPayment ? 'Processing...' : 'Pay with Debit / Credit Card'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MonotoneTheme.colors.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: MonotoneTheme.colors.ink,
  },
  subtitle: {
    fontSize: 12,
    color: MonotoneTheme.colors.ink60,
    marginTop: 1,
  },
  unpaidBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MonotoneTheme.colors.surface,
    borderWidth: 1.5,
    borderColor: MonotoneTheme.colors.ink,
    padding: 14,
    borderRadius: MonotoneTheme.radius.md,
    gap: 12,
  },
  unpaidTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: MonotoneTheme.colors.ink,
  },
  unpaidSubtitle: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink60,
    marginTop: 2,
  },
  payNowBtn: {
    backgroundColor: MonotoneTheme.colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: MonotoneTheme.radius.sm,
  },
  payNowBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  paidBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: MonotoneTheme.colors.surface,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    padding: 12,
    borderRadius: MonotoneTheme.radius.md,
  },
  paidBoxText: {
    fontSize: 12,
    fontWeight: '600',
    color: MonotoneTheme.colors.ink80,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink60,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  eventCard: {
    backgroundColor: MonotoneTheme.colors.surface,
    borderRadius: MonotoneTheme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  circleTag: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: MonotoneTheme.colors.ink60,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
    marginTop: 2,
  },
  statusPaidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: MonotoneTheme.colors.ink05,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: MonotoneTheme.radius.full,
  },
  statusPaidText: {
    fontSize: 10,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  statusDueBadge: {
    backgroundColor: MonotoneTheme.colors.ink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: MonotoneTheme.radius.full,
  },
  statusDueText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusFreeBadge: {
    backgroundColor: MonotoneTheme.colors.ink05,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: MonotoneTheme.radius.full,
  },
  statusFreeText: {
    fontSize: 10,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink60,
  },
  specificsBox: {
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    borderRadius: MonotoneTheme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: MonotoneTheme.colors.ink60,
  },
  boldText: {
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  kitNoteBox: {
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: MonotoneTheme.colors.border,
  },
  kitNoteText: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink80,
    lineHeight: 16,
  },
  attendingChildText: {
    fontSize: 12,
    color: MonotoneTheme.colors.ink60,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: MonotoneTheme.colors.border,
  },
  costLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: MonotoneTheme.colors.ink40,
    textTransform: 'uppercase',
  },
  costAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
    marginTop: 1,
  },
  receiptRef: {
    fontSize: 10,
    color: MonotoneTheme.colors.ink60,
    marginTop: 2,
  },
  payBtn: {
    backgroundColor: MonotoneTheme.colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: MonotoneTheme.radius.sm,
  },
  payBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settledBadge: {
    backgroundColor: MonotoneTheme.colors.ink05,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: MonotoneTheme.radius.sm,
  },
  settledBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: MonotoneTheme.colors.ink60,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalSheet: {
    backgroundColor: MonotoneTheme.colors.surface,
    borderRadius: MonotoneTheme.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: MonotoneTheme.colors.ink,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBody: {
    gap: 14,
  },
  summaryCard: {
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    borderRadius: MonotoneTheme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    gap: 3,
  },
  summaryCircle: {
    fontSize: 10,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink60,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  summaryChild: {
    fontSize: 12,
    color: MonotoneTheme.colors.ink60,
  },
  amountBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: MonotoneTheme.colors.border,
  },
  amountLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: MonotoneTheme.colors.ink80,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '800',
    color: MonotoneTheme.colors.ink,
  },
  modalActions: {
    gap: 8,
    marginTop: 6,
  },
  applePayBtn: {
    backgroundColor: MonotoneTheme.colors.ink,
    paddingVertical: 12,
    borderRadius: MonotoneTheme.radius.sm,
    alignItems: 'center',
  },
  applePayBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardPayBtn: {
    backgroundColor: MonotoneTheme.colors.surface,
    borderWidth: 1.5,
    borderColor: MonotoneTheme.colors.ink,
    paddingVertical: 11,
    borderRadius: MonotoneTheme.radius.sm,
    alignItems: 'center',
  },
  cardPayBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
});
