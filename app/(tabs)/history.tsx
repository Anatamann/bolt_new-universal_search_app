import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
} from 'react-native';
import { Search, Trash2, ExternalLink, Clock } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchHistoryItem {
  id: string;
  query: string;
  endpoint: string;
  timestamp: number;
  url: string;
}

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem('searchHistory');
      if (saved) {
        setSearchHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all search history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('searchHistory');
              setSearchHistory([]);
            } catch (error) {
              console.error('Error clearing history:', error);
            }
          },
        },
      ]
    );
  };

  const deleteHistoryItem = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Remove this item from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updated = searchHistory.filter(item => item.id !== id);
              setSearchHistory(updated);
              await AsyncStorage.setItem('searchHistory', JSON.stringify(updated));
            } catch (error) {
              console.error('Error deleting history item:', error);
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search History</Text>
        {searchHistory.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
            <Trash2 size={20} color="#ef4444" />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {searchHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={64} color={isDark ? '#4b5563' : '#d1d5db'} />
            <Text style={styles.emptyTitle}>No Search History</Text>
            <Text style={styles.emptySubtitle}>
              Your search history will appear here as you use the app
            </Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {searchHistory.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyContent}>
                  <View style={styles.historyHeader}>
                    <Search size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                    <Text style={styles.historyQuery}>{item.query}</Text>
                  </View>
                  <View style={styles.historyMeta}>
                    <Text style={styles.historyEndpoint}>{item.endpoint}</Text>
                    <Text style={styles.historyTime}>{formatDate(item.timestamp)}</Text>
                  </View>
                </View>
                <View style={styles.historyActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {/* Re-open search */}}
                  >
                    <ExternalLink size={16} color={isDark ? '#60a5fa' : '#3b82f6'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => deleteHistoryItem(item.id)}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
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
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  clearButtonText: {
    color: '#ef4444',
    marginLeft: 8,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  historyList: {
    paddingHorizontal: 24,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#e5e7eb',
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyQuery: {
    fontSize: 16,
    fontWeight: '500',
    color: isDark ? '#ffffff' : '#1f2937',
    marginLeft: 8,
    flex: 1,
  },
  historyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyEndpoint: {
    fontSize: 14,
    color: isDark ? '#60a5fa' : '#3b82f6',
    fontWeight: '500',
  },
  historyTime: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  historyActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});