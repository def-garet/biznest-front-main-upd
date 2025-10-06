import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Animated,
  Dimensions,
  ToastAndroid,
  StyleSheet,
  TextInput,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import API_URL from "../api/api_urls";
import { ProductsTitle } from "./Global";
import axiosInstance from "../api/axiosInstance";

const PRIMARY_COLOR = "#172d55";
const SECONDARY_COLOR = "#172d55";
const LIGHT_BACKGROUND = "#f8f9fa";

const ShareModal = ({ visible, onClose, shareUrl }) => {
  const shareOptions = [
    { id: 1, name: 'WhatsApp', icon: 'whatsapp', color: '#25D366', type: FontAwesome5 },
    { id: 2, name: 'Facebook', icon: 'facebook', color: '#1877F2', type: FontAwesome5 },
    { id: 3, name: 'Twitter', icon: 'twitter', color: '#1DA1F2', type: FontAwesome5 },
    { id: 4, name: 'Instagram', icon: 'instagram', color: '#E4405F', type: FontAwesome5 },
    { id: 5, name: 'Messenger', icon: 'facebook-messenger', color: '#006AFF', type: FontAwesome5 },
    { id: 6, name: 'Telegram', icon: 'telegram', color: '#0088CC', type: FontAwesome5 },
    { id: 7, name: 'Copy Link', icon: 'content-copy', color: '#666', type: MaterialIcons },
    { id: 8, name: 'More', icon: 'more-horiz', color: '#666', type: MaterialIcons },
  ];

  const handleShare = async (platform) => {
    try {
      if (platform === 'Copy Link') {
        Alert.alert('Success', 'Link copied to clipboard!');
      } else if (platform === 'More') {
      } else {
        Alert.alert(`Sharing to ${platform}`, `URL: ${shareUrl}`);
      }
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={shareStyles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={shareStyles.modalContent}>
          <View style={shareStyles.modalHeader}>
            <Text style={shareStyles.modalTitle}>Share Link</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <Text style={shareStyles.urlText}>{shareUrl}</Text>
          
          <View style={shareStyles.shareOptionsContainer}>
            {shareOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={shareStyles.shareOption}
                onPress={() => handleShare(option.name)}
              >
                <View style={[shareStyles.iconContainer, { backgroundColor: `${option.color}20` }]}>
                  {option.type === FontAwesome5 ? (
                    <FontAwesome5 name={option.icon} size={24} color={option.color} />
                  ) : (
                    <MaterialIcons name={option.icon} size={24} color={option.color} />
                  )}
                </View>
                <Text style={shareStyles.optionText}>{option.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const ProductDetails = () => {
  const route = useRoute();
  const { product_id } = route.params;
  const [productDetails, setProductDetail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const [comments, setComments] = useState([
    // {
    //   id: 1,
    //   user: {
    //     name: "Maria Lopez",
    //     avatar: "https://randomuser.me/api/portraits/women/33.jpg"
    //   },
    //   rating: 5,
    //   comment: "Beautiful hablon tote! The quality is excellent and it's very durable. Perfect for everyday use while supporting local weavers.",
    //   created_at: "2023-05-15T10:30:00Z",
    //   images: [
    //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnmvKOl7jUcNpglSe3CJEE61OsWJ__cWiHGg&s",
    //     "https://example.com/hablon-tote-review2.jpg"
    //   ]
    // },
    // {
    //   id: 2,
    //   user: {
    //     name: "Juan Dela Cruz",
    //     avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    //   },
    //   rating: 4,
    //   comment: "The capiz wind chime is lovely and makes such a pleasant sound. It's a bit smaller than I expected but still beautiful.",
    //   created_at: "2023-04-28T14:45:00Z",
    //   images: [
    //     "https://i.pinimg.com/736x/42/8a/73/428a732af3ba8b647fb3ec32642a8065.jpg",
    //   ]
    // },
    // {
    //   id: 3,
    //   user: {
    //     name: "Sofia Reyes",
    //     avatar: "https://randomuser.me/api/portraits/women/45.jpg"
    //   },
    //   rating: 5,
    //   comment: "Authentic Ilonggo handicrafts! The patadyong skirt is well-made and the colors are vibrant. Will definitely buy again!",
    //   created_at: "2023-04-10T09:15:00Z",
    //   images: [
    //     "https://cdn11.bigcommerce.com/s-bwvh6g2ipq/images/stencil/500x659/products/330/1143/Elisha_-_PamPinay-78__27787.1656221451.jpg?c=1"
    //   ]
    // }
  ]);

  
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [commentImages, setCommentImages] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);



  const [modalVisible, setModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const nav = useNavigation();

  const width = Dimensions.get("window").width;
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, width);

  useEffect(() => {
    fetchProductDetails();
    fetchRelatedProducts();
    fetchComments();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/Product/product_api`,
        { product_id }
      );
      setProductDetail(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/Product/product_api`);
      setRelatedProducts(response.data);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const addToCart = async () => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/api/v1/Buyer%20Cart/buyer_cart`,
        {
          product_id,
          quantity,
        }
      );
      if (response.status === 200) {
        ToastAndroid.show("Item added to cart!", ToastAndroid.SHORT);
        nav.navigate("Home");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      ToastAndroid.show("Failed to add item", ToastAndroid.SHORT);
    }
  };


  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/Product Reviews/product_reviews/${product_id}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  }




  const submitComment = async () => {
    if (!newComment.trim() || rating === 0) {
      ToastAndroid.show("Please add a comment and rating", ToastAndroid.SHORT);
      return;
    }

    setIsSubmittingComment(true);
    try {
      const formData = new FormData();
      formData.append("product_id", product_id);
      formData.append("rating", rating);
      formData.append("image_name", "comment_image");// Placeholder image name
      formData.append("comment", newComment );


      commentImages.forEach((image, index) => {
        formData.append("images", {
          uri: image.uri,
          type: "image/jpeg",
          name: `comment_image_${index}.jpg`,
        });
      });

      const response = await axios.post(
        `${API_URL}/api/v1/Product%20Reviews/product_reviews/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        ToastAndroid.show("Comment submitted!", ToastAndroid.SHORT);
        setNewComment("");
        setRating(0);
        setCommentImages([]);
        setModalVisible(false);

        // console.log("Submitted review info:", review_info);
  
        // const newCommentObj = {
        //   id: comments.length + 1,
        //   user: {
        //     name: "Current User",
        //     avatar: "https://randomuser.me/api/portraits/men/1.jpg"
        //   },
        //   rating,
        //   comment: newComment,
        //   created_at: new Date().toISOString(),
        //   images: commentImages.map(img => img.uri)
        // };

        const newCommentObj = {
          id: response.data.id,
          buyer_info: {
            id: response.data.buyer_info.id,
            f_name: response.data.buyer_info.f_name,
            l_name: response.data.buyer_info.l_name,
            profile_pic: response.data.buyer_info.profile_pic,
          },
          rating: rating,
          comment: newComment,
          review_date: new Date().toISOString(),
          images: response.data.images || []
        };

        setComments([newCommentObj, ...comments]);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      ToastAndroid.show("Failed to submit comment", ToastAndroid.SHORT);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCommentImages([...commentImages, result.assets[0]]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...commentImages];
    newImages.splice(index, 1);
    setCommentImages(newImages);
  };

  const renderProductImage = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.productImage} />
    </View>
  );

  const renderDot = (_, i) => {
    let opacity = position.interpolate({
      inputRange: [i - 1, i, i + 1],
      outputRange: [0.3, 1, 0.3],
      extrapolate: "clamp",
    });
    return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Image
          source={{
            uri: item.buyer_info.profile_pic || "https://randomuser.me/api/portraits/men/1.jpg",
          }}
          style={styles.commentUserImage}
        />
        <View style={styles.commentUserInfo}>
          <Text style={styles.commentUserName}>{item.buyer_info.f_name} {item.buyer_info.l_name}</Text>
          <View style={styles.commentRating}>
            {[...Array(5)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < item.rating ? "star" : "star-outline"}
                size={16}
                color="#FFC120"
              />
            ))}
          </View>
        </View>
        <Text style={styles.commentDate}>
          {new Date(item.review_date).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.commentText}>{item.comment}</Text>
      {item.images && item.images.length > 0 && (
        <FlatList
          horizontal
          data={item.images}
          renderItem={({ item: images }) => (
            <Image source={{ uri: images.image_url }} style={styles.commentImage} />
          )}
          keyExtractor={(image, index) => index.toString()}
          contentContainerStyle={styles.commentImagesContainer}
        />
      )}
    </View>
  );

  const renderRatingStar = (index) => {
    return (
      <TouchableOpacity onPress={() => setRating(index + 1)}>
        <Ionicons
          name={index < rating ? "star" : "star-outline"}
          size={28}
          color="#FFC120"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={28} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShareModalVisible(true)}>
          <Entypo name="share-alternative" size={26} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View>
          <FlatList
            data={productDetails?.images || [productDetails?.img]}
            horizontal
            renderItem={renderProductImage}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
          />
          <View style={styles.dotsContainer}>
            {(productDetails?.images || [productDetails?.img]).map(renderDot)}
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.productName}>
            {productDetails?.name || "Loading..."}
          </Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFC120" />
            <Text style={styles.ratingText}>{productDetails?.rating}</Text>
            <Text style={styles.reviewCount}>({productDetails?.total_reviews} reviews)</Text>
            <View style={styles.separator} />
            <Text style={styles.soldText}>1.2k+ sold</Text>
          </View>

          <Text style={styles.description}>
            {productDetails?.description ||
              "High-quality local product with premium materials"}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>
              ₱{productDetails?.price || "0"}
            </Text>
            {productDetails?.originalPrice && (
              <Text style={styles.originalPrice}>
                ₱{productDetails.originalPrice}
              </Text>
            )}
            {productDetails?.discount && (
              <Text style={styles.discountTag}>
                {productDetails.discount}% OFF
              </Text>
            )}
          </View>

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color={PRIMARY_COLOR} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color={PRIMARY_COLOR} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.deliveryContainer}>
          <View style={styles.deliveryRow}>
            <MaterialIcons
              name="local-shipping"
              size={20}
              color={PRIMARY_COLOR}
            />
            <View style={styles.deliveryTextContainer}>
              <Text style={styles.deliveryTitle}>Delivery</Text>
              <Text style={styles.deliveryInfo}>Standard (3-5 days) • ₱50</Text>
            </View>
          </View>
          <View style={styles.deliveryRow}>
            <MaterialIcons name="store" size={20} color={PRIMARY_COLOR} />
            <View style={styles.deliveryTextContainer}>
              <Text style={styles.deliveryTitle}>Pickup</Text>
              <Text style={styles.deliveryInfo}>
                Available at seller's location
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sellerContainer}>
          <View style={styles.sellerHeader}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <TouchableOpacity
              onPress={() =>
                nav.navigate("ViewShop", {
                  seller_id: productDetails?.seller_info?.id,
                })
              }
            >
              <Text style={styles.viewShopText}>View Shop</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sellerInfo}>
            <Image
              source={{
                uri: productDetails?.seller_info?.userbuyer?.profile_pic ||  "https://randomuser.me/api/portraits/women/45.jpg",
              }}
              style={styles.sellerImage}
            />
            <View style={styles.sellerDetails}>
              <Text style={styles.sellerName}>{productDetails?.seller_info?.shop_name}</Text>
              <View style={styles.sellerRating}>
                <Ionicons name="star" size={16} color="#FFC120" />
                <Text style={styles.sellerRatingText}>{productDetails?.rating} ({productDetails?.total_rating} ratings)</Text>
              </View>
              <Text style={styles.sellerLocation}>
                {/* Location */}
                  {productDetails?.seller_info?.register_address}               
                  </Text>
            </View>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Customer Reviews</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.seeAllText}>Add Review</Text>
            </TouchableOpacity>
          </View>

          {isLoadingComments ? (
            <ActivityIndicator
              size="large"
              color={PRIMARY_COLOR}
              style={styles.loadingIndicator}
            />
          ) : comments.length === 0 ? (
            <Text style={styles.noCommentsText}>
              No reviews yet. Be the first to review!
            </Text>
          ) : (
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          )}
        </View>

        <View style={styles.relatedContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>You might also like</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={relatedProducts.slice(0, 3)}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.relatedProduct}>
                <Image
                  source={{ uri: item.img }}
                  style={styles.relatedProductImage}
                />
                <Text style={styles.relatedProductName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.relatedProductPrice}>₱{item.price}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.relatedProductsList}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
          <Text style={styles.addToCartText}>
            {/* Add to Cart  */}
            ₱{(productDetails?.price || 0) * quantity}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Your Review</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.ratingInput}>
              <Text style={styles.ratingLabel}>Your Rating:</Text>
              <View style={styles.starsContainer}>
                {[...Array(5)].map((_, i) => renderRatingStar(i))}
              </View>
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Share your experience with this product..."
              multiline
              numberOfLines={4}
              value={newComment}
              onChangeText={setNewComment}
            />

            <View style={styles.imageUploadContainer}>
              <Text style={styles.imageUploadLabel}>
                Add Photos (Optional):
              </Text>
              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={pickImage}
              >
                <FontAwesome name="camera" size={20} color={PRIMARY_COLOR} />
                <Text style={styles.imageUploadButtonText}>Add Photo</Text>
              </TouchableOpacity>

              {commentImages.length > 0 && (
                <FlatList
                  horizontal
                  data={commentImages}
                  renderItem={({ item, index }) => (
                    <View style={styles.uploadedImageContainer}>
                      <Image
                        source={{ uri: item.uri }}
                        style={styles.uploadedImage}
                      />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons name="close" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={(_, index) => index.toString()}
                  contentContainerStyle={styles.uploadedImagesList}
                />
              )}
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitComment}
              disabled={isSubmittingComment}
            >
              {isSubmittingComment ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Review</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        shareUrl={`https://BizNest.com/product/${product_id}`}
      />
    </SafeAreaView>
  );
};

const shareStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  urlText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  shareOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shareOption: {
    alignItems: 'center',
    width: '25%',
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_BACKGROUND,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 80,
  },
  imageContainer: {
    width: Dimensions.get("window").width,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY_COLOR,
    margin: 5,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 8,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 4,
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: "#666",
  },
  separator: {
    width: 1,
    height: 14,
    backgroundColor: "#ddd",
    marginHorizontal: 8,
  },
  soldText: {
    fontSize: 14,
    color: "#666",
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 12,
  },
  discountTag: {
    backgroundColor: "#FF6347",
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 12,
    color: "#333",
  },
  deliveryContainer: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 8,
  },
  deliveryRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  deliveryTextContainer: {
    marginLeft: 12,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  deliveryInfo: {
    fontSize: 14,
    color: "#666",
  },
  sellerContainer: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 8,
  },
  sellerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
  viewShopText: {
    color: SECONDARY_COLOR,
    fontSize: 14,
    fontWeight: "500",
  },
  sellerInfo: {
    flexDirection: "row",
  },
  sellerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  sellerRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  sellerRatingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  sellerLocation: {
    fontSize: 14,
    color: "#666",
  },
  commentsSection: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 8,
  },
  commentContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentUserInfo: {
    flex: 1,
  },
  commentUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  commentRating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  commentText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 8,
  },
  commentImagesContainer: {
    marginTop: 8,
  },
  commentImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  commentDate: {
    fontSize: 12,
    color: "#999",
  },
  noCommentsText: {
    textAlign: "center",
    color: "#666",
    marginVertical: 20,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  relatedContainer: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllText: {
    color: SECONDARY_COLOR,
    fontSize: 14,
    fontWeight: "500",
  },
  relatedProductsList: {
    paddingBottom: 8,
  },
  relatedProduct: {
    width: 150,
    marginRight: 12,
  },
  relatedProductImage: {
    width: 150,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginBottom: 8,
  },
  relatedProductName: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  relatedProductPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  addToCartButton: {
    backgroundColor: SECONDARY_COLOR,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
  ratingInput: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  imageUploadContainer: {
    marginBottom: 20,
  },
  imageUploadLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  imageUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    borderRadius: 8,
    padding: 10,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  imageUploadButtonText: {
    color: PRIMARY_COLOR,
    marginLeft: 8,
  },
  uploadedImagesList: {
    marginTop: 8,
  },
  uploadedImageContainer: {
    position: "relative",
    marginRight: 10,
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductDetails;




// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Image,
//   SafeAreaView,
//   StatusBar,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   FlatList,
//   Animated,
//   Dimensions,
//   ToastAndroid,
//   StyleSheet,
//   TextInput,
//   Modal,
//   Pressable,
//   ActivityIndicator,
// } from "react-native";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import Entypo from "@expo/vector-icons/Entypo";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import * as ImagePicker from "expo-image-picker";
// import { useNavigation } from "expo-router";
// import { useRoute } from "@react-navigation/native";
// import axios from "axios";
// import API_URL from "../api/api_urls";
// import { ProductsTitle } from "./Global";

// const PRIMARY_COLOR = "#172d55";
// const SECONDARY_COLOR = "#172d55";
// const LIGHT_BACKGROUND = "#f8f9fa";

// const ProductDetails = () => {
//   const route = useRoute();
//   const { product_id } = route.params;
//   const [productDetails, setProductDetail] = useState(null);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [quantity, setQuantity] = useState(1);
//   const [comments, setComments] = useState([
//     {
//       id: 1,
//       user: {
//         name: "Maria Lopez",
//         avatar: "https://randomuser.me/api/portraits/women/33.jpg"
//       },
//       rating: 5,
//       comment: "Beautiful hablon tote! The quality is excellent and it's very durable. Perfect for everyday use while supporting local weavers.",
//       created_at: "2023-05-15T10:30:00Z",
//       images: [
//         "https://example.com/hablon-tote-review1.jpg",
//         "https://example.com/hablon-tote-review2.jpg"
//       ]
//     },
//     {
//       id: 2,
//       user: {
//         name: "Juan Dela Cruz",
//         avatar: "https://randomuser.me/api/portraits/men/22.jpg"
//       },
//       rating: 4,
//       comment: "The capiz wind chime is lovely and makes such a pleasant sound. It's a bit smaller than I expected but still beautiful.",
//       created_at: "2023-04-28T14:45:00Z",
//       images: []
//     },
//     {
//       id: 3,
//       user: {
//         name: "Sofia Reyes",
//         avatar: "https://randomuser.me/api/portraits/women/45.jpg"
//       },
//       rating: 5,
//       comment: "Authentic Ilonggo handicrafts! The patadyong skirt is well-made and the colors are vibrant. Will definitely buy again!",
//       created_at: "2023-04-10T09:15:00Z",
//       images: [
//         "https://example.com/patadyong-review.jpg"
//       ]
//     }
//   ]);
//   const [newComment, setNewComment] = useState("");
//   const [rating, setRating] = useState(0);
//   const [commentImages, setCommentImages] = useState([]);
//   const [isLoadingComments, setIsLoadingComments] = useState(false);
//   const [isSubmittingComment, setIsSubmittingComment] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const nav = useNavigation();

//   const width = Dimensions.get("window").width;
//   const scrollX = new Animated.Value(0);
//   let position = Animated.divide(scrollX, width);

//   useEffect(() => {
//     fetchProductDetails();
//     fetchRelatedProducts();
//     // fetchComments(); // Commented out since we're using sample data
//   }, []);

//   const fetchProductDetails = async () => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/api/v1/Product/product_api`,
//         { product_id }
//       );
//       setProductDetail(response.data);
//     } catch (error) {
//       console.error("Error fetching product details:", error);
//     }
//   };

//   const fetchRelatedProducts = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/v1/Product/product_api`);
//       setRelatedProducts(response.data);
//     } catch (error) {
//       console.error("Error fetching related products:", error);
//     }
//   };

//   // Commented out since we're using sample comments data
//   /*
//   const fetchComments = async () => {
//     setIsLoadingComments(true);
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/v1/Comments/product_comments`,
//         {
//           params: { product_id },
//         }
//       );
//       setComments(response.data);
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//     } finally {
//       setIsLoadingComments(false);
//     }
//   };
//   */

//   const addToCart = async () => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/api/v1/Buyer Cart/buyer_cart`,
//         {
//           product_id,
//           quantity,
//         }
//       );
//       if (response.status === 200) {
//         ToastAndroid.show("Item added to cart!", ToastAndroid.SHORT);
//         nav.navigate("Home");
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       ToastAndroid.show("Failed to add item", ToastAndroid.SHORT);
//     }
//   };

//   const submitComment = async () => {
//     if (!newComment.trim() || rating === 0) {
//       ToastAndroid.show("Please add a comment and rating", ToastAndroid.SHORT);
//       return;
//     }

//     setIsSubmittingComment(true);
//     try {
//       const formData = new FormData();
//       formData.append("product_id", product_id);
//       formData.append("comment", newComment);
//       formData.append("rating", rating);

//       commentImages.forEach((image, index) => {
//         formData.append("images", {
//           uri: image.uri,
//           type: "image/jpeg",
//           name: `comment_image_${index}.jpg`,
//         });
//       });

//       const response = await axios.post(
//         `${API_URL}/api/v1/Comments/add_comment`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 200) {
//         ToastAndroid.show("Comment submitted!", ToastAndroid.SHORT);
//         setNewComment("");
//         setRating(0);
//         setCommentImages([]);
//         setModalVisible(false);
  
//         const newCommentObj = {
//           id: comments.length + 1,
//           user: {
//             name: "Current User",
//             avatar: "https://randomuser.me/api/portraits/men/1.jpg"
//           },
//           rating,
//           comment: newComment,
//           created_at: new Date().toISOString(),
//           images: commentImages.map(img => img.uri)
//         };
//         setComments([newCommentObj, ...comments]);
//       }
//     } catch (error) {
//       console.error("Error submitting comment:", error);
//       ToastAndroid.show("Failed to submit comment", ToastAndroid.SHORT);
//     } finally {
//       setIsSubmittingComment(false);
//     }
//   };

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setCommentImages([...commentImages, result.assets[0]]);
//     }
//   };

//   const removeImage = (index) => {
//     const newImages = [...commentImages];
//     newImages.splice(index, 1);
//     setCommentImages(newImages);
//   };

//   const renderProductImage = ({ item }) => (
//     <View style={styles.imageContainer}>
//       <Image source={{ uri: item }} style={styles.productImage} />
//     </View>
//   );

//   const renderDot = (_, i) => {
//     let opacity = position.interpolate({
//       inputRange: [i - 1, i, i + 1],
//       outputRange: [0.3, 1, 0.3],
//       extrapolate: "clamp",
//     });
//     return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
//   };

//   const renderComment = ({ item }) => (
//     <View style={styles.commentContainer}>
//       <View style={styles.commentHeader}>
//         <Image
//           source={{
//             uri: item.user.avatar || "https://randomuser.me/api/portraits/men/1.jpg",
//           }}
//           style={styles.commentUserImage}
//         />
//         <View style={styles.commentUserInfo}>
//           <Text style={styles.commentUserName}>{item.user.name}</Text>
//           <View style={styles.commentRating}>
//             {[...Array(5)].map((_, i) => (
//               <Ionicons
//                 key={i}
//                 name={i < item.rating ? "star" : "star-outline"}
//                 size={16}
//                 color="#FFC120"
//               />
//             ))}
//           </View>
//         </View>
//         <Text style={styles.commentDate}>
//           {new Date(item.created_at).toLocaleDateString()}
//         </Text>
//       </View>
//       <Text style={styles.commentText}>{item.comment}</Text>
//       {item.images && item.images.length > 0 && (
//         <FlatList
//           horizontal
//           data={item.images}
//           renderItem={({ item: image }) => (
//             <Image source={{ uri: image }} style={styles.commentImage} />
//           )}
//           keyExtractor={(image, index) => index.toString()}
//           contentContainerStyle={styles.commentImagesContainer}
//         />
//       )}
//     </View>
//   );

//   const renderRatingStar = (index) => {
//     return (
//       <TouchableOpacity onPress={() => setRating(index + 1)}>
//         <Ionicons
//           name={index < rating ? "star" : "star-outline"}
//           size={28}
//           color="#FFC120"
//         />
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="white" barStyle="dark-content" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => nav.goBack()}>
//           <Ionicons name="chevron-back" size={28} color={PRIMARY_COLOR} />
//         </TouchableOpacity>
//         <TouchableOpacity>
//           <Entypo name="share-alternative" size={26} color={PRIMARY_COLOR} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         style={styles.scrollView}
//       >
//         {/* Image Carousel */}
//         <View>
//           <FlatList
//             data={productDetails?.images || [productDetails?.img]}
//             horizontal
//             renderItem={renderProductImage}
//             showsHorizontalScrollIndicator={false}
//             pagingEnabled
//             onScroll={Animated.event(
//               [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//               { useNativeDriver: false }
//             )}
//           />
//           <View style={styles.dotsContainer}>
//             {(productDetails?.images || [productDetails?.img]).map(renderDot)}
//           </View>
//         </View>

//         {/* Product Info */}
//         <View style={styles.infoContainer}>
//           <Text style={styles.productName}>
//             {productDetails?.name || "Loading..."}
//           </Text>

//           <View style={styles.ratingContainer}>
//             <Ionicons name="star" size={16} color="#FFC120" />
//             <Text style={styles.ratingText}>4.9</Text>
//             <Text style={styles.reviewCount}>(128 reviews)</Text>
//             <View style={styles.separator} />
//             <Text style={styles.soldText}>1.2k+ sold</Text>
//           </View>

//           <Text style={styles.description}>
//             {productDetails?.description ||
//               "High-quality local product with premium materials"}
//           </Text>

//           <View style={styles.priceContainer}>
//             <Text style={styles.currentPrice}>
//               ₱{productDetails?.price || "0"}
//             </Text>
//             {productDetails?.originalPrice && (
//               <Text style={styles.originalPrice}>
//                 ₱{productDetails.originalPrice}
//               </Text>
//             )}
//             {productDetails?.discount && (
//               <Text style={styles.discountTag}>
//                 {productDetails.discount}% OFF
//               </Text>
//             )}
//           </View>

//           {/* Quantity Selector */}
//           <View style={styles.quantityContainer}>
//             <Text style={styles.quantityLabel}>Quantity:</Text>
//             <View style={styles.quantityControls}>
//               <TouchableOpacity
//                 style={styles.quantityButton}
//                 onPress={() => setQuantity(Math.max(1, quantity - 1))}
//               >
//                 <Ionicons name="remove" size={20} color={PRIMARY_COLOR} />
//               </TouchableOpacity>
//               <Text style={styles.quantityText}>{quantity}</Text>
//               <TouchableOpacity
//                 style={styles.quantityButton}
//                 onPress={() => setQuantity(quantity + 1)}
//               >
//                 <Ionicons name="add" size={20} color={PRIMARY_COLOR} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         {/* Delivery Info */}
//         <View style={styles.deliveryContainer}>
//           <View style={styles.deliveryRow}>
//             <MaterialIcons
//               name="local-shipping"
//               size={20}
//               color={PRIMARY_COLOR}
//             />
//             <View style={styles.deliveryTextContainer}>
//               <Text style={styles.deliveryTitle}>Delivery</Text>
//               <Text style={styles.deliveryInfo}>Standard (3-5 days) • ₱50</Text>
//             </View>
//           </View>
//           <View style={styles.deliveryRow}>
//             <MaterialIcons name="store" size={20} color={PRIMARY_COLOR} />
//             <View style={styles.deliveryTextContainer}>
//               <Text style={styles.deliveryTitle}>Pickup</Text>
//               <Text style={styles.deliveryInfo}>
//                 Available at seller's location
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Seller Info */}
//         <View style={styles.sellerContainer}>
//           <View style={styles.sellerHeader}>
//             <Text style={styles.sectionTitle}>Seller Information</Text>
//             <TouchableOpacity
//               onPress={() =>
//                 nav.navigate("ViewShop", {
//                   seller_id: productDetails?.seller_id,
//                 })
//               }
//             >
//               <Text style={styles.viewShopText}>View Shop</Text>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.sellerInfo}>
//             <Image
//               source={{
//                 uri: "https://randomuser.me/api/portraits/women/45.jpg",
//               }}
//               style={styles.sellerImage}
//             />
//             <View style={styles.sellerDetails}>
//               <Text style={styles.sellerName}>Iloilo Handicrafts Haven</Text>
//               <View style={styles.sellerRating}>
//                 <Ionicons name="star" size={16} color="#FFC120" />
//                 <Text style={styles.sellerRatingText}>4.8 (215 ratings)</Text>
//               </View>
//               <Text style={styles.sellerLocation}>
//                 Molo, Iloilo City, Philippines
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Comments Section */}
//         <View style={styles.commentsSection}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Customer Reviews</Text>
//             <TouchableOpacity onPress={() => setModalVisible(true)}>
//               <Text style={styles.seeAllText}>Add Review</Text>
//             </TouchableOpacity>
//           </View>

