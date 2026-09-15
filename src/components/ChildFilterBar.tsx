import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import { SketchUsers } from './SketchIcons';
import { MonotoneTheme } from '../constants/theme';

export const ChildFilterBar: React.FC = () => {
  const { children, selectedChildFilter, setSelectedChildFilter, events } = useApp();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* All Family */}
        <TouchableOpacity
          style={[
            styles.chip,
            selectedChildFilter === 'all' && styles.chipActive,
          ]}
          onPress={() => setSelectedChildFilter('all')}
          activeOpacity={0.8}
        >
          <SketchUsers
            size={16}
            color={
              selectedChildFilter === 'all'
                ? '#FFFFFF'
                : MonotoneTheme.colors.ink80
            }
          />
          <Text
            style={[
              styles.nameText,
              selectedChildFilter === 'all' && styles.nameTextActive,
            ]}
          >
            All Family
          </Text>
          <View
            style={[
              styles.countPill,
              selectedChildFilter === 'all' && styles.countPillActive,
            ]}
          >
            <Text
              style={[
                styles.countText,
                selectedChildFilter === 'all' && styles.countTextActive,
              ]}
            >
              {events.length}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Individual Kids */}
        {children.map((child) => {
          const isSelected = selectedChildFilter === child.id;
          const childEventsCount = events.filter((e) =>
            e.eligibleChildIds.includes(child.id)
          ).length;

          return (
            <TouchableOpacity
              key={child.id}
              style={[
                styles.chip,
                isSelected && styles.chipActive,
              ]}
              onPress={() => setSelectedChildFilter(child.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.initialCircle,
                  isSelected && styles.initialCircleActive,
                ]}
              >
                <Text
                  style={[
                    styles.initialText,
                    isSelected && styles.initialTextActive,
                  ]}
                >
                  {child.name[0]}
                </Text>
              </View>

              <Text
                style={[
                  styles.nameText,
                  isSelected && styles.nameTextActive,
                ]}
              >
                {child.name.split(' ')[0]}
              </Text>

              <View
                style={[
                  styles.countPill,
                  isSelected && styles.countPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    isSelected && styles.countTextActive,
                  ]}
                >
                  {childEventsCount}
                </Text>
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
    backgroundColor: MonotoneTheme.colors.bg,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: MonotoneTheme.radius.full,
    backgroundColor: MonotoneTheme.colors.surface,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    gap: 7,
  },
  chipActive: {
    backgroundColor: MonotoneTheme.colors.ink,
    borderColor: MonotoneTheme.colors.ink,
  },
  initialCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: MonotoneTheme.colors.ink05,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.borderMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialCircleActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  initialText: {
    fontSize: 10,
    fontWeight: '800',
    color: MonotoneTheme.colors.ink,
  },
  initialTextActive: {
    color: '#FFFFFF',
  },
  nameText: {
    fontSize: 13,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  nameTextActive: {
    color: '#FFFFFF',
  },
  countPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: MonotoneTheme.radius.full,
    backgroundColor: MonotoneTheme.colors.ink05,
  },
  countPillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink60,
  },
  countTextActive: {
    color: '#FFFFFF',
  },
});
