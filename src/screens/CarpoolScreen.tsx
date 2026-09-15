import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { CarpoolCard } from '../components/CarpoolCard';
import { OfferRideModal } from '../components/OfferRideModal';
import { EventItem } from '../types';
import {
  Car,
  Plus,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react-native';

export const CarpoolScreen: React.FC = () => {
  const { carpools, events, parent } = useApp();
  const [filterMode, setFilterMode] = useState<'all' | 'myRides'>('all');
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [selectedEventForOffer, setSelectedEventForOffer] = useState<EventItem | null>(
    events[0] || null
  );

  // Filtered carpools
  const displayedCarpools = carpools.filter((cp) => {
    if (filterMode === 'myRides') {
      const isDriver = cp.driverId === parent.id;
      const hasMyChild = cp.passengers.some((p) => p.parentId === parent.id);
      return isDriver || hasMyChild;
    }
    return true;
  });

  const totalAvailableSeats = carpools.reduce((sum, cp) => sum + cp.availableSeats, 0);
  const myReservedSeatsCount = carpools.reduce(
    (sum, cp) => sum + cp.passengers.filter((p) => p.parentId === parent.id).length,
    0
  );

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Lift Share & Carpooling</Text>
          <Text style={styles.subtitle}>
            Share school runs, fixtures & party rides
          </Text>
        </View>
        <TouchableOpacity
          style={styles.offerBtn}
          onPress={() => {
            setSelectedEventForOffer(events[0] || null);
            setOfferModalVisible(true);
          }}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.offerBtnText}>Offer Ride</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Summary Banner */}
      <View style={styles.statsBanner}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalAvailableSeats}</Text>
          <Text style={styles.statLabel}>Seats Open</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#4F46E5' }]}>
            {myReservedSeatsCount}
          </Text>
          <Text style={styles.statLabel}>Kids Booked</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#10B981' }]}>
            {carpools.length}
          </Text>
          <Text style={styles.statLabel}>Active Cars</Text>
        </View>
      </View>

      {/* Safety & Trust Notice */}
      <View style={styles.trustBanner}>
        <ShieldCheck size={16} color="#15803D" />
        <Text style={styles.trustText}>
          Private to verified club parents & phone contacts only.
        </Text>
      </View>

      {/* Segmented Filter */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[
            styles.segmentBtn,
            filterMode === 'all' && styles.segmentBtnActive,
          ]}
          onPress={() => setFilterMode('all')}
        >
          <Text
            style={[
              styles.segmentText,
              filterMode === 'all' && styles.segmentTextActive,
            ]}
          >
            All Circle Lifts ({carpools.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentBtn,
            filterMode === 'myRides' && styles.segmentBtnActive,
          ]}
          onPress={() => setFilterMode('myRides')}
        >
          <Text
            style={[
              styles.segmentText,
              filterMode === 'myRides' && styles.segmentTextActive,
            ]}
          >
            My Family Lifts ({myReservedSeatsCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Carpool List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {displayedCarpools.length > 0 ? (
          displayedCarpools.map((cp) => {
            const matchedEvent = events.find((e) => e.id === cp.eventId);
            return (
              <View key={cp.id} style={styles.carpoolWrapper}>
                {matchedEvent && (
                  <View style={styles.eventAnchor}>
                    <Text style={styles.eventAnchorCircle}>
                      {matchedEvent.circleName}
                    </Text>
                    <Text style={styles.eventAnchorTitle} numberOfLines={1}>
                      📍 Heading to: {matchedEvent.title}
                    </Text>
                  </View>
                )}
                <CarpoolCard carpool={cp} event={matchedEvent} />
              </View>
            );
          })
        ) : (
          <View style={styles.emptyBox}>
            <Car size={40} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No lifts currently in this view</Text>
            <Text style={styles.emptySub}>
              Tap "Offer Ride" above to share spare seats in your car with parents
              attending this weekend's events.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Offer Ride Modal */}
      <OfferRideModal
        visible={offerModalVisible}
        event={selectedEventForOffer}
        onClose={() => setOfferModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  offerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  offerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  trustText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
    flex: 1,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 4,
    borderRadius: 10,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 14,
    paddingBottom: 40,
  },
  carpoolWrapper: {
    marginBottom: 4,
  },
  eventAnchor: {
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  eventAnchorCircle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
    textTransform: 'uppercase',
  },
  eventAnchorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 1,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
});
