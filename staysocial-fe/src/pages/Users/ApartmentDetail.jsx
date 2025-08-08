import { getApartmentById } from '../../services/apartmentApi';
import { getAllPhotos, getPhotoById } from '../../services/photoApi';
import { 
  createComment, 
  getCommentsByApartmentId, 
  getMyComments, 
  deleteComment 
} from '../../services/commentApi';
import {
  createFeedback,
  getFeedbacksByApartmentId,
  getAverageRatingByApartmentId,
  getMyFeedbacks
} from '../../services/feedbackApi';
// Import reaction API functions
import { toggleReaction, getReactionCount } from '../../services/reactionApi';
import React, { useState, useEffect } from "react";
import { Star, Heart, ThumbsUp, ThumbsDown, MapPin, Wifi, Car, Shield, Waves, Dumbbell, Camera, Trash2, Edit } from "lucide-react";
import { useSelector } from 'react-redux';

// Define BASE_URL for photo URLs
const BASE_URL = 'http://localhost:5283/api';

const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const tabsList = children.find(child => child.type === TabsList);
  const tabsContents = children.filter(child => child.type === TabsContent);

  return (
    <div className="w-full">
      {tabsList && React.cloneElement(tabsList, { activeTab, setActiveTab })}
      {tabsContents.map(content =>
        React.cloneElement(content, {
          key: content.props.value,
          isActive: activeTab === content.props.value
        })
      )}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab }) => (
  <div className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-4">
    {children.map(child =>
      React.cloneElement(child, {
        key: child.props.value,
        isActive: activeTab === child.props.value,
        onClick: () => setActiveTab(child.props.value)
      })
    )}
  </div>
);

