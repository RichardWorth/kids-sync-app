import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { AddChildModal } from '../components/AddChildModal';
import {
  SketchUsers,
  SketchCheck,
  SketchCalendar,
  SketchClock,
} from '../components/SketchIcons';
import {
  Plus,
  Phone,
  Mail,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Heart,
  LogOut,
  UserPlus,
} from 'lucide-react-native';
import { MonotoneTheme } from '../constants/theme';

export const ProfileScreen: React.FC = () => {
  const {
    parent,
    children,
    circles,
    contacts,
    syncDeviceContacts,
    deleteChild,
    logoutAndReset,
    joinCircleWithCode,
  } = useApp();
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [syncingContacts, setSyncingContacts] = useState(false);
  const [autoCalendarSync, setAutoCalendarSync] = useState(true);
  const [carpoolAlerts, setCarpoolAlerts] = useState(true);

  const handleManualSyncContacts = async () => {
    setSyncingContacts(true);
    const msg = await syncDeviceContacts();
    setSyncingContacts(false);
    Alert.alert('Contacts Synced', msg);
  };

  const handleDeleteChild = (childId: string, childName: string) => {
    Alert.alert(
      'Remove Child Profile',
      `Are you sure you want to remove ${childName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteChild(childId),
        },
      ]
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
          <SketchUsers size={22} color={MonotoneTheme.colors.ink} />
          <View>
            <Text style={styles.appTitle}>FAMILY HUB & SETTINGS</Text>
            <Text style={styles.subtitle}>
              Manage children profiles, phone contacts & sync
            </Text>
          </View>
        </View>
      </View>

      {/* Parent Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>{parent.name[0]}</Text>
        </View>
        <Text style={styles.parentName}>{parent.name}</Text>
        <Text style={styles.parentRole}>Parent & Group Organizer</Text>

        <View style={styles.contactDetailsRow}>
          <View style={styles.contactPill}>
            <Phone size={12} color={MonotoneTheme.colors.ink60} />
            <Text style={styles.contactPillText}>{parent.phone}</Text>
          </View>
          <View style={styles.contactPill}>
            <Mail size={12} color={MonotoneTheme.colors.ink60} />
            <Text style={styles.contactPillText}>{parent.email}</Text>
          </View>
        </View>
      </View>

      {/* Children Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Children ({children.length})</Text>
          <TouchableOpacity
            style={styles.addChildBtn}
            onPress={() => setShowAddChildModal(true)}
            activeOpacity={0.85}
          >
            <Plus size={13} color="#FFFFFF" />
            <Text style={styles.addChildBtnText}>Add Child</Text>
          </TouchableOpacity>
        </View>

        {children.map((child) => (
          <View key={child.id} style={styles.childCard}>
            <View style={styles.childHeader}>
              <View style={styles.childAvatar}>
                <Text style={styles.childAvatarText}>{child.name[0]}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childAge}>
                  Age {child.age} • {child.clubs.join(', ')}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.trashBtn}
                onPress={() => handleDeleteChild(child.id, child.name)}
              >
                <Trash2 size={14} color={MonotoneTheme.colors.ink40} />
              </TouchableOpacity>
            </View>

            {/* Medical / Allergies Note */}
            {child.allergies && child.allergies !== 'None' && (
              <View style={styles.medicalBox}>
                <Heart size={12} color={MonotoneTheme.colors.ink80} />
                <Text style={styles.medicalText}>
                  Medical / Safety: {child.allergies}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Joined Classes & Groups Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Joined Classes & Groups ({circles.length})</Text>
          <TouchableOpacity
            style={styles.addChildBtn}
            onPress={() => {
              const code = prompt('Enter Class or Group Invite Code (e.g. YEAR4-OAK, U10-STRIKERS):');
              if (code) {
                const res = joinCircleWithCode(code);
                Alert.alert(res.success ? 'Joined Group 🎉' : 'Notice', res.message);
              }
            }}
            activeOpacity={0.85}
          >
            <Plus size={13} color="#FFFFFF" />
            <Text style={styles.addChildBtnText}>Join Class</Text>
          </TouchableOpacity>
        </View>

        {circles.map((c) => (
          <View key={c.id} style={styles.groupCard}>
            <View style={styles.groupHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.groupName}>{c.name}</Text>
                <Text style={styles.groupCategory}>
                  {c.category} • {c.memberCount} Parents
                </Text>
              </View>

              <View style={styles.codeBadge}>
                <Text style={styles.codeBadgeText}>{c.code}</Text>
              </View>
            </View>

            {c.description && (
              <Text style={styles.groupDesc}>{c.description}</Text>
            )}

            <View style={styles.groupFooter}>
              <Text style={styles.adminText}>Admin: {c.adminName}</Text>
              <TouchableOpacity
                style={styles.shareGroupBtn}
                onPress={() => {
                  const invite = `Join our ${c.name} activity circle on KidSync! Invite Code: ${c.code}`;
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(invite);
                  }
                  Alert.alert('Invite Copied! 📋', `Share with parents:\n"${invite}"`);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.shareGroupBtnText}>Copy Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Phone Address Book Sync Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phone Contacts Sync</Text>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Device Address Book</Text>
              <Text style={styles.cardSubtitle}>
                {contacts.length} phone contacts available for club invites & carpools
              </Text>
            </View>

            <TouchableOpacity
              style={styles.syncBtn}
              onPress={handleManualSyncContacts}
              disabled={syncingContacts}
              activeOpacity={0.85}
            >
              <RefreshCw size={13} color="#FFFFFF" />
              <Text style={styles.syncBtnText}>
                {syncingContacts ? 'Syncing...' : 'Sync Phone'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.privacyNotice}>
            <ShieldCheck size={14} color={MonotoneTheme.colors.ink80} />
            <Text style={styles.privacyNoticeText}>
              Contacts are kept strictly private on your phone. Only parents you
              invite into your club circles can coordinate lifts.
            </Text>
          </View>
        </View>
      </View>

      {/* App Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sync & Notification Preferences</Text>

        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Auto-Sync to Phone Calendar</Text>
              <Text style={styles.settingSub}>
                Automatically add confirmed club fixtures to Apple / Google Calendar
              </Text>
            </View>
            <Switch
              value={autoCalendarSync}
              onValueChange={setAutoCalendarSync}
              trackColor={{ false: 'rgba(0,0,0,0.1)', true: MonotoneTheme.colors.ink }}
              thumbColor={autoCalendarSync ? '#FFFFFF' : '#FAFAFA'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Carpool Instant Alerts</Text>
              <Text style={styles.settingSub}>
                Push alerts when another parent reserves or releases a car seat
              </Text>
            </View>
            <Switch
              value={carpoolAlerts}
              onValueChange={setCarpoolAlerts}
              trackColor={{ false: 'rgba(0,0,0,0.1)', true: MonotoneTheme.colors.ink }}
              thumbColor={carpoolAlerts ? '#FFFFFF' : '#FAFAFA'}
            />
          </View>
        </View>
      </View>

      {/* Account & Registration Flow */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parent Account Management</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Switch / Re-Register Parent</Text>
              <Text style={styles.settingSub}>
                Open the registration screen to sign up a new parent profile or add new kids.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.switchAccountBtn}
            onPress={() => {
              Alert.alert(
                'Register New Parent',
                'Do you want to switch accounts or register a new parent and child profile?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Open Registration',
                    style: 'default',
                    onPress: () => logoutAndReset(),
                  },
                ]
              );
            }}
            activeOpacity={0.8}
          >
            <UserPlus size={14} color={MonotoneTheme.colors.ink} />
            <Text style={styles.switchAccountBtnText}>Open Parent Registration Flow</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Child Modal */}
      <AddChildModal
        visible={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
      />
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
  profileCard: {
    backgroundColor: MonotoneTheme.colors.surface,
    borderRadius: MonotoneTheme.radius.lg,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
  },
  avatarLarge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: MonotoneTheme.colors.ink05,
    borderWidth: 1.5,
    borderColor: MonotoneTheme.colors.borderMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarLargeText: {
    fontSize: 22,
    fontWeight: '800',
    color: MonotoneTheme.colors.ink,
  },
  parentName: {
    fontSize: 16,
    fontWeight: '800',
    color: MonotoneTheme.colors.ink,
  },
  parentRole: {
    fontSize: 12,
    color: MonotoneTheme.colors.ink60,
    marginTop: 2,
  },
  contactDetailsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  contactPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: MonotoneTheme.radius.full,
  },
  contactPillText: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink80,
    fontWeight: '500',
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink60,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  addChildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: MonotoneTheme.colors.ink,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: MonotoneTheme.radius.full,
  },
  addChildBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  childCard: {
    backgroundColor: MonotoneTheme.colors.surface,
    borderRadius: MonotoneTheme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    gap: 8,
  },
  childHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  childAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MonotoneTheme.colors.ink05,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.borderMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childAvatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: MonotoneTheme.colors.ink,
  },
  childName: {
    fontSize: 14,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  childAge: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink60,
    marginTop: 1,
  },
  trashBtn: {
    padding: 6,
  },
  medicalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    padding: 8,
    borderRadius: MonotoneTheme.radius.sm,
  },
  medicalText: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink80,
    fontWeight: '500',
  },
  card: {
    backgroundColor: MonotoneTheme.colors.surface,
    borderRadius: MonotoneTheme.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  cardSubtitle: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink60,
    marginTop: 1,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: MonotoneTheme.colors.ink,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: MonotoneTheme.radius.sm,
  },
  syncBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    padding: 10,
    borderRadius: MonotoneTheme.radius.sm,
  },
  privacyNoticeText: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink60,
    flex: 1,
    lineHeight: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  settingSub: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink60,
    marginTop: 2,
    maxWidth: 240,
  },
  divider: {
    height: 1,
    backgroundColor: MonotoneTheme.colors.border,
    marginVertical: 4,
  },
  switchAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: MonotoneTheme.colors.ink05,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.borderMedium,
    paddingVertical: 10,
    borderRadius: MonotoneTheme.radius.sm,
    marginTop: 6,
  },
  switchAccountBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  groupCard: {
    backgroundColor: MonotoneTheme.colors.surface,
    borderRadius: MonotoneTheme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    gap: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  groupName: {
    fontSize: 13,
    fontWeight: '800',
    color: MonotoneTheme.colors.ink,
  },
  groupCategory: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink60,
    marginTop: 1,
  },
  codeBadge: {
    backgroundColor: MonotoneTheme.colors.ink05,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.ink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: MonotoneTheme.radius.sm,
  },
  codeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: MonotoneTheme.colors.ink,
    letterSpacing: 0.5,
  },
  groupDesc: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink60,
    lineHeight: 15,
  },
  groupFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: MonotoneTheme.colors.border,
    paddingTop: 6,
    marginTop: 2,
  },
  adminText: {
    fontSize: 10,
    color: MonotoneTheme.colors.ink60,
  },
  shareGroupBtn: {
    backgroundColor: MonotoneTheme.colors.ink,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: MonotoneTheme.radius.sm,
  },
  shareGroupBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
