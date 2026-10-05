import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { ChildFilterBar } from '../components/ChildFilterBar';
import { CalendarDayStrip } from '../components/CalendarDayStrip';
import { EventCard } from '../components/EventCard';
import { EventDetailModal } from '../components/EventDetailModal';
import { EventItem } from '../types';
import { Search, X } from 'lucide-react-native';
import { SketchCalendar, SketchStar } from '../components/SketchIcons';
import { MonotoneTheme } from '../constants/theme';

export const CalendarScreen: React.FC = () => {
  const {
    events,
    circles,
    selectedChildFilter,
    selectedCircleFilter,
    setSelectedCircleFilter,
    parent,
    syncWithGoogleSheet,
    isSyncingSheet,
    sheetSyncStatus,
  } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [copiedCodeNotice, setCopiedCodeNotice] = useState<string | null>(null);

  const activeCircle = circles.find((c) => c.id === selectedCircleFilter);

  const eventDates = useMemo(() => {
    return Array.from(new Set(events.map((e) => e.date)));
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (selectedChildFilter !== 'all') {
        if (!ev.eligibleChildIds.includes(selectedChildFilter)) {
          return false;
        }
      }

      if (selectedCircleFilter !== 'all' && activeCircle) {
        const matchesCircle =
          ev.circleId === selectedCircleFilter ||
          ev.circleName.toLowerCase().includes(activeCircle.name.toLowerCase()) ||
          ev.description.toLowerCase().includes(activeCircle.name.toLowerCase());
        if (!matchesCircle) {
          return false;
        }
      }

      if (selectedDate !== 'all') {
        if (ev.date !== selectedDate) {
          return false;
        }
      }

      if (selectedCategory !== 'all') {
        if (ev.category !== selectedCategory) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ev.title.toLowerCase().includes(q) ||
          ev.circleName.toLowerCase().includes(q) ||
          ev.location.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [events, selectedChildFilter, selectedCircleFilter, activeCircle, selectedDate, selectedCategory, searchQuery]);

  const handleOpenDetail = (event: EventItem) => {
    setSelectedEvent(event);
    setDetailModalVisible(true);
  };

  const handleSyncSheet = async () => {
    await syncWithGoogleSheet();
  };

  const handleCopyInvite = (circle: typeof circles[0]) => {
    const inviteText = `Hey! Join our ${circle.name} group on KidSync with code: ${circle.code}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(inviteText);
    }
    setCopiedCodeNotice(`Copied invite message for ${circle.name}!`);
    setTimeout(() => setCopiedCodeNotice(null), 3000);
  };

  return (
    <View style={styles.container}>
      {/* Sketched Monotone Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <SketchCalendar size={22} color={MonotoneTheme.colors.ink} />
          <View>
            <Text style={styles.appTitle}>EVENTS & ACTIVITIES</Text>
            <Text style={styles.subtitle}>
              {events.length} from Google Sheet • {parent.name}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            style={styles.sheetSyncBtn}
            onPress={handleSyncSheet}
            disabled={isSyncingSheet}
            activeOpacity={0.7}
          >
            <Text style={styles.sheetSyncBtnText}>
              {isSyncingSheet ? 'Syncing...' : '↻ Google Drive'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconBtn, showSearch && styles.iconBtnActive]}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Search size={16} color={MonotoneTheme.colors.ink80} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Expandable Minimalist Search */}
      {showSearch && (
        <View style={styles.searchWrapper}>
          <View style={styles.searchBox}>
            <Search size={14} color={MonotoneTheme.colors.ink40} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search fixtures, parties, locations..."
              placeholderTextColor={MonotoneTheme.colors.ink40}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={14} color={MonotoneTheme.colors.ink40} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Circle / Class Filter Ribbon */}
      <View style={styles.circleRibbonContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.circleRibbonScroll}
        >
          <TouchableOpacity
            style={[
              styles.circleRibbonChip,
              selectedCircleFilter === 'all' && styles.circleRibbonChipActive,
            ]}
            onPress={() => setSelectedCircleFilter('all')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.circleRibbonText,
                selectedCircleFilter === 'all' && styles.circleRibbonTextActive,
              ]}
            >
              All Groups
            </Text>
          </TouchableOpacity>

          {circles.map((c) => {
            const isSelected = selectedCircleFilter === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.circleRibbonChip,
                  isSelected && styles.circleRibbonChipActive,
                ]}
                onPress={() => setSelectedCircleFilter(isSelected ? 'all' : c.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.circleRibbonText,
                    isSelected && styles.circleRibbonTextActive,
                  ]}
                >
                  {c.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Active Circle Info Banner */}
      {activeCircle && (
        <View style={styles.activeCircleBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.activeCircleTitle}>{activeCircle.name}</Text>
            <Text style={styles.activeCircleSubtitle}>
              🔑 Code: {activeCircle.code} • {activeCircle.memberCount} Parents • {activeCircle.category}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.shareCodeBtn}
            onPress={() => handleCopyInvite(activeCircle)}
            activeOpacity={0.7}
          >
            <Text style={styles.shareCodeBtnText}>Share Code</Text>
          </TouchableOpacity>
        </View>
      )}

      {copiedCodeNotice && (
        <View style={styles.toastNotice}>
          <Text style={styles.toastText}>{copiedCodeNotice}</Text>
        </View>
      )}

      {/* Child Filter */}
      <ChildFilterBar />

      {/* Day Strip */}
      <CalendarDayStrip
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        eventDates={eventDates}
      />

      {/* Subtle Category Filter Pills */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {[
            { id: 'all', label: 'All' },
            { id: 'match', label: 'Fixtures' },
            { id: 'party', label: 'Parties' },
            { id: 'club', label: 'Clubs' },
            { id: 'training', label: 'Training' },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Events Feed */}
      <ScrollView
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => handleOpenDetail(event)}
              onOpenCarpool={() => handleOpenDetail(event)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <SketchCalendar size={40} color={MonotoneTheme.colors.ink40} />
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptySubtitle}>
              Try selecting "All" dates or resetting your search filter.
            </Text>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setSelectedDate('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            >
              <Text style={styles.resetBtnText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Event Details Sheet */}
      <EventDetailModal
        visible={detailModalVisible}
        event={selectedEvent}
        onClose={() => setDetailModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MonotoneTheme.colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: MonotoneTheme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: MonotoneTheme.colors.border,
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
  sheetSyncBtn: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: MonotoneTheme.radius.full,
    backgroundColor: MonotoneTheme.colors.ink05,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
  },
  sheetSyncBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: MonotoneTheme.radius.full,
    backgroundColor: MonotoneTheme.colors.ink05,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
  },
  iconBtnActive: {
    backgroundColor: MonotoneTheme.colors.ink10,
    borderColor: MonotoneTheme.colors.ink,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: MonotoneTheme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: MonotoneTheme.colors.border,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: MonotoneTheme.colors.ink05,
    borderRadius: MonotoneTheme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: MonotoneTheme.colors.ink,
    padding: 0,
  },
  categoryContainer: {
    backgroundColor: MonotoneTheme.colors.surface,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: MonotoneTheme.colors.border,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 6,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: MonotoneTheme.radius.full,
    backgroundColor: MonotoneTheme.colors.ink05,
  },
  categoryChipActive: {
    backgroundColor: MonotoneTheme.colors.ink,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: MonotoneTheme.colors.ink60,
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  circleRibbonContainer: {
    backgroundColor: MonotoneTheme.colors.surface,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: MonotoneTheme.colors.border,
  },
  circleRibbonScroll: {
    paddingHorizontal: 16,
    gap: 6,
  },
  circleRibbonChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: MonotoneTheme.radius.full,
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
  },
  circleRibbonChipActive: {
    backgroundColor: MonotoneTheme.colors.ink,
    borderColor: MonotoneTheme.colors.ink,
  },
  circleRibbonText: {
    fontSize: 11,
    fontWeight: '600',
    color: MonotoneTheme.colors.ink80,
  },
  circleRibbonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activeCircleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: MonotoneTheme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: MonotoneTheme.colors.border,
    gap: 10,
  },
  activeCircleTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: MonotoneTheme.colors.ink,
  },
  activeCircleSubtitle: {
    fontSize: 10,
    color: MonotoneTheme.colors.ink60,
    marginTop: 1,
  },
  shareCodeBtn: {
    backgroundColor: MonotoneTheme.colors.ink05,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.borderMedium,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: MonotoneTheme.radius.sm,
  },
  shareCodeBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  toastNotice: {
    backgroundColor: MonotoneTheme.colors.ink,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    paddingVertical: 14,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink80,
  },
  emptySubtitle: {
    fontSize: 13,
    color: MonotoneTheme.colors.ink40,
    textAlign: 'center',
  },
  resetBtn: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: MonotoneTheme.radius.sm,
    backgroundColor: MonotoneTheme.colors.ink10,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
});
