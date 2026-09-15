import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { EventItem } from '../types';
import { useApp } from '../context/AppContext';
import {
  SketchClock,
  SketchPin,
  SketchCar,
  SketchUsers,
  SketchCheck,
  SketchStar,
} from './SketchIcons';
import { ChevronRight, Plus } from 'lucide-react-native';
import { MonotoneTheme } from '../constants/theme';

interface EventCardProps {
  event: EventItem;
  onPress: () => void;
  onOpenCarpool: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onOpenCarpool,
}) => {
  const { children, bookings, carpools, bookChild } = useApp();

  const eventCarpools = carpools.filter((cp) => cp.eventId === event.id);
  const totalAvailableSeats = eventCarpools.reduce(
    (sum, cp) => sum + cp.availableSeats,
    0
  );

  const eligibleChildren = children.filter((c) =>
    event.eligibleChildIds.includes(c.id)
  );

  const bookedChildIds = bookings
    .filter((b) => b.eventId === event.id && b.status === 'confirmed')
    .map((b) => b.childId);

  // Date parsing
  const [year, month, day] = event.date.split('-');
  const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthLabel = monthNames[dateObj.getMonth()];
  const dayNameLabel = dayNames[dateObj.getDay()];
  const dayNumber = dateObj.getDate();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Top Header: Circle & Category Tag */}
      <View style={styles.topHeader}>
        <Text style={styles.circleText}>{event.circleName.toUpperCase()}</Text>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
      </View>

      {/* Main Title & Date Ribbon */}
      <View style={styles.headlineRow}>
        <View style={styles.dateBlock}>
          <Text style={styles.dateDayName}>{dayNameLabel}</Text>
          <Text style={styles.dateDayNumber}>{dayNumber}</Text>
          <Text style={styles.dateMonth}>{monthLabel}</Text>
        </View>

        <View style={styles.headlineInfo}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {event.title}
          </Text>

          <View style={styles.metaRow}>
            <SketchClock size={14} color={MonotoneTheme.colors.ink60} />
            <Text style={styles.metaText}>
              {event.startTime} - {event.endTime}
            </Text>
            {event.cost > 0 ? (
              <View style={styles.costBadge}>
                <Text style={styles.costText}>{event.costLabel}</Text>
              </View>
            ) : (
              <View style={styles.costBadgeFree}>
                <Text style={styles.costTextFree}>Free</Text>
              </View>
            )}
          </View>

          <View style={styles.metaRow}>
            <SketchPin size={14} color={MonotoneTheme.colors.ink60} />
            <Text style={styles.metaText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        </View>
      </View>

      {/* SECTION 1: WHO'S GOING */}
      <View style={styles.whosGoingSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <SketchUsers size={15} color={MonotoneTheme.colors.ink80} />
            <Text style={styles.sectionTitle}>
              Who's Going ({event.attendees.length})
            </Text>
          </View>

          {eligibleChildren.map((kid) => {
            const isBooked = bookedChildIds.includes(kid.id);
            return isBooked ? (
              <View key={kid.id} style={styles.attendingBadge}>
                <SketchCheck size={11} color={MonotoneTheme.colors.ink80} />
                <Text style={styles.attendingText}>
                  {kid.name.split(' ')[0]} going
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                key={kid.id}
                style={styles.quickRsvpBtn}
                onPress={() => bookChild(event.id, kid.id)}
              >
                <Plus size={11} color="#FFFFFF" />
                <Text style={styles.quickRsvpText}>
                  RSVP {kid.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Minimalist Attendee Initial Badges */}
        <View style={styles.attendeesList}>
          {event.attendees.slice(0, 5).map((att) => (
            <View key={att.id} style={styles.attendeePill}>
              <View
                style={[
                  styles.attendeeInitialCircle,
                  att.isMyChild && styles.myKidCircle,
                ]}
              >
                <Text
                  style={[
                    styles.attendeeInitialText,
                    att.isMyChild && styles.myKidInitialText,
                  ]}
                >
                  {att.childName[0]}
                </Text>
              </View>
              <Text style={styles.attendeeName} numberOfLines={1}>
                {att.isMyChild ? '★ ' + att.childName.split(' ')[0] : att.childName.split(' ')[0]}
              </Text>
            </View>
          ))}
          {event.attendees.length > 5 && (
            <View style={styles.moreBubble}>
              <Text style={styles.moreBubbleText}>
                +{event.attendees.length - 5}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* SECTION 2: ARE THERE ANY SEATS LEFT? */}
      <TouchableOpacity
        style={styles.carpoolSection}
        onPress={onOpenCarpool}
        activeOpacity={0.7}
      >
        <View style={styles.carpoolHeader}>
          <View style={styles.carpoolTitleRow}>
            <SketchCar size={16} color={MonotoneTheme.colors.ink80} />
            <Text style={styles.carpoolLabel}>Car Seats Left:</Text>
            <Text style={styles.carpoolSeatsCount}>
              {totalAvailableSeats > 0
                ? `${totalAvailableSeats} open`
                : eventCarpools.length > 0
                ? 'Full'
                : 'None yet'}
            </Text>
          </View>
          <ChevronRight size={14} color={MonotoneTheme.colors.ink40} />
        </View>

        <Text style={styles.carpoolSnippet} numberOfLines={1}>
          {eventCarpools.length > 0
            ? `${eventCarpools[0].driverName} • ${eventCarpools[0].vehicle} (${eventCarpools[0].departureTime})`
            : 'Got spare seats in your car? Tap to offer a ride.'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: MonotoneTheme.colors.surface,
    borderRadius: MonotoneTheme.radius.lg,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  circleText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: MonotoneTheme.colors.ink60,
  },
  categoryPill: {
    backgroundColor: MonotoneTheme.colors.ink05,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: MonotoneTheme.radius.full,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink80,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headlineRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  dateBlock: {
    width: 48,
    height: 60,
    borderRadius: MonotoneTheme.radius.md,
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  dateDayName: {
    fontSize: 10,
    fontWeight: '600',
    color: MonotoneTheme.colors.ink40,
    textTransform: 'uppercase',
  },
  dateDayNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: MonotoneTheme.colors.ink,
    lineHeight: 22,
  },
  dateMonth: {
    fontSize: 9,
    fontWeight: '600',
    color: MonotoneTheme.colors.ink60,
  },
  headlineInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
    lineHeight: 20,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: MonotoneTheme.colors.ink60,
    fontWeight: '500',
    flex: 1,
  },
  costBadge: {
    backgroundColor: MonotoneTheme.colors.ink05,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  costText: {
    fontSize: 10,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink80,
  },
  costBadgeFree: {
    backgroundColor: MonotoneTheme.colors.ink10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  costTextFree: {
    fontSize: 10,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  whosGoingSection: {
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    borderRadius: MonotoneTheme.radius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink80,
  },
  attendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: MonotoneTheme.colors.ink10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: MonotoneTheme.radius.full,
  },
  attendingText: {
    fontSize: 10,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  quickRsvpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: MonotoneTheme.colors.ink,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: MonotoneTheme.radius.full,
  },
  quickRsvpText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  attendeesList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attendeePill: {
    alignItems: 'center',
    width: 44,
  },
  attendeeInitialCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: MonotoneTheme.colors.surface,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.borderMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  myKidCircle: {
    backgroundColor: MonotoneTheme.colors.ink,
    borderColor: MonotoneTheme.colors.ink,
  },
  attendeeInitialText: {
    fontSize: 11,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink80,
  },
  myKidInitialText: {
    color: '#FFFFFF',
  },
  attendeeName: {
    fontSize: 9,
    fontWeight: '600',
    color: MonotoneTheme.colors.ink60,
    textAlign: 'center',
  },
  moreBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: MonotoneTheme.colors.ink05,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreBubbleText: {
    fontSize: 10,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink60,
  },
  carpoolSection: {
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    borderRadius: MonotoneTheme.radius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
  },
  carpoolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carpoolTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  carpoolLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MonotoneTheme.colors.ink60,
  },
  carpoolSeatsCount: {
    fontSize: 12,
    fontWeight: '800',
    color: MonotoneTheme.colors.ink,
  },
  carpoolSnippet: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink60,
    marginTop: 3,
  },
});
