import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import {
  SketchCalendar,
  SketchUsers,
  SketchCheck,
  SketchBriefcase,
  SketchClock,
  SketchPin,
} from '../components/SketchIcons';
import {
  User,
  Phone,
  Mail,
  Plus,
  KeyRound,
  LogIn,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react-native';
import { MonotoneTheme } from '../constants/theme';

type AuthMode = 'join_code' | 'quick_login';

export const AuthOnboardingScreen: React.FC = () => {
  const { registerParent, loginExisting } = useApp();
  const [authMode, setAuthMode] = useState<AuthMode>('join_code');

  // Group / Class Code
  const [groupCode, setGroupCode] = useState('SUMMER-2026');

  // Parent State
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentWorkEmail, setParentWorkEmail] = useState('');

  // Child State
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childClubs, setChildClubs] = useState('');
  const [childAllergies, setChildAllergies] = useState('');

  // Second Child (Optional)
  const [hasSecondChild, setHasSecondChild] = useState(false);
  const [child2Name, setChild2Name] = useState('');
  const [child2Age, setChild2Age] = useState('');
  const [child2Allergies, setChild2Allergies] = useState('');

  // Quick Login State
  const [quickIdentifier, setQuickIdentifier] = useState('');

  const POPULAR_CODES = [
    { code: 'SUMMER-2026', label: 'Summer Days Out (60+ UK)' },
    { code: 'YEAR4-OAK', label: 'Year 4 Oak Class Hub' },
    { code: 'U10-STRIKERS', label: 'West End U10 Strikers' },
    { code: 'PRIMA-BALLET', label: 'Prima Ballet Academy' },
  ];

  const handleJoinWithCode = () => {
    if (!parentName.trim()) {
      Alert.alert('Parent Name Required', 'Please enter your name to coordinate with other parents.');
      return;
    }
    if (!parentPhone.trim()) {
      Alert.alert('Phone Number Required', 'Please enter your mobile phone number for carpool lift sharing.');
      return;
    }
    if (!parentEmail.trim()) {
      Alert.alert('Email Required', 'Please enter your email for calendar invite sync.');
      return;
    }

    const kids = [];
    if (childName.trim()) {
      kids.push({
        name: childName.trim(),
        age: parseInt(childAge, 10) || 8,
        color: '#111111',
        avatarBg: '#F1F5F9',
        allergies: childAllergies.trim() || 'None',
        clubs: [groupCode.trim() ? `${groupCode.toUpperCase()} Group` : 'Local Activity Circle'],
      });
    } else {
      kids.push({
        name: `${parentName.split(' ')[0]}'s Child`,
        age: 8,
        color: '#111111',
        avatarBg: '#F1F5F9',
        allergies: 'None',
        clubs: [groupCode.trim() ? `${groupCode.toUpperCase()} Group` : 'Local Activity Circle'],
      });
    }

    if (hasSecondChild && child2Name.trim()) {
      kids.push({
        name: child2Name.trim(),
        age: parseInt(child2Age, 10) || 6,
        color: '#111111',
        avatarBg: '#F1F5F9',
        allergies: child2Allergies.trim() || 'None',
        clubs: [groupCode.trim() ? `${groupCode.toUpperCase()} Group` : 'Local Activity Circle'],
      });
    }

    registerParent(
      {
        name: parentName.trim(),
        phone: parentPhone.trim(),
        email: parentEmail.trim(),
        workEmail: parentWorkEmail.trim(),
      },
      kids,
      groupCode.trim() || 'COMMUNITY-HUB'
    );
  };

  const handleQuickSignIn = () => {
    if (!quickIdentifier.trim()) {
      Alert.alert('Login Required', 'Please enter your phone number, email, or name.');
      return;
    }

    const success = loginExisting(quickIdentifier.trim());
    if (success) {
      Alert.alert('Welcome Back!', 'Signed in successfully.');
    }
  };

  const handleQuickDemo = () => {
    registerParent(
      {
        name: 'Richard Foster',
        phone: '+44 7700 900555',
        email: 'richard.foster@gmail.com',
        workEmail: 'richard.foster@acmecorp.com',
      },
      [
        {
          name: 'Leo Foster',
          age: 9,
          color: '#111111',
          avatarBg: '#F1F5F9',
          allergies: 'Peanuts (carry EpiPen)',
          clubs: ['West End U10 Strikers', 'Summer Holiday Days Out'],
        },
        {
          name: 'Mia Foster',
          age: 7,
          color: '#111111',
          avatarBg: '#F1F5F9',
          allergies: 'None',
          clubs: ['Prima Ballet Academy', 'Summer Holiday Days Out'],
        },
      ],
      'SUMMER-2026'
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <SketchCalendar size={32} color={MonotoneTheme.colors.ink} strokeWidth={2} />
        </View>
        <Text style={styles.headerTitle}>K I D S Y N C</Text>
        <Text style={styles.headerSubtitle}>
          Grassroots Activity & Carpool Hub for Local School Classes, Clubs & Groups
        </Text>
      </View>

      {/* Segmented Mode Switcher */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, authMode === 'join_code' && styles.segmentBtnActive]}
          onPress={() => setAuthMode('join_code')}
          activeOpacity={0.8}
        >
          <KeyRound
            size={14}
            color={authMode === 'join_code' ? '#FFFFFF' : MonotoneTheme.colors.ink60}
          />
          <Text
            style={[
              styles.segmentBtnText,
              authMode === 'join_code' && styles.segmentBtnTextActive,
            ]}
          >
            Join with Code
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, authMode === 'quick_login' && styles.segmentBtnActive]}
          onPress={() => setAuthMode('quick_login')}
          activeOpacity={0.8}
        >
          <LogIn
            size={14}
            color={authMode === 'quick_login' ? '#FFFFFF' : MonotoneTheme.colors.ink60}
          />
          <Text
            style={[
              styles.segmentBtnText,
              authMode === 'quick_login' && styles.segmentBtnTextActive,
            ]}
          >
            Parent Sign In
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODE 1: JOIN WITH CLASS / GROUP CODE */}
      {authMode === 'join_code' && (
        <>
          {/* STEP 1: Class / Group Code */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <KeyRound size={16} color={MonotoneTheme.colors.ink} />
              <Text style={styles.cardTitle}>1. Class or Group Invite Code</Text>
            </View>
            <Text style={styles.cardExplainer}>
              Enter the code shared by your class rep, coach, or school organizer:
            </Text>

            <TextInput
              style={[styles.input, styles.codeInput]}
              value={groupCode}
              onChangeText={setGroupCode}
              placeholder="e.g. YEAR4-OAK, U10-STRIKERS"
              autoCapitalize="characters"
              placeholderTextColor={MonotoneTheme.colors.ink40}
            />

            {/* Quick Pick Chips */}
            <View style={styles.chipsRow}>
              {POPULAR_CODES.map((item) => (
                <TouchableOpacity
                  key={item.code}
                  style={[
                    styles.chip,
                    groupCode.toUpperCase() === item.code && styles.chipActive,
                  ]}
                  onPress={() => setGroupCode(item.code)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.chipText,
                      groupCode.toUpperCase() === item.code && styles.chipTextActive,
                    ]}
                  >
                    {item.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* STEP 2: Parent Profile */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <User size={16} color={MonotoneTheme.colors.ink} />
              <Text style={styles.cardTitle}>2. Parent Details</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={parentName}
                onChangeText={setParentName}
                placeholder="e.g. Sarah Jenkins"
                placeholderTextColor={MonotoneTheme.colors.ink40}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile Phone * (for lift sharing & carpools)</Text>
              <TextInput
                style={styles.input}
                value={parentPhone}
                onChangeText={setParentPhone}
                placeholder="e.g. +44 7700 900123"
                keyboardType="phone-pad"
                placeholderTextColor={MonotoneTheme.colors.ink40}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address * (for calendar invites)</Text>
              <TextInput
                style={styles.input}
                value={parentEmail}
                onChangeText={setParentEmail}
                placeholder="e.g. sarah.j@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={MonotoneTheme.colors.ink40}
              />
            </View>
          </View>

          {/* STEP 3: Child Details */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <SketchUsers size={18} color={MonotoneTheme.colors.ink} />
              <Text style={styles.cardTitle}>3. Child Profile</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Child's Full Name *</Text>
              <TextInput
                style={styles.input}
                value={childName}
                onChangeText={setChildName}
                placeholder="e.g. Oliver Jenkins"
                placeholderTextColor={MonotoneTheme.colors.ink40}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age / School Year</Text>
              <TextInput
                style={styles.input}
                value={childAge}
                onChangeText={setChildAge}
                placeholder="e.g. 9 (Year 4)"
                placeholderTextColor={MonotoneTheme.colors.ink40}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Medical Notes / Allergies (Optional)</Text>
              <TextInput
                style={styles.input}
                value={childAllergies}
                onChangeText={setChildAllergies}
                placeholder="e.g. None or Asthma inhaler in bag"
                placeholderTextColor={MonotoneTheme.colors.ink40}
              />
            </View>

            {!hasSecondChild ? (
              <TouchableOpacity
                style={styles.addMoreKidBtn}
                onPress={() => setHasSecondChild(true)}
                activeOpacity={0.8}
              >
                <Plus size={13} color={MonotoneTheme.colors.ink} />
                <Text style={styles.addMoreKidText}>+ Add a second child</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.secondKidSection}>
                <View style={styles.divider} />
                <Text style={styles.subCardTitle}>Child 2 Details</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={child2Name}
                    onChangeText={setChild2Name}
                    placeholder="e.g. Mia Jenkins"
                    placeholderTextColor={MonotoneTheme.colors.ink40}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Age</Text>
                  <TextInput
                    style={styles.input}
                    value={child2Age}
                    onChangeText={setChild2Age}
                    placeholder="e.g. 6"
                    placeholderTextColor={MonotoneTheme.colors.ink40}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Privacy Note */}
          <View style={styles.privacyCard}>
            <ShieldCheck size={16} color={MonotoneTheme.colors.ink80} />
            <Text style={styles.privacyText}>
              Private community space. Your details are only visible to parents in your joined class or activity circle.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleJoinWithCode}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>Join Group & Open Hub</Text>
          </TouchableOpacity>
        </>
      )}

      {/* MODE 2: QUICK SIGN IN FOR RETURNING PARENTS */}
      {authMode === 'quick_login' && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <LogIn size={16} color={MonotoneTheme.colors.ink} />
            <Text style={styles.cardTitle}>Returning Parent Sign In</Text>
          </View>
          <Text style={styles.cardExplainer}>
            Enter your mobile number, email, or parent name to access your saved children and groups:
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number or Email</Text>
            <TextInput
              style={styles.input}
              value={quickIdentifier}
              onChangeText={setQuickIdentifier}
              placeholder="e.g. +44 7700 900555 or richard.foster@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={MonotoneTheme.colors.ink40}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, { marginTop: 8 }]}
            onPress={handleQuickSignIn}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>Sign In & Open Activities</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Demo Test Shortcut */}
      <TouchableOpacity
        style={styles.demoBtn}
        onPress={handleQuickDemo}
        activeOpacity={0.7}
      >
        <Text style={styles.demoBtnText}>
          ⚡ Click here to instant-test as Richard (Leo & Mia)
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MonotoneTheme.colors.bg,
  },
  content: {
    padding: 18,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 14,
  },
  header: {
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: MonotoneTheme.colors.surface,
    borderWidth: 1.5,
    borderColor: MonotoneTheme.colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    color: MonotoneTheme.colors.ink,
  },
  headerSubtitle: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink60,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 290,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    borderRadius: MonotoneTheme.radius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: MonotoneTheme.radius.full,
  },
  segmentBtnActive: {
    backgroundColor: MonotoneTheme.colors.ink,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink60,
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
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
    gap: 7,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: MonotoneTheme.colors.ink,
    letterSpacing: 0.2,
  },
  cardExplainer: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink60,
    lineHeight: 15,
  },
  codeInput: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    backgroundColor: MonotoneTheme.colors.surface,
    borderWidth: 1.5,
    borderColor: MonotoneTheme.colors.ink,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: MonotoneTheme.radius.full,
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
  },
  chipActive: {
    backgroundColor: MonotoneTheme.colors.ink,
    borderColor: MonotoneTheme.colors.ink,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink80,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink80,
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
  addMoreKidBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: MonotoneTheme.radius.sm,
    backgroundColor: MonotoneTheme.colors.ink05,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    marginTop: 2,
  },
  addMoreKidText: {
    fontSize: 11,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  secondKidSection: {
    gap: 8,
  },
  subCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink80,
  },
  divider: {
    height: 1,
    backgroundColor: MonotoneTheme.colors.border,
    marginVertical: 4,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    padding: 10,
    borderRadius: MonotoneTheme.radius.md,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
  },
  privacyText: {
    fontSize: 10,
    color: MonotoneTheme.colors.ink60,
    flex: 1,
    lineHeight: 14,
  },
  submitBtn: {
    backgroundColor: MonotoneTheme.colors.ink,
    paddingVertical: 13,
    borderRadius: MonotoneTheme.radius.sm,
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  demoBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  demoBtnText: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink60,
    fontWeight: '600',
  },
});

