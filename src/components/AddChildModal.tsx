import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { X, Plus, User } from 'lucide-react-native';
import { SketchUsers } from './SketchIcons';
import { MonotoneTheme } from '../constants/theme';

interface AddChildModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddChildModal: React.FC<AddChildModalProps> = ({
  visible,
  onClose,
}) => {
  const { addChild } = useApp();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [club, setClub] = useState('');
  const [allergies, setAllergies] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Name Required', "Please enter your child's name.");
      return;
    }

    const ageNum = parseInt(age, 10) || 7;
    const clubsList = club.trim()
      ? club.split(',').map((c) => c.trim())
      : ['Summer Holiday Days Out'];

    addChild({
      name: name.trim(),
      age: ageNum,
      color: '#111111',
      avatarBg: '#F1F5F9',
      allergies: allergies.trim() || 'None',
      clubs: clubsList,
    });

    Alert.alert('Child Profile Added! 👶', `${name.trim()} has been added to your family.`);
    setName('');
    setAge('');
    setClub('');
    setAllergies('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <SketchUsers size={20} color={MonotoneTheme.colors.ink} />
              <Text style={styles.title}>ADD CHILD PROFILE</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color={MonotoneTheme.colors.ink80} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Child's Full Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Jack Foster"
                placeholderTextColor={MonotoneTheme.colors.ink40}
              />
            </View>

            {/* Age */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age / School Year</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="e.g. 8"
                keyboardType="numeric"
                placeholderTextColor={MonotoneTheme.colors.ink40}
              />
            </View>

            {/* Enrolled Clubs */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enrolled Clubs & Activities (Comma separated)</Text>
              <TextInput
                style={styles.input}
                value={club}
                onChangeText={setClub}
                placeholder="e.g. Football Club, Summer Days Out"
                placeholderTextColor={MonotoneTheme.colors.ink40}
              />
            </View>

            {/* Allergies / Medical */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Allergies or Medical Notes (Optional)</Text>
              <TextInput
                style={styles.input}
                value={allergies}
                onChangeText={setAllergies}
                placeholder="e.g. Carry inhaler, peanut allergy"
                placeholderTextColor={MonotoneTheme.colors.ink40}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>Save Child Profile</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  sheet: {
    backgroundColor: MonotoneTheme.colors.surface,
    borderRadius: MonotoneTheme.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: MonotoneTheme.colors.ink,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    gap: 12,
  },
  inputGroup: {
    gap: 5,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: MonotoneTheme.colors.ink80,
  },
  input: {
    backgroundColor: MonotoneTheme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: MonotoneTheme.colors.border,
    borderRadius: MonotoneTheme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: MonotoneTheme.colors.ink,
  },
  saveBtn: {
    backgroundColor: MonotoneTheme.colors.ink,
    paddingVertical: 12,
    borderRadius: MonotoneTheme.radius.sm,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
