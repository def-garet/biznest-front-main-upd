import React, { useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import StaticProductStyle from "./StaticProductStyle"; // adjust path if needed

const HomeProductsInfinite = ({ products, fetchMore, refreshing }) => {
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    await fetchMore();
    setLoadingMore(false);
  };

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      renderItem={({ item }) => <StaticProductStyle data={[item]} />}
      numColumns={2}
      contentContainerStyle={{ padding: 10 }}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator style={styles.loader} size="large" color="#2563eb" />
        ) : null
      }
      refreshing={refreshing}
    />
  );
};

const styles = StyleSheet.create({
  loader: { marginVertical: 20 },
});

export default HomeProductsInfinite;
