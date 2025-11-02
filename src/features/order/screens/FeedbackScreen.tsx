import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { orderService } from '@/services/api/orderService';
import { toast } from '@utils/toast';

export default function FeedbackScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { orderId } = route.params || {};

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn đánh giá từ 1-5 sao');
      return;
    }

    if (!orderId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin đơn hàng');
      return;
    }

    setLoading(true);
    try {
      await orderService.submitFeedback({
        orderId,
        ranking: rating,
        comment: comment.trim() || undefined,
      });

      Alert.alert('Thành công', 'Cảm ơn bạn đã đánh giá!', [
        {
          text: 'OK',
          onPress: () => {
            // Refresh order detail sau khi đánh giá
            navigation.goBack();
            // Trigger refresh bằng cách navigate lại
            setTimeout(() => {
              navigation.navigate('OrderDetail', { orderId });
            }, 100);
          },
        },
      ]);
    } catch (error: any) {
      console.error('Feedback error:', error);
      Alert.alert('Lỗi', error?.message || 'Gửi đánh giá thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Đánh giá đơn hàng #{orderId}</Text>
      <Text style={styles.subtitle}>Chia sẻ trải nghiệm của bạn về đơn hàng này</Text>

      <View style={styles.ratingSection}>
        <Text style={styles.label}>Đánh giá</Text>
        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
              disabled={loading}
            >
              <Text style={[styles.star, rating >= star && styles.starFilled]}>
                {rating >= star ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {rating > 0 && (
          <Text style={styles.ratingText}>
            {rating === 1
              ? 'Rất không hài lòng'
              : rating === 2
                ? 'Không hài lòng'
                : rating === 3
                  ? 'Bình thường'
                  : rating === 4
                    ? 'Hài lòng'
                    : 'Rất hài lòng'}
          </Text>
        )}
      </View>

      <View style={styles.commentSection}>
        <Text style={styles.label}>Nhận xét (tùy chọn)</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={6}
          placeholder="Chia sẻ thêm về trải nghiệm của bạn..."
          value={comment}
          onChangeText={setComment}
          editable={!loading}
          textAlignVertical="top"
          autoCorrect={true}
          autoCapitalize="sentences"
          keyboardType="default"
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        disabled={loading || rating === 0}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  ratingSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 40,
    color: '#ddd',
  },
  starFilled: {
    color: '#ffa500',
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  commentSection: {
    marginBottom: 24,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
