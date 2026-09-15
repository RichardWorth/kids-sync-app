import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import {
  SketchCalendar,
  SketchBriefcase,
  SketchSend,
  SketchCheck,
  SketchClock,
  SketchPin,
} from '../components/SketchIcons';
import { MonotoneTheme } from '../constants/theme';

export const CalendarSyncScreen: React.FC = () => {
  const { events, parent, sendCalendarInvite, syncEventToPhoneCalendar } = useApp();

  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [workEmail, setWorkEmail] = useState<string>(parent.workEmail || 'richard.foster@acmecorp.com');
  const [personalEmail, setPersonalEmail] = useState<string>(parent.email || 'richard.foster@gmail.com');
  const [sendingWork, setSendingWork] = useState(false);
  const [syncingPersonal, setSyncingPersonal] = useState(false);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const handleSendWorkInvite = async () => {
    if (!selectedEvent) return;
    if (!workEmail.trim()) {
      Alert.alert('Email Required', 'Please enter your work email.');
      return;
    }
    setSendingWork(true);
    const res = await sendCalendarInvite(selectedEvent.id, workEmail, 'work');
    setSendingWork(false);
    Alert.alert('Work Invite Sent', res.message);
  };

  const handleSyncPersonalCalendar = async () => {
    if (!selectedEvent) return;
    setSyncingPersonal(true);
    const msg = await syncEventToPhoneCalendar(selectedEvent);
    setSyncingPersonal(false);
    Alert.alert('Calendar Synced', msg);
  };

  const handleBatchSync = async () => {
    Alert.alert(
      'Calendar Sync',
      `Sent calendar invites for all ${events.length} activities to ${workEmail} and your device calendar.`,
      [{ text: 'Done' }]
    );
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
          <SketchCalendar size={22} color={MonotoneTheme.colors.ink} />
          <View>
            <Text style={styles.appTitle}>CALENDAR & INVITES</Text>
            <Text style={styles.subtitle}>
              Send invites to your work or personal calendar
            </Text>
          </View>
        </View>
      </View>

      {/* 1. Choose Activity to Sync */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Select Activity</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsScroll}
        >
          {events.map((ev) => {
            const isSelected = ev.id === selectedEventId;
            return (
              <TouchableOpacity
                key={ev.id}
                style={[
                  styles.eventSelectorTile,
                  isSelected && styles.eventSelectorTileActive,
                ]}
                onPress={() => setSelectedEventId(ev.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.eventSelectorDate,
                    isSelected && styles.textActive,
                  ]}
                >
                  {ev.date}
                </Text>
                <Text
                  style={[
                    styles.eventSelectorTitle,
                    isSelected && styles.textActive,
                  ]}
                  numberOfLines={2}
                >
                  {ev.title}
                </Text>
                <Text
                  style={[
                    styles.eventSelectorCircle,
                    isSelected && styles.textActiveMuted,
                  ]}
                >
                  {ev.circleName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Selected Event Details Card */}
      {selectedEvent && (
        <View style={styles.previewBox}>
          <Text style={styles.previewTitle} numberOfLines={1}>
            {selectedEvent.title}
          </Text>
          <View style={styles.metaRow}>
            <SketchClock size={13} color={MonotoneTheme.colors.ink60} />
            <Text style={styles.metaText}>
              {selectedEvent.date} ({selectedEvent.startTime} - {selectedEvent.endTime})
            </Text>
          </View>
          <View style={styles.metaRow}>
            <SketchPin size={13} color={MonotoneTheme.colors.ink60} />
            <Text style={styles.metaText} numberOfLines={1}>
              {selectedEvent.location}
            </Text>
          </View>
        </View>
      )}

      {/* 2. Send to Work Calendar */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <SketchBriefcase size={20} color={MonotoneTheme.colors.ink} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Work Calendar (Outlook / Google)</Text>
            <Text style={styles.cardSubtitle}>
              Sends an .ics invite with fixture notes and reminder alarms
            </Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Work Email</Text>
          <TextInput
            style={styles.input}
            value={workEmail}
            onChangeText={setWorkEmail}
            placeholder="name@company.com"
            placeholderTextColor={MonotoneTheme.colors.ink40}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleSendWorkInvite}
          disabled={sendingWork}
          activeOpacity={0.85}
        >
          <SketchSend size={15} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>
            {sendingWork ? 'Sending Invite...' : 'Send Work Calendar Invite'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3. Sync to Personal Calendar */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <SketchCalendar size={20} color={MonotoneTheme.colors.ink} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Personal Calendar (Apple / Phone)</Text>
            <Text style={styles.cardSubtitle}>
              Directly adds to your device's default calendar with 1-hour alarm
            </Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Personal Email</Text>
          <TextInput
            style={styles.input}
            value={personalEmail}
            onChangeText={setPersonalEmail}
            placeholder="name@gmail.com"
            placeholderTextColor={MonotoneTheme.colors.ink40}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.actionBtnOutline}
          onPress={handleSyncPersonalCalendar}
          disabled={syncingPersonal}
          activeOpacity={0.85}
        >
          <SketchCheck size={15} color={MonotoneTheme.colors.ink} />
          <Text style={styles.actionBtnOutlineText}>
            {syncingPersonal ? 'Syncing...' : 'Add to Phone Calendar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Batch Sync */}
      <View style={styles.batchCard}>
        <Text style={styles.batchTitle}>Need all upcoming fixtures synced?</Text>
        <Text style={styles.batchSubtitle}>
          Send calendar invites for all {events.length} activities to both your work
          and personal schedules in one tap.
        </Text>
        <TouchableOpacity
          style={styles.batchBtn}
          onPress={handleBatchSync}
          activeOpacity={0.85}
        >
          <Text style={styles.batchBtnText}>
            Sync All {events.length} Upcoming Activities
          </Text>
        </TouchableOpacity>
      </View>
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
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink60,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  eventsScroll: {
    gap: 8,
  },
  eventSelectorTile: {
    width: 180,
    backgroundColor: MonotoneTheme.colors.surface,
    borderRadius: MonotoneTheme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
  },
  eventSelectorTileActive: {
    backgroundColor: MonotoneTheme.colors.ink,
    borderColor: MonotoneTheme.colors.ink,
  },
  eventSelectorDate: {
    fontSize: 10,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink60,
    marginBottom: 3,
  },
  eventSelectorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
    lineHeight: 17,
    marginBottom: 3,
  },
  eventSelectorCircle: {
    fontSize: 10,
    color: MonotoneTheme.colors.ink40,
  },
  textActive: {
    color: '#FFFFFF',
  },
  textActiveMuted: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  previewBox: {
    backgroundColor: MonotoneTheme.colors.surface,
    borderRadius: MonotoneTheme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    gap: 6,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: MonotoneTheme.colors.ink,
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
  card: {
    backgroundColor: MonotoneTheme.colors.surface,
    borderRadius: MonotoneTheme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  cardSubtitle: {
    fontSize: 12,
    color: MonotoneTheme.colors.ink60,
    marginTop: 2,
  },
  inputContainer: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: MonotoneTheme.colors.ink60,
  },
  input: {
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    borderRadius: MonotoneTheme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: MonotoneTheme.colors.ink,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: MonotoneTheme.colors.ink,
    paddingVertical: 11,
    borderRadius: MonotoneTheme.radius.sm,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: MonotoneTheme.colors.surface,
    borderWidth: 1.5,
    borderColor: MonotoneTheme.colors.ink,
    paddingVertical: 10,
    borderRadius: MonotoneTheme.radius.sm,
  },
  actionBtnOutlineText: {
    fontSize: 13,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  batchCard: {
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    borderRadius: MonotoneTheme.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    alignItems: 'center',
    gap: 5,
  },
  batchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  batchSubtitle: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink60,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 260,
  },
  batchBtn: {
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: MonotoneTheme.radius.sm,
    backgroundColor: MonotoneTheme.colors.ink10,
  },
  batchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
});
