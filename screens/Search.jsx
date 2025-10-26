import React, { useState,useRef,useEffect,useCallback } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { COLORS } from "../style/theme";
import { Suggestions } from "./Global";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from '@react-navigation/native';

const Search = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const inputRef = useRef(null);

 useFocusEffect(
  React.useCallback(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 500);
    return () => clearTimeout(timer);
  }, [])
);

// useFocusEffect(
//   useCallback(() => {
//     const timer = setTimeout(() => {
//       inputRef.current?.focus();
//     }, 300); // Adjust delay if needed
//     return () => clearTimeout(timer);
//   }, [])
// );


  const handleSearchSubmit = () => {
    if (searchQuery.trim().length > 0) {
      if (!searchHistory.includes(searchQuery.trim())) {
        setSearchHistory((prevHistory) => [searchQuery.trim(), ...prevHistory]);
      }
      navigation.navigate('SearchResults', { searchTerm: searchQuery.trim() });
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
    { text: "Foods", icon: "fast-food" },
    { text: "Handmade Bags", icon: "bag-handle" },
    { text: "Local Products", icon: "location" },
    { text: "Artisan Crafts", icon: "brush" },
    { text: "Philippine Delicacies", icon: "restaurant" }
  ];

  const categories = [
    { name: "Local", icon: "location" },
    { name: "Popular", icon: "star" },
    { name: "Handmade", icon: "brush" },
    { name: "Food", icon: "fast-food" }
  ];

  const handleSuggestionPress = (text) => {
    setSearchQuery(text);
    navigation.navigate('SearchResults', { searchTerm: text });
  };

  const renderSection = () => {
    if (searchQuery.length > 0) return null;

    return (
      <>
        {/* Search Suggestions */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.sectionTitle}>Trending Searches</Text>
          <FlatList
            data={suggestions}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item.text)}
              >
                <View style={styles.suggestionIcon}>
                  <Ionicons name={item.icon} size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.suggestionText}>{item.text}</Text>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Recent Searches */}
        {searchHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearSearchHistory}>
                <Text style={styles.clearText}>Clear all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={searchHistory}
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <Ionicons 
                    name="time" 
                    size={16} 
                    color={COLORS.primary} 
                    style={styles.historyIcon}
                  />
                  <Text style={styles.historyText}>{item}</Text>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => removeSearchItem(item)}
                  >
                    <Ionicons name="close" size={16} color="#999" />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.categoryContainer}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.categoryItem}
                onPress={() => handleSuggestionPress(item.name)}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name={item.icon} size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <Animated.View 
        style={[
          styles.searchContainer,
          isFocused && styles.searchContainerFocused,
          {
            shadowColor: isFocused ? COLORS.primary : '#E3E3E3',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isFocused ? 0.2 : 0.1,
            shadowRadius: isFocused ? 8 : 4,
            elevation: isFocused ? 8 : 4,
          }
        ]}
      >
        <View style={styles.searchInputContainer}>
          <FontAwesome 
            name="search" 
            size={18} 
            color={isFocused ? COLORS.primary : '#999'} 
            style={styles.searchIcon}
          />
          <TextInput
            ref={inputRef}
            placeholder="Search products..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <TouchableOpacity 
            style={styles.cameraButton}
            onPress={animateButton}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="scan-outline" 
              size={22} 
              color={isFocused ? COLORS.primary : '#999'} 
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Main Content */}
      <FlatList
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        data={[1]} // Single item to trigger render
        keyExtractor={() => "main-content"}
        renderItem={() => (
          <>
            {renderSection()}
            {/* Suggestions Component */}
            <View style={{ marginTop: 16 }}>
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
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 14,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
  },
  searchContainerFocused: {
    borderColor: COLORS.primary,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 0,
  },
  cameraButton: {
    padding: 6,
    marginLeft: 6,
  },
  suggestionsContainer: {
    marginBottom: 18,
  },
  suggestionsList: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  suggestionIcon: {
    backgroundColor: '#f0f7ff',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  historyContainer: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  clearText: {
    color: COLORS.primary,
    fontSize: 13,
  },
  historyList: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  historyIcon: {
    marginRight: 10,
  },
  historyText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  deleteButton: {
    padding: 4,
  },
  section: {
    marginBottom: 18,
  },
  categoryContainer: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryItem: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryIcon: {
    backgroundColor: '#f0f7ff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryText: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Search;