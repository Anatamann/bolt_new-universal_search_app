import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  useColorScheme,
  Alert,
  TextInput,
} from 'react-native';
import { Settings as SettingsIcon, Plus, Trash2, CreditCard as Edit3, Save, X, Globe } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchEndpoint {
  id: string;
  name: string;
  icon: string;
  url: string;
  enabled: boolean;
  color: string;
  isCustom?: boolean;
}

const defaultEndpoints: SearchEndpoint[] = [
  {
    id: 'google',
    name: 'Google',
    icon: '🔍',
    url: 'https://www.google.com/search?q=',
    enabled: true,
    color: '#4285f4',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    url: 'https://www.youtube.com/results?search_query=',
    enabled: true,
    color: '#ff0000',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '🤖',
    url: 'https://chat.openai.com/?q=',
    enabled: true,
    color: '#10a37f',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '💻',
    url: 'https://github.com/search?q=',
    enabled: true,
    color: '#333333',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: '🔴',
    url: 'https://www.reddit.com/search/?q=',
    enabled: true,
    color: '#ff4500',
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    icon: '📚',
    url: 'https://stackoverflow.com/search?q=',
    enabled: true,
    color: '#f48024',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: '🐦',
    url: 'https://twitter.com/search?q=',
    enabled: true,
    color: '#1da1f2',
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    icon: '📖',
    url: 'https://en.wikipedia.org/wiki/Special:Search?search=',
    enabled: true,
    color: '#000000',
  },
];

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [endpoints, setEndpoints] = useState<SearchEndpoint[]>(defaultEndpoints);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newEndpoint, setNewEndpoint] = useState({
    name: '',
    icon: '🌐',
    url: '',
    color: '#3b82f6',
  });

  const isDark = colorScheme === 'dark';

  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('searchEndpoints');
      if (saved) {
        setEndpoints(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (updatedEndpoints: SearchEndpoint[]) => {
    try {
      await AsyncStorage.setItem('searchEndpoints', JSON.stringify(updatedEndpoints));
      setEndpoints(updatedEndpoints);
      // Force reload from storage to ensure UI consistency
      await loadSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleEndpoint = async (id: string) => {
    const updated = endpoints.map(endpoint =>
      endpoint.id === id ? { ...endpoint, enabled: !endpoint.enabled } : endpoint
    );
    await saveSettings(updated);
  };

  const addCustomEndpoint = async () => {
    if (!newEndpoint.name.trim() || !newEndpoint.url.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!newEndpoint.url.includes('://')) {
      Alert.alert('Error', 'Please enter a valid URL (including http:// or https://)');
      return;
    }

    const endpoint: SearchEndpoint = {
      id: Date.now().toString(),
      ...newEndpoint,
      enabled: true,
      isCustom: true,
    };

    const updated = [...endpoints, endpoint];
    await saveSettings(updated);
    setIsAddingCustom(false);
    setNewEndpoint({
      name: '',
      icon: '🌐',
      url: '',
      color: '#3b82f6',
    });
  };

  const deleteCustomEndpoint = (id: string) => {
    Alert.alert(
      'Delete Endpoint',
      'Are you sure you want to delete this custom search endpoint?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = endpoints.filter(endpoint => endpoint.id !== id);
            await saveSettings(updated);
          },
        },
      ]
    );
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all search endpoints to their default settings. Custom endpoints will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await saveSettings(defaultEndpoints);
          },
        },
      ]
    );
  };

  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity style={styles.resetButton} onPress={resetToDefaults}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Endpoints Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Search Endpoints</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAddingCustom(true)}
            >
              <Plus size={16} color="#ffffff" />
              <Text style={styles.addButtonText}>Add Custom</Text>
            </TouchableOpacity>
          </View>

          {/* Add Custom Endpoint Form */}
          {isAddingCustom && (
            <View style={styles.addForm}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Add Custom Endpoint</Text>
                <TouchableOpacity onPress={() => setIsAddingCustom(false)}>
                  <X size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.input}
                placeholder="Endpoint name (e.g., DuckDuckGo)"
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                value={newEndpoint.name}
                onChangeText={(text) => setNewEndpoint({...newEndpoint, name: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Search URL (e.g., https://duckduckgo.com/?q=)"
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                value={newEndpoint.url}
                onChangeText={(text) => setNewEndpoint({...newEndpoint, url: text})}
              />
              
              <Text style={styles.helpText}>
                💡 The URL should end with the search parameter (e.g., ?q= or ?search=)
              </Text>
              
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsAddingCustom(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={addCustomEndpoint}
                >
                  <Save size={16} color="#ffffff" />
                  <Text style={styles.saveButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Endpoints List */}
          <View style={styles.endpointsList}>
            {endpoints.map((endpoint) => (
              <View key={endpoint.id} style={styles.endpointItem}>
                <View style={styles.endpointInfo}>
                  <Text style={styles.endpointIcon}>{endpoint.icon}</Text>
                  <View style={styles.endpointDetails}>
                    <Text style={styles.endpointName}>{endpoint.name}</Text>
                    <Text style={styles.endpointUrl} numberOfLines={1}>
                      {endpoint.url}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.endpointActions}>
                  {endpoint.isCustom && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteCustomEndpoint(endpoint.id)}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                  <Switch
                    value={endpoint.enabled}
                    onValueChange={() => toggleEndpoint(endpoint.id)}
                    trackColor={{ false: isDark ? '#374151' : '#d1d5db', true: '#60a5fa' }}
                    thumbColor={endpoint.enabled ? '#ffffff' : '#f4f3f4'}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoCard}>
            <Globe size={24} color={isDark ? '#60a5fa' : '#3b82f6'} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Universal Search</Text>
              <Text style={styles.infoDescription}>
                Search across multiple platforms from one unified interface. 
                Customize your search endpoints and save your favorite searches.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#0f0f0f' : '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: isDark ? '#ffffff' : '#1f2937',
  },
  resetButton: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  resetButtonText: {
    color: '#ef4444',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#1f2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  addForm: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#e5e7eb',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#1f2937',
  },
  input: {
    backgroundColor: isDark ? '#374151' : '#f9fafb',
    borderWidth: 1,
    borderColor: isDark ? '#4b5563' : '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 16,
    lineHeight: 16,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: isDark ? '#4b5563' : '#d1d5db',
  },
  cancelButtonText: {
    color: isDark ? '#9ca3af' : '#6b7280',
    fontWeight: '500',
    fontSize: 14,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    marginLeft: 6,
    fontSize: 14,
  },
  endpointsList: {
    gap: 12,
  },
  endpointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#e5e7eb',
  },
  endpointInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  endpointIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  endpointDetails: {
    flex: 1,
  },
  endpointName: {
    fontSize: 16,
    fontWeight: '500',
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 2,
  },
  endpointUrl: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  endpointActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    padding: 4,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#e5e7eb',
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    lineHeight: 20,
  },
});