//           {isLoadingComments ? (
//             <ActivityIndicator
//               size="large"
//               color={PRIMARY_COLOR}
//               style={styles.loadingIndicator}
//             />
//           ) : comments.length === 0 ? (
//             <Text style={styles.noCommentsText}>
//               No reviews yet. Be the first to review!
//             </Text>
//           ) : (
//             <FlatList
//               data={comments}
//               renderItem={renderComment}
//               keyExtractor={(item) => item.id.toString()}
//               scrollEnabled={false}
//             />
//           )}
//         </View>

//         {/* Related Products */}
//         <View style={styles.relatedContainer}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>You might also like</Text>
//             <TouchableOpacity>
//               <Text style={styles.seeAllText}>See all</Text>
//             </TouchableOpacity>
//           </View>
//           <FlatList
//             data={relatedProducts.slice(0, 3)}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             renderItem={({ item }) => (
//               <TouchableOpacity style={styles.relatedProduct}>
//                 <Image
//                   source={{ uri: item.img }}
//                   style={styles.relatedProductImage}
//                 />
//                 <Text style={styles.relatedProductName} numberOfLines={2}>
//                   {item.name}
//                 </Text>
//                 <Text style={styles.relatedProductPrice}>₱{item.price}</Text>
//               </TouchableOpacity>
//             )}
//             keyExtractor={(item) => item.id.toString()}
//             contentContainerStyle={styles.relatedProductsList}
//           />
//         </View>
//       </ScrollView>

