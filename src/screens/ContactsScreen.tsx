import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  Share,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { PhoneContact, Circle } from '../types';
import {
  Users,
  RefreshCw,
  Search,
  Phone,
  MessageSquare,
  UserPlus,
  Shield,
  Check,
  ChevronRight,
  Trophy,
  Music,
  Waves,
  GraduationCap,
} from 'lucide-react-native';

export const ContactsScreen: React.FC = () => {
  const {
    contacts,
    circles,
    syncDeviceContacts,
    inviteContact,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'contacts' | 'circles'>('contacts');
  const [syncing, setSyncing] = useState(false);

  const handleSyncContacts = async () => {
    setSyncing(true);
    const msg = await syncDeviceContacts();
    setSyncing(false);
    Alert.alert('Contacts Sync', msg);
  };

  const handleInvite = async (contact: PhoneContact) => {
    inviteContact(contact.id);
    try {
      await Share.share({
        message: `Hi ${contact.name}! I'm coordinating our kids' clubs, matches, and carpools on KidSync. Join our circle here: https://kidsync.app/join/circle-1`,
      });
    } catch (err) {
      Alert.alert('Invite Sent', `Invite message generated for ${contact.name}!`);
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleSMS = (phone: string) => {
    Linking.openURL(`sms:${phone}`);
  };

  const filteredContacts = contacts.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.linkedKidNames?.some((k) => k.toLowerCase().includes(q))
    );
  });

  const getCircleIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy size={18} color="#3B82F6" />;
      case 'music':
        return <Music size={18} color="#EC4899" />;
      case 'waves':
        return <Waves size={18} color="#06B6D4" />;
      default:
        return <GraduationCap size={18} color="#10B981" />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Contacts & Circles</Text>
          <Text style={styles.subtitle}>
            Link parents & clubs from your address book
          </Text>
        </View>
        <TouchableOpacity
          style={styles.syncBtn}
          onPress={handleSyncContacts}
          disabled={syncing}
        >
          <RefreshCw size={15} color="#4F46E5" />
          <Text style={styles.syncBtnText}>
            {syncing ? 'Syncing...' : 'Sync Phone'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'contacts' && styles.tabActive]}
          onPress={() => setActiveTab('contacts')}
        >
          <Text
            style={[styles.tabText, activeTab === 'contacts' && styles.tabTextActive]}
          >
            Phone Contacts ({contacts.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'circles' && styles.tabActive]}
          onPress={() => setActiveTab('circles')}
        >
          <Text
            style={[styles.tabText, activeTab === 'circles' && styles.tabTextActive]}
          >
            Clubs & Circles ({circles.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder={
              activeTab === 'contacts'
                ? 'Search parents, children, or phone numbers...'
                : 'Search club circles...'
            }
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tab 1: Phone Contacts */}
      {activeTab === 'contacts' && (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Privacy Tag */}
          <View style={styles.privacyBox}>
            <Shield size={15} color="#059669" />
            <Text style={styles.privacyText}>
              Your contacts are synced securely and are only visible to clubs you join.
            </Text>
          </View>

          {filteredContacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactLeft}>
                <View
                  style={[
                    styles.avatar,
                    contact.isRegisteredUser ? styles.avatarRegistered : styles.avatarUnregistered,
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarText,
                      contact.isRegisteredUser
                        ? styles.avatarTextRegistered
                        : styles.avatarTextUnregistered,
                    ]}
                  >
                    {contact.name[0]}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    {contact.isRegisteredUser && (
                      <View style={styles.registeredBadge}>
                        <Check size={11} color="#15803D" />
                        <Text style={styles.registeredBadgeText}>KidSync User</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>

                  {contact.linkedKidNames && contact.linkedKidNames.length > 0 && (
                    <View style={styles.linkedKidsContainer}>
                      {contact.linkedKidNames.map((kid, i) => (
                        <Text key={i} style={styles.linkedKidTag}>
                          👶 {kid}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.contactActions}>
                <TouchableOpacity
                  style={styles.actionIconBtn}
                  onPress={() => handleCall(contact.phone)}
                >
                  <Phone size={15} color="#475569" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionIconBtn}
                  onPress={() => handleSMS(contact.phone)}
                >
                  <MessageSquare size={15} color="#475569" />
                </TouchableOpacity>

                {!contact.isRegisteredUser && (
                  <TouchableOpacity
                    style={[
                      styles.inviteBtn,
                      contact.invited && styles.invitedBtn,
                    ]}
                    onPress={() => handleInvite(contact)}
                  >
                    <UserPlus
                      size={13}
                      color={contact.invited ? '#15803D' : '#4F46E5'}
                    />
                    <Text
                      style={[
                        styles.inviteBtnText,
                        contact.invited && styles.invitedBtnText,
                      ]}
                    >
                      {contact.invited ? 'Invited' : 'Invite'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Tab 2: Circles / Clubs */}
      {activeTab === 'circles' && (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {circles.map((circle) => (
            <View key={circle.id} style={styles.circleCard}>
              <View
                style={[
                  styles.circleIconWrapper,
                  { backgroundColor: `${circle.color}15` },
                ]}
              >
                {getCircleIcon(circle.icon)}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.circleName}>{circle.name}</Text>
                <Text style={styles.circleCategory}>{circle.category}</Text>
                <Text style={styles.circleAdmin}>
                  Admin: {circle.adminName} • {circle.memberCount} parents
                </Text>
              </View>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          ))}
        </ScrollView>
      )}
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
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  syncBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    padding: 0,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  privacyText: {
    fontSize: 12,
    color: '#065F46',
    flex: 1,
    lineHeight: 16,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  contactLeft: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarRegistered: {
    backgroundColor: '#EEF2FF',
  },
  avatarUnregistered: {
    backgroundColor: '#F1F5F9',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  avatarTextRegistered: {
    color: '#4F46E5',
  },
  avatarTextUnregistered: {
    color: '#64748B',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  registeredBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  contactPhone: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  linkedKidsContainer: {
    marginTop: 6,
    gap: 2,
  },
  linkedKidTag: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  invitedBtn: {
    backgroundColor: '#F0FDF4',
  },
  inviteBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },
  invitedBtnText: {
    color: '#15803D',
  },
  circleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  circleIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  circleCategory: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 1,
  },
  circleAdmin: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
