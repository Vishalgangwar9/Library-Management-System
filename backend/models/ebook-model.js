import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const eBookSchema = new mongoose.Schema(
  {
    ISBN: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    pdfPath: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    edition: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

/* Virtual to calculate the total number of reviews and the average rating */
eBookSchema.virtual("totalReviews").get(function () {
  return this.reviews.length;
});

eBookSchema.virtual("averageRating").get(function () {
  if (this.reviews.length === 0) return 0;
  const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / this.reviews.length;
});

/* Pre-save hook to update the rating and review count */
eBookSchema.pre("save", function (next) {
  if (this.isModified("reviews")) {
    this.totalReviews = this.reviews.length;
    this.rating = this.reviews.length
      ? this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length
      : 0;
  }
  next();
});

/* Static method to add a review and update the rating */
eBookSchema.statics.addReview = async function (bookId, reviewData) {
  const book = await this.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }

  book.reviews.push(reviewData);
  await book.save();
  return book;
};

const EBookModel = mongoose.model("EBook", eBookSchema);

export default EBookModel;
