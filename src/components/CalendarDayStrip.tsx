import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MonotoneTheme } from '../constants/theme';

interface CalendarDayStripProps {
  selectedDate: string; // YYYY-MM-DD or 'all'
  onSelectDate: (date: string) => void;
  eventDates: string[];
}

export const CalendarDayStrip: React.FC<CalendarDayStripProps> = ({
  selectedDate,
  onSelectDate,
  eventDates,
}) => {
  const days = React.useMemo(() => {
    const list = [];
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      list.push({
        iso,
        dayName: i === 0 ? 'Today' : dayNames[d.getDay()],
        dayNumber: d.getDate(),
        month: monthNames[d.getMonth()],
        hasEvents: eventDates.includes(iso),
        isToday: i === 0,
      });
    }
    return list;
  }, [eventDates]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* All Dates Pill */}
        <TouchableOpacity
          style={[
            styles.dayPill,
            styles.allDaysPill,
            selectedDate === 'all' && styles.dayPillActive,
          ]}
          onPress={() => onSelectDate('all')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.allDaysText,
              selectedDate === 'all' && styles.textActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {/* Rolling Days */}
        {days.map((item) => {
          const isSelected = selectedDate === item.iso;
          return (
            <TouchableOpacity
              key={item.iso}
              style={[
                styles.dayPill,
                isSelected && styles.dayPillActive,
                item.isToday && !isSelected && styles.todayPill,
              ]}
              onPress={() => onSelectDate(item.iso)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.dayNameText,
                  isSelected && styles.textActive,
                  item.isToday && !isSelected && styles.todayNameText,
                ]}
              >
                {item.dayName}
              </Text>
              <Text
                style={[
                  styles.dayNumberText,
                  isSelected && styles.textActive,
                ]}
              >
                {item.dayNumber}
              </Text>

              {/* Event Indicator Dot */}
              <View style={styles.dotContainer}>
                {item.hasEvents && (
                  <View
                    style={[
                      styles.dot,
                      isSelected ? styles.dotActive : styles.dotInactive,
                    ]}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: MonotoneTheme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: MonotoneTheme.colors.border,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  dayPill: {
    width: 48,
    height: 62,
    borderRadius: MonotoneTheme.radius.md,
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  allDaysPill: {
    width: 54,
  },
  allDaysText: {
    fontSize: 12,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink60,
  },
  todayPill: {
    borderColor: MonotoneTheme.colors.ink40,
  },
  dayPillActive: {
    backgroundColor: MonotoneTheme.colors.ink,
    borderColor: MonotoneTheme.colors.ink,
  },
  dayNameText: {
    fontSize: 10,
    fontWeight: '600',
    color: MonotoneTheme.colors.ink40,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  todayNameText: {
    color: MonotoneTheme.colors.ink,
    fontWeight: '700',
  },
  dayNumberText: {
    fontSize: 16,
    fontWeight: '800',
    color: MonotoneTheme.colors.ink,
  },
  textActive: {
    color: '#FFFFFF',
  },
  dotContainer: {
    height: 6,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dotInactive: {
    backgroundColor: MonotoneTheme.colors.ink60,
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
  },
});