//       {/* Fixed Add to Cart Button */}
//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
//           <Text style={styles.addToCartText}>
//             Add to Cart - ₱{(productDetails?.price || 0) * quantity}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Add Comment Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(!modalVisible);
//         }}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Add Your Review</Text>
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Ionicons name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.ratingInput}>
//               <Text style={styles.ratingLabel}>Your Rating:</Text>
//               <View style={styles.starsContainer}>
//                 {[...Array(5)].map((_, i) => renderRatingStar(i))}
//               </View>
//             </View>

//             <TextInput
//               style={styles.commentInput}
//               placeholder="Share your experience with this product..."
//               multiline
//               numberOfLines={4}
//               value={newComment}
//               onChangeText={setNewComment}
//             />

//             <View style={styles.imageUploadContainer}>
//               <Text style={styles.imageUploadLabel}>
//                 Add Photos (Optional):
//               </Text>
//               <TouchableOpacity
//                 style={styles.imageUploadButton}
//                 onPress={pickImage}
//               >
//                 <FontAwesome name="camera" size={20} color={PRIMARY_COLOR} />
//                 <Text style={styles.imageUploadButtonText}>Add Photo</Text>
//               </TouchableOpacity>

//               {commentImages.length > 0 && (
//                 <FlatList
//                   horizontal
//                   data={commentImages}
//                   renderItem={({ item, index }) => (
//                     <View style={styles.uploadedImageContainer}>
//                       <Image
//                         source={{ uri: item.uri }}
//                         style={styles.uploadedImage}
//                       />
//                       <TouchableOpacity
//                         style={styles.removeImageButton}
//                         onPress={() => removeImage(index)}
//                       >
//                         <Ionicons name="close" size={16} color="white" />
//                       </TouchableOpacity>
//                     </View>
//                   )}
//                   keyExtractor={(_, index) => index.toString()}
//                   contentContainerStyle={styles.uploadedImagesList}
//                 />
//               )}
//             </View>

