import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Linking,
  Alert,
} from 'react-native';
import { Search, ChevronDown, ExternalLink, Star } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchEndpoint {
  id: string;
  name: string;
  icon: string;
  url: string;
  enabled: boolean;
  color: string;
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

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<SearchEndpoint>(defaultEndpoints[0]);
  const [showEndpoints, setShowEndpoints] = useState(false);
  const [endpoints, setEndpoints] = useState<SearchEndpoint[]>(defaultEndpoints);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadSettings();
    loadRecentSearches();
  }, []);

  const loadSettings = async () => {
    try {
      const savedEndpoints = await AsyncStorage.getItem('searchEndpoints');
      if (savedEndpoints) {
        const parsed = JSON.parse(savedEndpoints);
        setEndpoints(parsed);
        const enabledEndpoints = parsed.filter((ep: SearchEndpoint) => ep.enabled);
        if (enabledEndpoints.length > 0) {
          setSelectedEndpoint(enabledEndpoints[0]);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    try {
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
      setRecentSearches(updated);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const searchUrl = selectedEndpoint.url + encodeURIComponent(searchQuery.trim());
    
    try {
      await Linking.openURL(searchUrl);
      await saveRecentSearch(searchQuery.trim());
      setSearchQuery('');
    } catch (error) {
      Alert.alert('Error', 'Could not open the search URL');
    }
  };

  const selectEndpoint = (endpoint: SearchEndpoint) => {
    setSelectedEndpoint(endpoint);
    setShowEndpoints(false);
  };

  const enabledEndpoints = endpoints.filter(ep => ep.enabled);

  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Ekagra</Text>
          <Text style={styles.subtitle}>Search without any distractions</Text>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          {/* Endpoint Selector */}
          <TouchableOpacity
            style={styles.endpointSelector}
            onPress={() => setShowEndpoints(!showEndpoints)}
          >
            <View style={styles.endpointInfo}>
              <Text style={styles.endpointIcon}>{selectedEndpoint.icon}</Text>
              <Text style={styles.endpointName}>{selectedEndpoint.name}</Text>
            </View>
            <ChevronDown 
              size={20} 
              color={isDark ? '#9ca3af' : '#6b7280'} 
              style={{ transform: [{ rotate: showEndpoints ? '180deg' : '0deg' }] }}
            />
          </TouchableOpacity>

          {/* Endpoint Dropdown */}
          {showEndpoints && (
            <View style={styles.endpointDropdown}>
              {enabledEndpoints.map((endpoint) => (
                <TouchableOpacity
                  key={endpoint.id}
                  style={[
                    styles.endpointOption,
                    selectedEndpoint.id === endpoint.id && styles.selectedEndpointOption
                  ]}
                  onPress={() => selectEndpoint(endpoint)}
                >
                  <Text style={styles.endpointIcon}>{endpoint.icon}</Text>
                  <Text style={styles.endpointOptionText}>{endpoint.name}</Text>
                  {selectedEndpoint.id === endpoint.id && (
                    <Star size={16} color={endpoint.color} fill={endpoint.color} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Search Input */}
          <View style={styles.searchInputContainer}>
            <Search size={20} color={isDark ? '#9ca3af' : '#6b7280'} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search on ${selectedEndpoint.name}...`}
              placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <ExternalLink size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsList}>
            {enabledEndpoints.slice(0, 6).map((endpoint) => (
              <TouchableOpacity
                key={endpoint.id}
                style={[styles.quickActionItem, { borderColor: endpoint.color }]}
                onPress={() => selectEndpoint(endpoint)}
              >
                <Text style={styles.quickActionIcon}>{endpoint.icon}</Text>
                <Text style={styles.quickActionText}>{endpoint.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {recentSearches.slice(0, 5).map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                onPress={() => setSearchQuery(search)}
              >
                <Search size={16} color={isDark ? '#6b7280' : '#9ca3af'} />
                <Text style={styles.recentText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#0f0f0f' : '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
  },
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  endpointSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#e5e7eb',
  },
  endpointInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  endpointIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  endpointName: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#1f2937',
  },
  endpointDropdown: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#e5e7eb',
    overflow: 'hidden',
  },
  endpointOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#f3f4f6',
  },
  selectedEndpointOption: {
    backgroundColor: isDark ? '#374151' : '#f8fafc',
  },
  endpointOptionText: {
    fontSize: 16,
    color: isDark ? '#ffffff' : '#1f2937',
    marginLeft: 12,
    flex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: isDark ? '#374151' : '#e5e7eb',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: isDark ? '#ffffff' : '#1f2937',
    paddingVertical: 16,
  },
  searchButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 16,
  },
  quickActionsList: {
    flexDirection: 'row',
  },
  quickActionItem: {
    alignItems: 'center',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    minWidth: 80,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: isDark ? '#ffffff' : '#1f2937',
    textAlign: 'center',
  },
  recentSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#e5e7eb',
  },
  recentText: {
    fontSize: 16,
    color: isDark ? '#ffffff' : '#1f2937',
    marginLeft: 12,
  },
});