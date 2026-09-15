import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { CalendarSyncScreen } from './src/screens/CalendarSyncScreen';
import { MyEventsPayScreen } from './src/screens/MyEventsPayScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AuthOnboardingScreen } from './src/screens/AuthOnboardingScreen';
import {
  SketchCalendar,
  SketchBriefcase,
  SketchCard,
  SketchUsers,
} from './src/components/SketchIcons';
import { MonotoneTheme } from './src/constants/theme';

type TabType = 'events' | 'calendarSync' | 'myEventsPay' | 'profile';

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('events');
  const { events, bookings, parent, isRegistered } = useApp();
  const { width, height } = useWindowDimensions();

  const unpaidCount = bookings.filter(
    (b) => b.parentId === parent.id && b.paymentStatus === 'unpaid'
  ).length;

  // Detect if running on a desktop browser screen
  const isDesktopWeb = Platform.OS === 'web' && width > 520;

  const content = (
    <View style={styles.phoneFrame}>
      {/* Phone Speaker Notch (Desktop Web Preview Only) */}
      {isDesktopWeb && (
        <View style={styles.desktopNotchBar}>
          <View style={styles.speakerPill} />
          <View style={styles.cameraDot} />
        </View>
      )}

      {/* Main Screen Content or Auth Onboarding */}
      {!isRegistered ? (
        <AuthOnboardingScreen />
      ) : (
        <>
          <View style={styles.screenContent}>
            {activeTab === 'events' && <CalendarScreen />}
            {activeTab === 'calendarSync' && <CalendarSyncScreen />}
            {activeTab === 'myEventsPay' && <MyEventsPayScreen />}
            {activeTab === 'profile' && <ProfileScreen />}
          </View>

          {/* Monotone Tab Bar */}
          <View style={styles.tabBar}>
            {/* Tab 1: Events Feed */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setActiveTab('events')}
              activeOpacity={0.7}
            >
              <View style={styles.tabIconWrapper}>
                <SketchCalendar
                  size={21}
                  color={
                    activeTab === 'events'
                      ? MonotoneTheme.colors.ink
                      : MonotoneTheme.colors.ink40
                  }
                  strokeWidth={activeTab === 'events' ? 2 : 1.5}
                />
                {events.length > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{events.length}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'events' && styles.tabLabelActive,
                ]}
              >
                Events
              </Text>
            </TouchableOpacity>

            {/* Tab 2: Calendar Invites Sync */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setActiveTab('calendarSync')}
              activeOpacity={0.7}
            >
              <View style={styles.tabIconWrapper}>
                <SketchBriefcase
                  size={21}
                  color={
                    activeTab === 'calendarSync'
                      ? MonotoneTheme.colors.ink
                      : MonotoneTheme.colors.ink40
                  }
                  strokeWidth={activeTab === 'calendarSync' ? 2 : 1.5}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'calendarSync' && styles.tabLabelActive,
                ]}
              >
                Sync
              </Text>
            </TouchableOpacity>

            {/* Tab 3: My Events & Pay */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setActiveTab('myEventsPay')}
              activeOpacity={0.7}
            >
              <View style={styles.tabIconWrapper}>
                <SketchCard
                  size={21}
                  color={
                    activeTab === 'myEventsPay'
                      ? MonotoneTheme.colors.ink
                      : MonotoneTheme.colors.ink40
                  }
                  strokeWidth={activeTab === 'myEventsPay' ? 2 : 1.5}
                />
                {unpaidCount > 0 && (
                  <View style={[styles.tabBadge, { backgroundColor: MonotoneTheme.colors.ink }]}>
                    <Text style={styles.tabBadgeText}>£</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'myEventsPay' && styles.tabLabelActive,
                ]}
              >
                My Subs
              </Text>
            </TouchableOpacity>

            {/* Tab 4: Family & Circles */}
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setActiveTab('profile')}
              activeOpacity={0.7}
            >
              <View style={styles.tabIconWrapper}>
                <SketchUsers
                  size={21}
                  color={
                    activeTab === 'profile'
                      ? MonotoneTheme.colors.ink
                      : MonotoneTheme.colors.ink40
                  }
                  strokeWidth={activeTab === 'profile' ? 2 : 1.5}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'profile' && styles.tabLabelActive,
                ]}
              >
                Family
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Home Indicator Bar (Desktop Web Preview Only) */}
      {isDesktopWeb && (
        <View style={styles.desktopHomeBar}>
          <View style={styles.homeIndicator} />
        </View>
      )}
    </View>
  );

  // If on wide desktop browser, render inside a centered phone shell
  if (isDesktopWeb) {
    return (
      <View style={styles.desktopOuterContainer}>
        <StatusBar style="dark" />
        <View style={styles.desktopPhoneShell}>
          {content}
        </View>
      </View>
    );
  }

  // Native mobile or narrow screen: edge-to-edge
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {content}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // Edge-to-edge on actual mobile devices
  safeArea: {
    flex: 1,
    backgroundColor: MonotoneTheme.colors.surface,
  },
  // Centered Desktop Web Container
  desktopOuterContainer: {
    flex: 1,
    backgroundColor: '#E8E8EC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  desktopPhoneShell: {
    width: '100%',
    maxWidth: 412,
    height: '100%',
    maxHeight: 880,
    borderRadius: 44,
    backgroundColor: MonotoneTheme.colors.bg,
    borderWidth: 10,
    borderColor: '#18181B',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 36,
    elevation: 20,
  },
  phoneFrame: {
    flex: 1,
    backgroundColor: MonotoneTheme.colors.bg,
  },
  desktopNotchBar: {
    height: 28,
    backgroundColor: MonotoneTheme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: MonotoneTheme.colors.border,
  },
  speakerPill: {
    width: 48,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  cameraDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  screenContent: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: MonotoneTheme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: MonotoneTheme.colors.border,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 22 : 10,
  },
  desktopHomeBar: {
    height: 20,
    backgroundColor: MonotoneTheme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapper: {
    position: 'relative',
    width: 28,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadge: {
    position: 'absolute',
    top: -3,
    right: -7,
    backgroundColor: MonotoneTheme.colors.ink,
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: MonotoneTheme.colors.ink40,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: MonotoneTheme.colors.ink,
    fontWeight: '800',
  },
});
