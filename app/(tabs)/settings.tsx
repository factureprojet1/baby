import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { Settings as SettingsIcon, Save } from 'lucide-react-native';
import { useFeeding } from '@/context/FeedingContext';
import { Settings } from '@/types/feeding';

export default function SettingsScreen() {
  const { settings, updateSettings } = useFeeding();

  const [babyName, setBabyName] = useState(settings.babyName);
  const [babyBirthDate, setBabyBirthDate] = useState(() => {
    const date = new Date(settings.babyBirthDate);
    return date.toISOString().split('T')[0];
  });
  const [intervalOption, setIntervalOption] = useState<'90' | '120' | '180' | 'custom'>(() => {
    if (settings.intervalMinutes === 90) return '90';
    if (settings.intervalMinutes === 120) return '120';
    if (settings.intervalMinutes === 180) return '180';
    return 'custom';
  });
  const [customInterval, setCustomInterval] = useState(
    [90, 120, 180].includes(settings.intervalMinutes) ? '' : settings.intervalMinutes.toString()
  );
  const [nightNotifications, setNightNotifications] = useState(settings.nightNotificationsEnabled);

  const handleSave = async () => {
    if (!babyName.trim()) {
      Alert.alert('Error', 'Please enter baby name');
      return;
    }

    if (!babyBirthDate) {
      Alert.alert('Error', 'Please enter birth date');
      return;
    }

    let finalInterval: number;
    if (intervalOption === 'custom') {
      const parsed = parseInt(customInterval, 10);
      if (isNaN(parsed) || parsed <= 0) {
        Alert.alert('Error', 'Please enter a valid custom interval');
        return;
      }
      finalInterval = parsed;
    } else {
      finalInterval = parseInt(intervalOption, 10);
    }

    const newSettings: Settings = {
      babyName: babyName.trim(),
      babyBirthDate: new Date(babyBirthDate).toISOString(),
      intervalMinutes: finalInterval,
      nightNotificationsEnabled: nightNotifications,
    };

    await updateSettings(newSettings);
    Alert.alert('Success', 'Settings saved successfully');
  };

  const handleIntervalChange = (option: '90' | '120' | '180' | 'custom') => {
    setIntervalOption(option);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <SettingsIcon size={32} color="#A0D8B3" strokeWidth={2.5} />
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Baby Profile</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Baby Name</Text>
          <TextInput
            style={styles.input}
            value={babyName}
            onChangeText={setBabyName}
            placeholder="Enter baby name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            value={babyBirthDate}
            onChangeText={setBabyBirthDate}
            placeholder="YYYY-MM-DD"
          />
          <Text style={styles.hint}>Format: YYYY-MM-DD</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feeding Interval</Text>

        <TouchableOpacity
          style={[styles.radioOption, intervalOption === '90' && styles.radioOptionActive]}
          onPress={() => handleIntervalChange('90')}
        >
          <View style={styles.radioCircle}>
            {intervalOption === '90' && <View style={styles.radioCircleInner} />}
          </View>
          <Text style={styles.radioText}>1 hour 30 minutes (90 min)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.radioOption, intervalOption === '120' && styles.radioOptionActive]}
          onPress={() => handleIntervalChange('120')}
        >
          <View style={styles.radioCircle}>
            {intervalOption === '120' && <View style={styles.radioCircleInner} />}
          </View>
          <Text style={styles.radioText}>2 hours (120 min)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.radioOption, intervalOption === '180' && styles.radioOptionActive]}
          onPress={() => handleIntervalChange('180')}
        >
          <View style={styles.radioCircle}>
            {intervalOption === '180' && <View style={styles.radioCircleInner} />}
          </View>
          <Text style={styles.radioText}>3 hours (180 min)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.radioOption, intervalOption === 'custom' && styles.radioOptionActive]}
          onPress={() => handleIntervalChange('custom')}
        >
          <View style={styles.radioCircle}>
            {intervalOption === 'custom' && <View style={styles.radioCircleInner} />}
          </View>
          <Text style={styles.radioText}>Custom</Text>
        </TouchableOpacity>

        {intervalOption === 'custom' && (
          <View style={styles.customInputContainer}>
            <TextInput
              style={styles.customInput}
              value={customInterval}
              onChangeText={setCustomInterval}
              placeholder="150"
              keyboardType="numeric"
            />
            <Text style={styles.customInputLabel}>minutes</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabel}>
            <Text style={styles.switchText}>Night Notifications</Text>
            <Text style={styles.switchSubtext}>
              {nightNotifications
                ? 'Notifications enabled 24/7'
                : 'No notifications between 11 PM - 7 AM'}
            </Text>
          </View>
          <Switch
            value={nightNotifications}
            onValueChange={setNightNotifications}
            trackColor={{ false: '#CBD5E0', true: '#A0D8B3' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Save size={24} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2D3748',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2D3748',
  },
  hint: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 4,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F7FAFC',
  },
  radioOptionActive: {
    backgroundColor: '#E6F7EF',
    borderWidth: 2,
    borderColor: '#A0D8B3',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#A0D8B3',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#A0D8B3',
  },
  radioText: {
    fontSize: 16,
    color: '#2D3748',
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 36,
  },
  customInput: {
    backgroundColor: '#F7FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2D3748',
    minWidth: 80,
    marginRight: 12,
  },
  customInputLabel: {
    fontSize: 16,
    color: '#718096',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    flex: 1,
  },
  switchText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  switchSubtext: {
    fontSize: 14,
    color: '#718096',
  },
  saveButton: {
    backgroundColor: '#A0D8B3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 16,
    gap: 12,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22543D',
  },
});
