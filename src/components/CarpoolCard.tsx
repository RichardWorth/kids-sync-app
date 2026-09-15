import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Carpool, EventItem } from '../types';
import { useApp } from '../context/AppContext';
import {
  Car,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  Phone,
  UserCheck,
  UserMinus,
} from 'lucide-react-native';

interface CarpoolCardProps {
  carpool: Carpool;
  event?: EventItem;
}

export const CarpoolCard: React.FC<CarpoolCardProps> = ({ carpool, event }) => {
  const { children, parent, reserveCarpoolSeat, cancelCarpoolSeat } = useApp();

  // Find if any of our kids are already riding with this driver
  const myKidsInCar = carpool.passengers.filter((p) => p.parentId === parent.id);

  // Find our kids eligible for this event who aren't yet in this car
  const myEligibleKidsNotInCar = children.filter((k) => {
    const isEligible = event ? event.eligibleChildIds.includes(k.id) : true;
    const isAlreadyIn = carpool.passengers.some((p) => p.childId === k.id);
    return isEligible && !isAlreadyIn;
  });

  const handleClaimSeat = (childId: string, childName: string) => {
    reserveCarpoolSeat(carpool.id, childId, 'Pickup at agreed location');
    Alert.alert(
      'Seat Reserved! 🚗',
      `${childName} is now booked into ${carpool.driverName}'s car.`
    );
  };

  const handleCancelSeat = (childId: string, childName: string) => {
    Alert.alert(
      'Cancel Lift',
      `Are you sure you want to cancel ${childName}'s seat with ${carpool.driverName}?`,
      [
        { text: 'Keep Seat', style: 'cancel' },
        {
          text: 'Release Seat',
          style: 'destructive',
          onPress: () => cancelCarpoolSeat(carpool.id, childId),
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      {/* Header with Driver info */}
      <View style={styles.header}>
        <View style={styles.driverInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{carpool.driverName[0]}</Text>
          </View>
          <View>
            <Text style={styles.driverName}>{carpool.driverName}</Text>
            <Text style={styles.vehicleText}>{carpool.vehicle}</Text>
          </View>
        </View>

        {/* Seat Counter Badge */}
        <View
          style={[
            styles.seatBadge,
            carpool.availableSeats > 0 ? styles.seatBadgeOpen : styles.seatBadgeFull,
          ]}
        >
          <Car
            size={14}
            color={carpool.availableSeats > 0 ? '#15803D' : '#DC2626'}
          />
          <Text
            style={[
              styles.seatBadgeText,
              { color: carpool.availableSeats > 0 ? '#15803D' : '#DC2626' },
            ]}
          >
            {carpool.availableSeats > 0
              ? `${carpool.availableSeats} of ${carpool.totalSeats} seats open`
              : 'Fully Booked'}
          </Text>
        </View>
      </View>

      {/* Ride Logistics */}
      <View style={styles.logisticsBox}>
        <View style={styles.logisticsRow}>
          <Clock size={14} color="#475569" />
          <Text style={styles.logisticsText}>
            Departs: <Text style={styles.boldText}>{carpool.departureTime}</Text>
            {carpool.returnTrip ? ' (Includes return trip)' : ' (Drop-off only)'}
          </Text>
        </View>
        <View style={styles.logisticsRow}>
          <MapPin size={14} color="#475569" />
          <Text style={styles.logisticsText} numberOfLines={2}>
            Pickup: <Text style={styles.boldText}>{carpool.pickupLocation}</Text>
          </Text>
        </View>
        {carpool.notes && (
          <Text style={styles.notesText}>💬 "{carpool.notes}"</Text>
        )}
      </View>

      {/* Passengers Grid */}
      <View style={styles.passengersSection}>
        <Text style={styles.sectionTitle}>
          Passengers ({carpool.passengers.length}/{carpool.totalSeats}):
        </Text>
        <View style={styles.passengerList}>
          {carpool.passengers.map((p, idx) => {
            const isMyKid = p.parentId === parent.id;
            return (
              <View
                key={idx}
                style={[
                  styles.passengerChip,
                  isMyKid && styles.myPassengerChip,
                ]}
              >
                <View
                  style={[
                    styles.passengerDot,
                    { backgroundColor: isMyKid ? '#4F46E5' : '#10B981' },
                  ]}
                />
                <Text
                  style={[
                    styles.passengerName,
                    isMyKid && styles.myPassengerName,
                  ]}
                >
                  {p.childName} {isMyKid ? '(Your kid)' : `(${p.parentName.split(' ')[0]})`}
                </Text>
              </View>
            );
          })}

          {/* Empty Seats Placeholders */}
          {Array.from({ length: carpool.availableSeats }).map((_, idx) => (
            <View key={`empty-${idx}`} style={styles.emptySeatChip}>
              <Text style={styles.emptySeatText}>+ Spare Seat</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons for Parent */}
      <View style={styles.actionsFooter}>
        {/* Release Seat for already booked kid */}
        {myKidsInCar.map((p) => (
          <TouchableOpacity
            key={`cancel-${p.childId}`}
            style={styles.cancelSeatButton}
            onPress={() => handleCancelSeat(p.childId, p.childName)}
          >
            <UserMinus size={15} color="#DC2626" />
            <Text style={styles.cancelSeatText}>
              Release {p.childName.split(' ')[0]}’s Seat
            </Text>
          </TouchableOpacity>
        ))}

        {/* Claim Seat for eligible kid */}
        {carpool.availableSeats > 0 &&
          myEligibleKidsNotInCar.map((kid) => (
            <TouchableOpacity
              key={`claim-${kid.id}`}
              style={styles.claimSeatButton}
              onPress={() => handleClaimSeat(kid.id, kid.name)}
            >
              <UserCheck size={15} color="#FFFFFF" />
              <Text style={styles.claimSeatText}>
                Book Seat for {kid.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
  },
  driverName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  vehicleText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  seatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  seatBadgeOpen: {
    backgroundColor: '#F0FDF4',
  },
  seatBadgeFull: {
    backgroundColor: '#FEF2F2',
  },
  seatBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  logisticsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    marginBottom: 12,
  },
  logisticsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logisticsText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  notesText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#475569',
    marginTop: 4,
  },
  passengersSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  passengerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  passengerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  myPassengerChip: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    borderWidth: 1,
  },
  passengerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  passengerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  myPassengerName: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  emptySeatChip: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  emptySeatText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  actionsFooter: {
    gap: 8,
  },
  claimSeatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    borderRadius: 10,
  },
  claimSeatText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelSeatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    paddingVertical: 9,
    borderRadius: 10,
  },
  cancelSeatText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
});
