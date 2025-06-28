import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  TextInput,
} from 'react-native';
import { Star, Plus, Trash2, ExternalLink, CreditCard as Edit3, Save, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoriteSearch {
  id: string;
  name: string;
  query: string;
  endpoint: string;
  url: string;
  color: string;
  icon: string;
}

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const [favorites, setFavorites] = useState<FavoriteSearch[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFavorite, setNewFavorite] = useState({
    name: '',
    query: '',
    endpoint: 'Google',
    url: 'https://www.google.com/search?q=',
    color: '#3b82f6',
    icon: '⭐',
  });

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const saved = await AsyncStorage.getItem('favoriteSearches');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (updatedFavorites: FavoriteSearch[]) => {
    try {
      await AsyncStorage.setItem('favoriteSearches', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addFavorite = async () => {
    if (!newFavorite.name.trim() || !newFavorite.query.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const favorite: FavoriteSearch = {
      id: Date.now().toString(),
      ...newFavorite,
    };

    const updated = [...favorites, favorite];
    await saveFavorites(updated);
    setIsAdding(false);
    setNewFavorite({
      name: '',
      query: '',
      endpoint: 'Google',
      url: 'https://www.google.com/search?q=',
      color: '#3b82f6',
      icon: '⭐',
    });
  };

  const deleteFavorite = (id: string) => {
    Alert.alert(
      'Delete Favorite',
      'Are you sure you want to delete this favorite search?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = favorites.filter(fav => fav.id !== id);
            await saveFavorites(updated);
          },
        },
      ]
    );
  };

  const executeSearch = async (favorite: FavoriteSearch) => {
    try {
      const searchUrl = favorite.url + encodeURIComponent(favorite.query);
      // In a real app, this would open the URL
      Alert.alert('Search', `Would open: ${searchUrl}`);
    } catch (error) {
      Alert.alert('Error', 'Could not execute search');
    }
  };

  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorite Searches</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAdding(true)}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Add New Favorite Form */}
        {isAdding && (
          <View style={styles.addForm}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Add New Favorite</Text>
              <TouchableOpacity onPress={() => setIsAdding(false)}>
                <X size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Favorite name"
              placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
              value={newFavorite.name}
              onChangeText={(text) => setNewFavorite({...newFavorite, name: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Search query"
              placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
              value={newFavorite.query}
              onChangeText={(text) => setNewFavorite({...newFavorite, query: text})}
            />
            
            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsAdding(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={addFavorite}
              >
                <Save size={16} color="#ffffff" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Favorites List */}
        {favorites.length === 0 && !isAdding ? (
          <View style={styles.emptyState}>
            <Star size={64} color={isDark ? '#4b5563' : '#d1d5db'} />
            <Text style={styles.emptyTitle}>No Favorite Searches</Text>
            <Text style={styles.emptySubtitle}>
              Save your frequently used searches for quick access
            </Text>
          </View>
        ) : (
          <View style={styles.favoritesList}>
            {favorites.map((favorite) => (
              <View key={favorite.id} style={styles.favoriteItem}>
                <TouchableOpacity
                  style={styles.favoriteContent}
                  onPress={() => executeSearch(favorite)}
                >
                  <View style={styles.favoriteHeader}>
                    <Text style={styles.favoriteIcon}>{favorite.icon}</Text>
                    <View style={styles.favoriteInfo}>
                      <Text style={styles.favoriteName}>{favorite.name}</Text>
                      <Text style={styles.favoriteQuery}>"{favorite.query}"</Text>
                    </View>
                    <ExternalLink size={16} color={isDark ? '#60a5fa' : '#3b82f6'} />
                  </View>
                  <Text style={styles.favoriteEndpoint}>{favorite.endpoint}</Text>
                </TouchableOpacity>
                
                <View style={styles.favoriteActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setEditingId(favorite.id)}
                  >
                    <Edit3 size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => deleteFavorite(favorite.id)}
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
  addButton: {
    backgroundColor: '#3b82f6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  addForm: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    margin: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#e5e7eb',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#1f2937',
  },
  input: {
    backgroundColor: isDark ? '#374151' : '#f9fafb',
    borderWidth: 1,
    borderColor: isDark ? '#4b5563' : '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 16,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: isDark ? '#4b5563' : '#d1d5db',
  },
  cancelButtonText: {
    color: isDark ? '#9ca3af' : '#6b7280',
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    marginLeft: 8,
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
  favoritesList: {
    paddingHorizontal: 24,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#e5e7eb',
    overflow: 'hidden',
  },
  favoriteContent: {
    flex: 1,
    padding: 16,
  },
  favoriteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  favoriteIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 2,
  },
  favoriteQuery: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    fontStyle: 'italic',
  },
  favoriteEndpoint: {
    fontSize: 12,
    color: isDark ? '#60a5fa' : '#3b82f6',
    fontWeight: '500',
  },
  favoriteActions: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: isDark ? '#374151' : '#f9fafb',
  },
  actionButton: {
    padding: 8,
    marginVertical: 4,
  },
});