const TabsTrigger = ({ value, children, isActive, onClick }) => (
  <button
    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive
      ? 'bg-white text-blue-600 shadow-sm'
      : 'text-gray-600 hover:text-gray-900'
      }`}
    onClick={onClick}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, isActive }) => (
  isActive ? <div className="mt-4">{children}</div> : null
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={className}>
    {children}
  </div>
);

const Button = ({ variant = "default", children, onClick, className = "", disabled = false }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 disabled:hover:bg-blue-600",
    ghost: "bg-transparent hover:bg-gray-100 px-3 py-2",
    danger: "bg-red-600 text-white px-3 py-1 text-sm hover:bg-red-700"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default function ApartmentDetail({ apartmentId = 1 }) {

  // State cho apartment data
  const [apartment, setApartment] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Redux state
  const { userInfo } = useSelector(state => state.auth);
  const role = userInfo?.role;
  const currentUserId = userInfo?.id;

  // State cho UI interactions
  const [selectedImage, setSelectedImage] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  
  // State cho reactions - UPDATED
  const [reactions, setReactions] = useState({
    likeCount: 0,
    dislikeCount: 0,
    userReaction: null // null | 'like' | 'dislike'
  });
  const [reactionLoading, setReactionLoading] = useState(false);
  
  // State cho comments
  const [userComment, setUserComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // State cho feedbacks
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  // Fetch data khi component mount
  useEffect(() => {
    fetchApartmentData();
    fetchComments();
    fetchFeedbacks();
    fetchReactionData(); // NEW: Fetch reaction data
  }, [apartmentId]);

  // NEW: Fetch reaction data from API
 // NEW: Fetch reaction data from API
const fetchReactionData = async () => {
  try {
    const reactionData = await getReactionCount(apartmentId);
    console.log('Reaction data received:', reactionData);

    setReactions({
      likeCount: reactionData.likes ?? 0,
      dislikeCount: reactionData.dislikes ?? 0,
      userReaction: reactions.userReaction ?? reactionData.userReaction ?? null
    });
  } catch (err) {
    console.error('Error fetching reaction data:', err);
    // Set default values on error
    setReactions({
      likeCount: 0,
      dislikeCount: 0,
      userReaction: null
    });
  }
};


  // NEW: Handle reaction toggle (like/dislike)
const handleReactionToggle = async (reactionType) => {
  if (!userInfo) {
    alert('Vui lòng đăng nhập để thực hiện tương tác');
    return;
  }

  if (reactionLoading) return;

  try {
    setReactionLoading(true);

    // Determine optimistic next state:
    // If user already did same reaction => clicking again should remove it => set userReaction -> null
    const current = reactions.userReaction; // 'like' | 'dislike' | null
    const willRemove = current === reactionType;
    const newUserReaction = willRemove ? null : reactionType;

    // Optimistically update UI counts:
    setReactions(prev => {
      let likeCount = prev.likeCount;
      let dislikeCount = prev.dislikeCount;

      // remove previous reaction if exists
      if (prev.userReaction === 'like') likeCount = Math.max(0, likeCount - 1);
      if (prev.userReaction === 'dislike') dislikeCount = Math.max(0, dislikeCount - 1);

      // add new reaction if not removing
      if (!willRemove) {
        if (reactionType === 'like') likeCount = likeCount + 1;
        if (reactionType === 'dislike') dislikeCount = dislikeCount + 1;
      }

      return {
        likeCount,
        dislikeCount,
        userReaction: newUserReaction
      };
    });

    // Send to backend (it will toggle server-side)
    const payload = {
      apartmentId: apartmentId,
      reactionType // 'like' or 'dislike' - reactionApi maps this to enum
    };
    console.log('Sending reaction toggle:', payload);
    await toggleReaction(payload);

    // Re-fetch authoritative counts to avoid drift
    await fetchReactionData();
  } catch (err) {
    console.error('Error toggling reaction:', err);
    alert('Có lỗi khi thực hiện tương tác: ' + (err.message || err));
    // on error, re-fetch to revert optimistic UI
    try { await fetchReactionData(); } catch (e) { /* ignore */ }
  } finally {
    setReactionLoading(false);
  }
};

  const fetchApartmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const apartmentData = await getApartmentById(apartmentId);
      setApartment(apartmentData);
      console.log('Apartment data:', apartmentData);

      await fetchPhotos(apartmentData);

    } catch (err) {
      setError(err.message || 'Không thể tải thông tin căn hộ');
      console.error('Error fetching apartment:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const commentsData = await getCommentsByApartmentId(apartmentId);
      console.log('Comments data:', commentsData);
      setComments(commentsData || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoadingFeedbacks(true);
      const [feedbacksData, averageData] = await Promise.all([
        getFeedbacksByApartmentId(apartmentId),
        getAverageRatingByApartmentId(apartmentId)
      ]);
      console.log('Feedbacks data:', feedbacksData);
      console.log('Average rating data:', averageData);
      setFeedbacks(feedbacksData || []);
      setAverageRating(averageData?.averageRating || 0);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setFeedbacks([]);
      setAverageRating(0);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const fetchPhotos = async (apartmentData) => {
    try {
      let photoList = [];

      console.log('Fetching photos for apartment:', apartmentData);

      if (apartmentData.photoIds && apartmentData.photoIds.length > 0) {
        console.log('Method 1: Using photoIds:', apartmentData.photoIds);
        const photoPromises = apartmentData.photoIds.map(photoId =>
          getPhotoById(photoId).catch(err => {
            console.warn(`Failed to fetch photo ${photoId}:`, err);
            return null;
          })
        );
        const fetchedPhotos = await Promise.all(photoPromises);
        photoList = fetchedPhotos.filter(photo => photo !== null);
      }
      else if (apartmentData.photos && apartmentData.photos.length > 0) {
        console.log('Method 2: Using direct photos:', apartmentData.photos);
        photoList = apartmentData.photos;
      }
      else {
        console.log('Method 3: Fetching all photos');
        try {
          const allPhotos = await getAllPhotos();
          console.log('All photos received:', allPhotos);
          photoList = allPhotos || [];
        } catch (err) {
          console.warn('Failed to fetch all photos:', err);
          photoList = [];
        }
      }

      console.log('Photo list before processing:', photoList);

      const processedPhotos = photoList.map(photo => {
        if (typeof photo === 'string') {
          return photo;
        }

        if (photo && photo.url) {
          return photo.url;
        }

        return photo.filePath ||
          photo.imageUrl ||
          photo.src ||
          `${BASE_URL}/photos/${photo.id}` ||
          null;
      }).filter(url => url !== null);

      console.log('Processed photos:', processedPhotos);

      if (processedPhotos.length > 0) {
        setPhotos(processedPhotos);
      } else {
        console.log('No photos found, using defaults');
        setPhotos(getDefaultImages());
      }

    } catch (err) {
      console.error('Error fetching photos:', err);
      setPhotos(getDefaultImages());
    }
  };

  const getDefaultImages = () => [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1493663284031-b7e3aaa4b7bb?w=200&h=200&fit=crop"
  ];

  const handleSubmitReview = async () => {
    if (userRating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (userReview.trim() === '') {
      alert('Vui lòng nhập nội dung đánh giá');
      return;
    }

    try {
      setSubmittingFeedback(true);
      
      const feedbackData = {
        apartmentId: apartmentId,
        orderId: 1,
        rating: userRating,
        comment: userReview.trim()
      };

      console.log('Submitting feedback:', feedbackData);
      const newFeedback = await createFeedback(feedbackData);
      console.log('Feedback created:', newFeedback);
      
      await fetchFeedbacks();
      
      setUserRating(0);
      setUserReview('');
      alert('Đánh giá đã được gửi thành công!');
      
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Có lỗi khi gửi đánh giá: ' + err.message);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleSubmitComment = async () => {
    if (userComment.trim() === '') {
      alert('Vui lòng nhập bình luận');
      return;
    }

    try {
      setSubmittingComment(true);
      
      const commentData = {
        apartmentId: apartmentId,
        content: userComment.trim()
      };

      console.log('Submitting comment:', commentData);
      const newComment = await createComment(commentData);
      console.log('Comment created:', newComment);
      
      await fetchComments();
      
      setUserComment('');
      alert('Bình luận đã được gửi thành công!');
      
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Có lỗi khi gửi bình luận: ' + err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      return;
    }

    try {
      await deleteComment(commentId);
      await fetchComments();
      alert('Bình luận đã được xóa!');
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Có lỗi khi xóa bình luận: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải thông tin căn hộ...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Không thể tải dữ liệu</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchApartmentData}>Thử lại</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy căn hộ</h2>
              <p className="text-gray-600">Căn hộ này có thể đã bị xóa hoặc không tồn tại.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const images = photos.length > 0 ? photos : getDefaultImages();

  console.log('Current images for display:', images);
  console.log('Photos state:', photos);
  console.log('Selected image index:', selectedImage);
  console.log('Current reactions state:', reactions);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="relative group">
                <img
                  src={images[selectedImage]}
                  alt={`${apartment.title || 'Apartment'} main view`}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    console.warn('Image failed to load:', e.target.src);
                    e.target.src = getDefaultImages()[0];
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-4 gap-3">
                  {images.slice(1).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i + 1)}
                      className={`relative rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 ${selectedImage === i + 1 ? 'ring-2 ring-blue-500' : ''
                        }`}
                    >
                      <img
                        src={img}
                        className="w-full h-20 object-cover"
                        alt={`${apartment.title || 'Apartment'} view ${i + 1}`}
                        onError={(e) => {
                          console.warn('Thumbnail failed to load:', e.target.src);
                          e.target.src = getDefaultImages()[1];
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <Tabs defaultValue="feedback">
                <TabsList>
                  <TabsTrigger value="feedback">Đánh giá</TabsTrigger>
                  <TabsTrigger value="comments">Bình luận</TabsTrigger>
                </TabsList>

                <TabsContent value="feedback">
                  <div className="space-y-4">
                    {averageRating > 0 && (
                      <div className="bg-blue-50 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">Đánh giá trung bình</p>
                            <div className="flex items-center mt-1">
                              <span className="text-2xl font-bold text-yellow-500 mr-2">
                                {averageRating.toFixed(1)}
                              </span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`w-5 h-5 ${
                                      star <= Math.round(averageRating) 
                                        ? 'fill-yellow-400 text-yellow-400' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600 ml-2">
                                ({feedbacks.length} đánh giá)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {userInfo && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="font-semibold mb-2 text-gray-700">Đánh giá căn hộ này</p>
                        <p className="text-sm text-gray-600 mb-3">
                          * Chỉ những người đã thuê căn hộ mới có thể đánh giá
                        </p>
                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="focus:outline-none disabled:opacity-50"
                              onClick={() => setUserRating(star)}
                              disabled={submittingFeedback}
                            >
                              <Star className={`w-6 h-6 ${userRating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            </button>
                          ))}
                        </div>
                        <textarea
                          className="w-full border rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-400 resize-none"
                          rows={3}
                          placeholder="Chia sẻ cảm nhận của bạn về căn hộ..."
                          value={userReview}
                          onChange={e => setUserReview(e.target.value)}
                          disabled={submittingFeedback}
                          maxLength={1000}
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {userReview.length}/1000 ký tự
                          </span>
                          <Button 
                            onClick={handleSubmitReview}
                            disabled={submittingFeedback || userRating === 0}
                          >
                            {submittingFeedback ? 'Đang gửi...' : 'Gửi đánh giá'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {!userInfo && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                        <p className="text-yellow-800">
                          Vui lòng <a href="/login" className="text-blue-600 hover:underline">đăng nhập</a> để đánh giá.
                        </p>
                      </div>
                    )}

                    {loadingFeedbacks && (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Đang tải đánh giá...</p>
                      </div>
                    )}

                    {!loadingFeedbacks && (
                      <>
                        {feedbacks.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">
                            <div className="text-4xl mb-2">⭐</div>
                            <p>Chưa có đánh giá nào</p>
                            <p className="text-sm">Hãy là người đầu tiên đánh giá căn hộ này!</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {feedbacks.map((feedback) => (
                              <Card key={feedback.feedbackId} className="hover:shadow-lg transition-shadow duration-200">
                                <CardContent className="p-6">
                                  <div className="flex items-center gap-4 mb-4">
                                    <div>
                                      <p className="font-semibold text-gray-900">
                                        {feedback.fullName || 'Người thuê'}
                                      </p>
                                      <div className="flex text-yellow-500 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={`w-4 h-4 ${i < feedback.rating ? 'fill-yellow-500' : 'text-gray-300'}`} />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-gray-700 leading-relaxed mb-3">
                                    {feedback.comment}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(feedback.createdAt).toLocaleDateString('vi-VN', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="comments">
                  <div className="space-y-4">
                    {userInfo && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="font-semibold mb-2 text-gray-700">Bình luận về căn hộ</p>
                        <textarea
                          className="w-full border rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-400 resize-none"
                          rows={3}
                          placeholder="Nhập bình luận của bạn..."
                          value={userComment}
                          onChange={e => setUserComment(e.target.value)}
                          disabled={submittingComment}
                          maxLength={500}
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {userComment.length}/500 ký tự
                          </span>
                          <Button 
                            onClick={handleSubmitComment}
                            disabled={submittingComment || userComment.trim() === ''}
                          >
                            {submittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {loadingComments && (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Đang tải bình luận...</p>
                      </div>
                    )}

                    {!loadingComments && (
                      <>
                        {comments.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">
                            <div className="text-4xl mb-2">💬</div>
                            <p>Chưa có bình luận nào</p>
                            <p className="text-sm">Hãy là người đầu tiên bình luận về căn hộ này!</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {comments.map((comment) => (
                              <Card key={comment.commentId} className="p-4 hover:shadow-md transition-shadow duration-200">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                      <div>
                                        <p className="font-semibold text-gray-900">
                                          {comment.fullName || 'Người dùng'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {new Date(comment.createdAt).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                      {comment.content}
                                    </p>
                                  </div>
                                  
                                  {currentUserId && comment.userId === currentUserId && (
                                    <Button 
                                      variant="danger"
                                      onClick={() => handleDeleteComment(comment.commentId)}
                                      className="ml-2"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sticky top-6">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {apartment.title || apartment.name || 'Căn hộ'}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{apartment.address || apartment.location || 'Địa chỉ chưa cập nhật'}</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-4">
                    {apartment.price ? `${apartment.price.toLocaleString('vi-VN')}₫` : 'Liên hệ'}
                    <span className="text-base font-normal text-gray-600">/ tháng</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {apartment.amenities ? 'Mô tả' : 'Tiện ích'}
                  </h3>
                  <p className="text-gray-700 text-sm bg-gray-50 rounded-xl p-4">
                    {apartment.amenities}
                  </p>
                </div>

                {role === 'User' && (
                  <>
                    {/* UPDATED: Reactions Section with Real API Integration */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Phản hồi</h3>
                      <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-xl">
                        {/* Like Button */}
                        <Button
                          variant="ghost"
                          onClick={() => handleReactionToggle('like')}
                          disabled={reactionLoading}
                          className={`flex-1 relative ${
                            reactions.userReaction === 'like' 
                              ? 'bg-red-50 text-red-600 border-red-200' 
                              : 'hover:bg-red-50'
                          }`}
                        >
                          <Heart 
                            className={`w-5 h-5 mr-2 ${
                              reactions.userReaction === 'like' 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-400'
                            }`} 
                          />
                          <span className="flex items-center">
                            {reactions.userReaction === 'like' ? 'Đã thích' : 'Thích'}
                            {reactions.likeCount > 0 && (
                              <span className="ml-1 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                                {reactions.likeCount}
                              </span>
                            )}
                          </span>
                          {reactionLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            </div>
                          )}
                        </Button>

                        {/* Dislike Button */}
                        <Button
                          variant="ghost"
                          onClick={() => handleReactionToggle('dislike')}
                          disabled={reactionLoading}
                          className={`flex-1 relative ${
                            reactions.userReaction === 'dislike' 
                              ? 'bg-gray-100 text-gray-700 border-gray-300' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <ThumbsDown 
                            className={`w-5 h-5 mr-2 ${
                              reactions.userReaction === 'dislike' 
                                ? 'text-gray-600' 
                                : 'text-gray-400'
                            }`} 
                          />
                          <span className="flex items-center">
                            {reactions.userReaction === 'dislike' ? 'Đã dislike' : 'Không thích'}
                            {reactions.dislikeCount > 0 && (
                              <span className="ml-1 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                                {reactions.dislikeCount}
                              </span>
                            )}
                          </span>
                          {reactionLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            </div>
                          )}
                        </Button>
                      </div>

                      {/* Reaction Summary */}
                      {(reactions.likeCount > 0 || reactions.dislikeCount > 0) && (
                        <div className="mt-2 text-sm text-gray-600 text-center">
                          <span>
                            {reactions.likeCount > 0 && (
                              <span className="text-red-600 font-medium">
                                {reactions.likeCount} lượt thích
                              </span>
                            )}
                            {reactions.likeCount > 0 && reactions.dislikeCount > 0 && ' • '}
                            {reactions.dislikeCount > 0 && (
                              <span className="text-gray-600 font-medium">
                                {reactions.dislikeCount} lượt không thích
                              </span>
                            )}
                          </span>
                        </div>
                      )}

                      {/* User must login message */}
                      {!userInfo && (
                        <div className="mt-2 text-sm text-center">
                          <span className="text-gray-500">
                            <a href="/login" className="text-blue-600 hover:underline">
                              Đăng nhập
                            </a> để thể hiện cảm xúc
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <a
                        href="/booking-form"
                        className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
                      >
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          Đặt cọc ngay
                        </span>
                      </a>

                      <a
                        href="/checkoutpage"
                        className="block w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
                      >
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L9 21" />
                          </svg>
                          Thuê ngay
                        </span>
                      </a>
                    </div>

                    {/* Contact Info */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2">Liên hệ chủ nhà</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-700">
                            {apartment.phoneNumber}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700">
                            {apartment.ownerEmail || apartment.contactEmail || 'owner@email.com'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}