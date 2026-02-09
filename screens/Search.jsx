import React, { useState, useRef, useCallback } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  FlatList,
  StatusBar,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Suggestions } from "./Global"; 

// Your Custom Palette
const COLORS = {
  primary: '#172d55',    // Deep Blue - Headings
  secondary: '#2196f3',  // Bright Blue - Icons/Accents
  background: '#ffffff', // Pure White
  text: '#808080',       // Gray - Body text
  
  // UI Helpers derived from your palette
  surface: '#ffffff',    
  border: '#f0f0f0',     
  inputBg: '#f8f9fa',    
  danger: '#ff4444',
};

const Search = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const inputRef = useRef(null);

  // Auto-focus logic (Optional)
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        // inputRef.current?.focus(); 
      }, 500);
      return () => clearTimeout(timer);
    }, [])
  );

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length > 0) {
      const term = searchQuery.trim();
      if (!searchHistory.includes(term)) {
        setSearchHistory((prevHistory) => [term, ...prevHistory].slice(0, 5));
      }
      navigation.navigate('SearchResults', { searchTerm: term });
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const removeSearchItem = (itemToRemove) => {
    setSearchHistory(prevHistory => 
      prevHistory.filter(item => item !== itemToRemove)
    );
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      })
    ]).start(handleSearchSubmit);
  };

  const suggestions = [
    { text: "Foods", icon: "fast-food-outline" },
    { text: "Handmade Bags", icon: "bag-handle-outline" },
    { text: "Local Products", icon: "location-outline" },
    { text: "Artisan Crafts", icon: "brush-outline" },
    { text: "Philippine Delicacies", icon: "restaurant-outline" }
  ];

  const categories = [
    { name: "Local", icon: "location-sharp" },
    { name: "Popular", icon: "star" },
    { name: "Handmade", icon: "brush" },
    { name: "Food", icon: "fast-food" }
  ];

  const handleSuggestionPress = (text) => {
    setSearchQuery(text);
    navigation.navigate('SearchResults', { searchTerm: text });
  };

  // --- Render Sections ---

  const renderSection = () => {
    if (searchQuery.length > 0) return null;

    return (
      <View style={styles.contentContainer}>
        
        {/* Recent Searches */}
        {searchHistory.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearSearchHistory}>
                <Text style={styles.clearText}>Clear all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.historyList}>
              {searchHistory.map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <TouchableOpacity 
                    style={styles.historyContent} 
                    onPress={() => handleSuggestionPress(item)}
                  >
                    <Feather name="clock" size={16} color={COLORS.text} style={styles.historyIcon} />
                    <Text style={styles.historyText}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => removeSearchItem(item)}
                  >
                    <Feather name="x" size={16} color={COLORS.text} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Trending Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <View style={styles.suggestionsList}>
            {suggestions.map((item, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item.text)}
              >
                <View style={styles.suggestionIconBox}>
                  <Ionicons name={item.icon} size={18} color={COLORS.secondary} />
                </View>
                <Text style={styles.suggestionText}>{item.text}</Text>
                <Feather name="arrow-up-right" size={16} color={COLORS.text} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categories Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <View style={styles.categoryGrid}>
            {categories.map((item, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.categoryCard}
                onPress={() => handleSuggestionPress(item.name)}
              >
                <View style={styles.categoryIconBox}>
                  <Ionicons name={item.icon} size={22} color={COLORS.primary} />
                </View>
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Search Header */}
      <View style={styles.header}>
        <Animated.View 
          style={[
            styles.searchBar,
            isFocused && styles.searchBarFocused,
          ]}
        >
          <Feather name="search" size={20} color={isFocused ? COLORS.secondary : COLORS.text} style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            placeholder="Search products, shops..."
            placeholderTextColor={COLORS.text}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
               <Feather name="x-circle" size={18} color={COLORS.text} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Scan/Action Button */}
        <Animated.View style={{ transform: [{ scale: scaleValue }], marginLeft: 12 }}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={animateButton}
            activeOpacity={0.8}
          >
            <Ionicons name="scan" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Main Content */}
      <FlatList
        data={[1]} // Single item to trigger render of body
        keyExtractor={() => "main-content"}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={() => (
          <>
            {renderSection()}
            {/* Global Suggestions Component (Preserved) */}
            <View style={styles.globalSuggestions}>
              <Suggestions />
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchBarFocused: {
    borderColor: COLORS.secondary,
    backgroundColor: '#FFFFFF',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.primary,
    height: '100%',
  },
  actionButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Content
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  clearText: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: '600',
  },

  // History List
  historyList: {
    backgroundColor: COLORS.background,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    marginRight: 12,
  },
  historyText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  deleteButton: {
    padding: 4,
  },

  // Suggestions List
  suggestionsList: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  suggestionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD', // Very light blue based on your secondary
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },

  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    // Subtle shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIconBox: {
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Global Footer
  globalSuggestions: {
    marginTop: 0,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
});

export default Search;