//             <TouchableOpacity
//               style={styles.submitButton}
//               onPress={submitComment}
//               disabled={isSubmittingComment}
//             >
//               {isSubmittingComment ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.submitButtonText}>Submit Review</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: LIGHT_BACKGROUND,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "white",
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 10,
//   },
//   scrollView: {
//     flex: 1,
//     paddingBottom: 80,
//   },
//   imageContainer: {
//     width: Dimensions.get("window").width,
//     height: 300,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "white",
//   },
//   productImage: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "contain",
//   },
//   dotsContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     position: "absolute",
//     bottom: 15,
//     left: 0,
//     right: 0,
//   },
//   dot: {
//     height: 8,
//     width: 8,
//     borderRadius: 4,
//     backgroundColor: PRIMARY_COLOR,
//     margin: 5,
//   },
//   infoContainer: {
//     padding: 16,
//     backgroundColor: "white",
//     marginBottom: 8,
//   },
//   productName: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: PRIMARY_COLOR,
//     marginBottom: 8,
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   ratingText: {
//     fontSize: 14,
//     color: "#333",
//     marginLeft: 4,
//     marginRight: 8,
//   },
//   reviewCount: {
//     fontSize: 14,
//     color: "#666",
//   },
//   separator: {
//     width: 1,
//     height: 14,
//     backgroundColor: "#ddd",
//     marginHorizontal: 8,
//   },
//   soldText: {
//     fontSize: 14,
//     color: "#666",
//   },
//   description: {
//     fontSize: 14,
//     color: "#555",
//     lineHeight: 20,
//     marginBottom: 16,
//   },
//   priceContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   currentPrice: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: PRIMARY_COLOR,
//     marginRight: 12,
//   },
//   originalPrice: {
//     fontSize: 16,
//     color: "#999",
//     textDecorationLine: "line-through",
//     marginRight: 12,
//   },
//   discountTag: {
//     backgroundColor: "#FF6347",
//     color: "white",
//     fontSize: 14,
//     fontWeight: "bold",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//     overflow: "hidden",
//   },
//   quantityContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   quantityLabel: {
//     fontSize: 16,
//     color: "#333",
//     fontWeight: "500",
//   },
//   quantityControls: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   quantityButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   quantityText: {
//     fontSize: 16,
//     marginHorizontal: 12,
//     color: "#333",
//   },
//   deliveryContainer: {
//     padding: 16,
//     backgroundColor: "white",
//     marginBottom: 8,
//   },
//   deliveryRow: {
//     flexDirection: "row",
//     marginBottom: 12,
//   },
//   deliveryTextContainer: {
//     marginLeft: 12,
//   },
//   deliveryTitle: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#333",
//   },
//   deliveryInfo: {
//     fontSize: 14,
//     color: "#666",
//   },
//   sellerContainer: {
//     padding: 16,
//     backgroundColor: "white",
//     marginBottom: 8,
//   },
//   sellerHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: PRIMARY_COLOR,
//   },
//   viewShopText: {
//     color: SECONDARY_COLOR,
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   sellerInfo: {
//     flexDirection: "row",
//   },
//   sellerImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//   },
//   sellerDetails: {
//     flex: 1,
//   },
//   sellerName: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#333",
//     marginBottom: 4,
//   },
//   sellerRating: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   sellerRatingText: {
//     fontSize: 14,
//     color: "#666",
//     marginLeft: 4,
//   },
//   sellerLocation: {
//     fontSize: 14,
//     color: "#666",
//   },
//   commentsSection: {
//     padding: 16,
//     backgroundColor: "white",
//     marginBottom: 8,
//   },
//   commentContainer: {
//     marginBottom: 16,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   commentHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   commentUserImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   commentUserInfo: {
//     flex: 1,
//   },
//   commentUserName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//   },
//   commentRating: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 2,
//   },
//   commentText: {
//     fontSize: 14,
//     color: "#555",
//     lineHeight: 20,
//     marginBottom: 8,
//   },
//   commentImagesContainer: {
//     marginTop: 8,
//   },
//   commentImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   commentDate: {
//     fontSize: 12,
//     color: "#999",
//   },
//   noCommentsText: {
//     textAlign: "center",
//     color: "#666",
//     marginVertical: 20,
//   },
//   loadingIndicator: {
//     marginVertical: 20,
//   },
//   relatedContainer: {
//     padding: 16,
//     backgroundColor: "white",
//     marginBottom: 8,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   seeAllText: {
//     color: SECONDARY_COLOR,
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   relatedProductsList: {
//     paddingBottom: 8,
//   },
//   relatedProduct: {
//     width: 150,
//     marginRight: 12,
//   },
//   relatedProductImage: {
//     width: 150,
//     height: 120,
//     borderRadius: 8,
//     backgroundColor: "#f5f5f5",
//     marginBottom: 8,
//   },
//   relatedProductName: {
//     fontSize: 14,
//     color: "#333",
//     marginBottom: 4,
//   },
//   relatedProductPrice: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: PRIMARY_COLOR,
//   },
//   footer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "white",
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//   },
//   addToCartButton: {
//     backgroundColor: SECONDARY_COLOR,
//     padding: 16,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   addToCartText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   // Modal Styles
//   modalContainer: {
//     flex: 1,
//     justifyContent: "flex-end",
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
//   modalContent: {
//     backgroundColor: "white",
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     padding: 20,
//     maxHeight: "80%",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: PRIMARY_COLOR,
//   },
//   ratingInput: {
//     marginBottom: 20,
//   },
//   ratingLabel: {
//     fontSize: 16,
//     color: "#333",
//     marginBottom: 8,
//   },
//   starsContainer: {
//     flexDirection: "row",
//   },
//   commentInput: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 12,
//     minHeight: 100,
//     marginBottom: 20,
//     textAlignVertical: "top",
//   },
//   imageUploadContainer: {
//     marginBottom: 20,
//   },
//   imageUploadLabel: {
//     fontSize: 16,
//     color: "#333",
//     marginBottom: 8,
//   },
//   imageUploadButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//     borderRadius: 8,
//     padding: 10,
//     alignSelf: "flex-start",
//     marginBottom: 10,
//   },
//   imageUploadButtonText: {
//     color: PRIMARY_COLOR,
//     marginLeft: 8,
//   },
//   uploadedImagesList: {
//     marginTop: 8,
//   },
//   uploadedImageContainer: {
//     position: "relative",
//     marginRight: 10,
//   },
//   uploadedImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//   },
//   removeImageButton: {
//     position: "absolute",
//     top: 5,
//     right: 5,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   submitButton: {
//     backgroundColor: PRIMARY_COLOR,
//     padding: 16,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   submitButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default ProductDetails;