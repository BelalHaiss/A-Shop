import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  comment: String,
  rating: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
const Review = mongoose.model('Review', reviewSchema);
export default Review;
