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
} from '../components/SketchIcons';
import { User, Phone, Mail, Plus, Sparkles, ShieldCheck } from 'lucide-react-native';
import { MonotoneTheme } from '../constants/theme';

export const AuthOnboardingScreen: React.FC = () => {
  const { registerParent } = useApp();

  // Parent State
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentWorkEmail, setParentWorkEmail] = useState('');

  // Child State
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childClubs, setChildClubs] = useState('Summer Holiday Days Out');
  const [childAllergies, setChildAllergies] = useState('');

  // Second Child (Optional)
  const [hasSecondChild, setHasSecondChild] = useState(false);
  const [child2Name, setChild2Name] = useState('');
  const [child2Age, setChild2Age] = useState('');
  const [child2Clubs, setChild2Clubs] = useState('Summer Holiday Days Out');
  const [child2Allergies, setChild2Allergies] = useState('');

  const handleCompleteRegistration = () => {
    if (!parentName.trim()) {
      Alert.alert('Parent Name Required', 'Please enter your full name.');
      return;
    }
    if (!parentPhone.trim()) {
      Alert.alert('Phone Number Required', 'Please enter your mobile phone number for carpools.');
      return;
    }
    if (!parentEmail.trim()) {
      Alert.alert('Email Required', 'Please enter your email address for calendar invites.');
      return;
    }

    // Build children array
    const kids = [];
    if (childName.trim()) {
      kids.push({
        name: childName.trim(),
        age: parseInt(childAge, 10) || 8,
        color: '#111111',
        avatarBg: '#F1F5F9',
        allergies: childAllergies.trim() || 'None',
        clubs: childClubs.split(',').map((c) => c.trim()).filter(Boolean),
      });
    } else {
      // Default child if left empty
      kids.push({
        name: `${parentName.split(' ')[0]}'s Child`,
        age: 8,
        color: '#111111',
        avatarBg: '#F1F5F9',
        allergies: 'None',
        clubs: ['Summer Holiday Days Out'],
      });
    }

    if (hasSecondChild && child2Name.trim()) {
      kids.push({
        name: child2Name.trim(),
        age: parseInt(child2Age, 10) || 6,
        color: '#111111',
        avatarBg: '#F1F5F9',
        allergies: child2Allergies.trim() || 'None',
        clubs: child2Clubs.split(',').map((c) => c.trim()).filter(Boolean),
      });
    }

    registerParent(
      {
        name: parentName.trim(),
        phone: parentPhone.trim(),
        email: parentEmail.trim(),
        workEmail: parentWorkEmail.trim(),
      },
      kids
    );

    Alert.alert(
      'Welcome to KidSync! 🎉',
      `Welcome, ${parentName.split(' ')[0]}! Your family profile is registered and ready.`
    );
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
          clubs: ['West End U10 Strikers', 'Summer Activity Circle'],
        },
        {
          name: 'Mia Foster',
          age: 7,
          color: '#111111',
          avatarBg: '#F1F5F9',
          allergies: 'None',
          clubs: ['Prima Ballet Academy', 'Summer Activity Circle'],
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
      {/* Header Banner */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <SketchCalendar size={32} color={MonotoneTheme.colors.ink} />
        </View>
        <Text style={styles.headerTitle}>PARENT REGISTRATION</Text>
        <Text style={styles.headerSubtitle}>
          Set up your parent profile and add your children to coordinate clubs, activities & carpools.
        </Text>
      </View>

      {/* STEP 1: Parent Details */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <User size={18} color={MonotoneTheme.colors.ink} />
          <Text style={styles.cardTitle}>1. Parent Details</Text>
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
          <Text style={styles.inputLabel}>Mobile Phone Number * (for carpools)</Text>
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
          <Text style={styles.inputLabel}>Personal Email * (for calendar sync)</Text>
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

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Work Email (Optional for Outlook sync)</Text>
          <TextInput
            style={styles.input}
            value={parentWorkEmail}
            onChangeText={setParentWorkEmail}
            placeholder="e.g. sarah.jenkins@company.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={MonotoneTheme.colors.ink40}
          />
        </View>
      </View>

      {/* STEP 2: Add Child Profile */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <SketchUsers size={18} color={MonotoneTheme.colors.ink} />
          <Text style={styles.cardTitle}>2. Add Child Profile</Text>
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
            placeholder="e.g. 9"
            keyboardType="numeric"
            placeholderTextColor={MonotoneTheme.colors.ink40}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Activities / Clubs (Comma separated)</Text>
          <TextInput
            style={styles.input}
            value={childClubs}
            onChangeText={setChildClubs}
            placeholder="e.g. Football, Summer Days Out"
            placeholderTextColor={MonotoneTheme.colors.ink40}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Allergies or Medical Notes (Optional)</Text>
          <TextInput
            style={styles.input}
            value={childAllergies}
            onChangeText={setChildAllergies}
            placeholder="e.g. None or Asthma inhaler in kit bag"
            placeholderTextColor={MonotoneTheme.colors.ink40}
          />
        </View>

        {/* Second Child Toggle */}
        {!hasSecondChild ? (
          <TouchableOpacity
            style={styles.addMoreKidBtn}
            onPress={() => setHasSecondChild(true)}
            activeOpacity={0.8}
          >
            <Plus size={14} color={MonotoneTheme.colors.ink} />
            <Text style={styles.addMoreKidText}>+ Add a second child</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.secondKidSection}>
            <View style={styles.divider} />
            <Text style={styles.subCardTitle}>Child 2 Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Child 2 Full Name</Text>
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
                keyboardType="numeric"
                placeholderTextColor={MonotoneTheme.colors.ink40}
              />
            </View>
          </View>
        )}
      </View>

      {/* Safety & Privacy Box */}
      <View style={styles.privacyCard}>
        <ShieldCheck size={16} color={MonotoneTheme.colors.ink80} />
        <Text style={styles.privacyText}>
          Your family details are private and only shared within club activities you join.
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleCompleteRegistration}
        activeOpacity={0.85}
      >
        <Text style={styles.submitBtnText}>Complete Registration & Enter</Text>
      </TouchableOpacity>

      {/* Quick Demo Shortcut */}
      <TouchableOpacity
        style={styles.demoBtn}
        onPress={handleQuickDemo}
        activeOpacity={0.7}
      >
        <Text style={styles.demoBtnText}>
          ⚡ Or click here to test with Richard & Kids
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
    padding: 20,
    paddingTop: 30,
    paddingBottom: 50,
    gap: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: MonotoneTheme.colors.surface,
    borderWidth: 1.5,
    borderColor: MonotoneTheme.colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    color: MonotoneTheme.colors.ink,
  },
  headerSubtitle: {
    fontSize: 12,
    color: MonotoneTheme.colors.ink60,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 290,
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
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: MonotoneTheme.colors.ink,
    letterSpacing: 0.3,
  },
  subCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink80,
    marginBottom: 8,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
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
    gap: 6,
    paddingVertical: 10,
    borderRadius: MonotoneTheme.radius.sm,
    backgroundColor: MonotoneTheme.colors.ink05,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    marginTop: 4,
  },
  addMoreKidText: {
    fontSize: 12,
    fontWeight: '700',
    color: MonotoneTheme.colors.ink,
  },
  secondKidSection: {
    gap: 10,
  },
  divider: {
    height: 1,
    backgroundColor: MonotoneTheme.colors.border,
    marginVertical: 6,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    padding: 12,
    borderRadius: MonotoneTheme.radius.md,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
  },
  privacyText: {
    fontSize: 11,
    color: MonotoneTheme.colors.ink60,
    flex: 1,
    lineHeight: 15,
  },
  submitBtn: {
    backgroundColor: MonotoneTheme.colors.ink,
    paddingVertical: 14,
    borderRadius: MonotoneTheme.radius.sm,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  demoBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  demoBtnText: {
    fontSize: 12,
    color: MonotoneTheme.colors.ink60,
    fontWeight: '600',
  },
});
