import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { EventItem } from '../types';
import { X, Car, Clock, MapPin, Check } from 'lucide-react-native';

interface OfferRideModalProps {
  visible: boolean;
  event: EventItem | null;
  onClose: () => void;
}

export const OfferRideModal: React.FC<OfferRideModalProps> = ({
  visible,
  event,
  onClose,
}) => {
  const { parent, offerCarpool } = useApp();

  const [vehicle, setVehicle] = useState('Ford Focus (2 booster seats)');
  const [totalSeats, setTotalSeats] = useState('3');
  const [departureTime, setDepartureTime] = useState(
    event ? `${event.startTime} (15m before)` : '08:45 AM'
  );
  const [pickupLocation, setPickupLocation] = useState(
    'West End High Street (outside Library)'
  );
  const [returnTrip, setReturnTrip] = useState(true);
  const [notes, setNotes] = useState('Happy to do drop-off and pickup.');

  if (!event) return null;

  const handleSubmit = () => {
    const seatsNum = parseInt(totalSeats, 10);
    if (isNaN(seatsNum) || seatsNum < 1) {
      Alert.alert('Invalid Seats', 'Please enter a valid number of seats (at least 1).');
      return;
    }

    if (!departureTime.trim() || !pickupLocation.trim()) {
      Alert.alert('Missing Details', 'Please specify departure time and pickup spot.');
      return;
    }

    offerCarpool({
      eventId: event.id,
      driverId: parent.id,
      driverName: `${parent.name} (You)`,
      driverPhone: parent.phone,
      vehicle,
      totalSeats: seatsNum,
      departureTime,
      pickupLocation,
      returnTrip,
      notes,
    });

    Alert.alert(
      'Lift Shared! 🚗🎉',
      `Your offer with ${seatsNum} seats has been posted for "${event.title}". Other parents in the circle can now book seats.`
    );
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Offer a Carpool Ride</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {event.title}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.scrollContent}>
            {/* Vehicle description */}
            <Text style={styles.label}>Your Car & Child Seats</Text>
            <TextInput
              style={styles.input}
              value={vehicle}
              onChangeText={setVehicle}
              placeholder="e.g. Black VW Golf (2 booster seats)"
              placeholderTextColor="#94A3B8"
            />

            {/* Total Seats Available */}
            <Text style={styles.label}>Spare Seats Available for Kids</Text>
            <View style={styles.seatSelector}>
              {[1, 2, 3, 4, 5].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.seatOption,
                    parseInt(totalSeats, 10) === num && styles.seatOptionActive,
                  ]}
                  onPress={() => setTotalSeats(num.toString())}
                >
                  <Text
                    style={[
                      styles.seatOptionText,
                      parseInt(totalSeats, 10) === num && styles.seatOptionTextActive,
                    ]}
                  >
                    {num} {num === 1 ? 'seat' : 'seats'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Departure Time */}
            <Text style={styles.label}>Departure Time</Text>
            <TextInput
              style={styles.input}
              value={departureTime}
              onChangeText={setDepartureTime}
              placeholder="e.g. 08:45 AM"
              placeholderTextColor="#94A3B8"
            />

            {/* Pickup Location */}
            <Text style={styles.label}>Pickup / Meeting Location</Text>
            <TextInput
              style={styles.input}
              value={pickupLocation}
              onChangeText={setPickupLocation}
              placeholder="e.g. Outside Community Hall or School Gates"
              placeholderTextColor="#94A3B8"
            />

            {/* Round trip toggle */}
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>Include Return Trip?</Text>
                <Text style={styles.toggleSubtitle}>
                  Driving children back home after the event ends
                </Text>
              </View>
              <Switch
                value={returnTrip}
                onValueChange={setReturnTrip}
                trackColor={{ false: '#CBD5E1', true: '#818CF8' }}
                thumbColor={returnTrip ? '#4F46E5' : '#F8FAFC'}
              />
            </View>

            {/* Notes */}
            <Text style={styles.label}>Notes for Parents (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. Happy to bring snacks, boot space available for kit."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Car size={18} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Post Ride to Group</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    maxWidth: 260,
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
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: {
    height: 75,
    textAlignVertical: 'top',
  },
  seatSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  seatOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  seatOptionActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  seatOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  seatOptionTextActive: {
    color: '#FFFFFF',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  toggleSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
