import { Button } from "@/components/ui/button";
import { toggleLoginDialog } from "@/store/slices/userSlice";
import { Star, User2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { useAddReviewMutation, useGetReviewsQuery } from "@/store/api";

const ReviewsSection = ({ product, user }: { product: any; user: any }) => {
    const dispatch = useDispatch();

    const [showAll, setShowAll] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Fetch reviews from backend
    const { data, isLoading } = useGetReviewsQuery(product._id);
    const reviews = data?.data ?? []; // extract the array from response


    const [addReview] = useAddReviewMutation();

    // Sort reviews newest first
    const sortedReviews = useMemo(() => {
        return reviews
            ? [...reviews].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            : [];
    }, [reviews]);

    const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 10);

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    };

    const handleSubmitReview = async () => {
        if (reviewRating === 0 || !reviewComment.trim()) return;

        try {
            setIsSubmittingReview(true);
            await addReview({
                productId: product._id,
                rating: reviewRating,
                comment: reviewComment,
            }).unwrap();

            setReviewRating(0);
            setReviewComment("");
            setIsReviewOpen(false);
        } catch (error) {
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <div id="reviews" className="mt-10 border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Ratings & Reviews</h2>

            {/* Rating Summary */}
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                            key={i}
                            className={`h-5 w-5 ${i <= Math.round(product.rating ?? 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                                }`}
                        />
                    ))}
                </div>
                <span className="text-sm text-gray-600">
                    {(product.rating ?? 0).toFixed(1)} · {reviews.length} reviews
                </span>
            </div>

            {/* Write Review Button */}
            <div className="mb-6">
                {user ? (
                    <Button variant="outline" onClick={() => setIsReviewOpen(true)}>
                        Write a Review
                    </Button>
                ) : (
                    <Button variant="outline" onClick={() => dispatch(toggleLoginDialog())}>
                        Login to write a review
                    </Button>
                )}
            </div>

            {/* Reviews List */}
            <div className="space-y-5">
                {!isLoading && displayedReviews.length ? (
                    displayedReviews.map((review) => {

                        return (
                            <div key={review._id} className="border-b pb-4">
                                <div className="flex items-center gap-2">
                                    <User2 className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium text-sm">{review.user?.name || "Anonymous"}</span>
                                    <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                                </div>

                                <div className="flex gap-1 mt-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>

                                {review.comment && <p className="text-sm text-gray-700 mt-2">{review.comment}</p>}
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-500">No reviews yet. Be the first to review this product.</p>
                )}
            </div>

            {/* Show All / Show Less */}
            {sortedReviews.length > 10 && (
                <div className="mt-4">
                    {showAll ? (
                        <Button variant="link" onClick={() => setShowAll(false)}>
                            Show Less
                        </Button>
                    ) : (
                        <Button variant="link" onClick={() => setShowAll(true)}>
                            Show All Reviews ({sortedReviews.length})
                        </Button>
                    )}
                </div>
            )}

            {/* Review Modal */}
            {isReviewOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => {
                                setIsReviewOpen(false);
                                setReviewRating(0);
                                setReviewComment("");
                            }}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>

                        <h2 className="text-lg font-bold mb-4">Write a Review</h2>

                        <div className="mb-4">
                            <p className="text-sm font-medium mb-1">Your Rating</p>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                        key={i}
                                        onClick={() => setReviewRating(i)}
                                        className={`h-6 w-6 cursor-pointer transition-colors duration-150 ${i <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm font-medium mb-1">Your Review</p>
                            <textarea
                                rows={4}
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Share your experience..."
                                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <Button
                            className="w-full"
                            disabled={isSubmittingReview || reviewRating === 0 || !reviewComment.trim()}
                            onClick={handleSubmitReview}
                        >
                            {isSubmittingReview ? "Submitting..." : "Submit Review"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewsSection;
