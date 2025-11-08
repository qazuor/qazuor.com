---
title: MongoDB Schema Design Patterns and Best Practices
excerpt:
  Learn effective MongoDB schema design patterns, indexing strategies, and data
  modeling techniques for scalable applications.
publishDate: 2025-01-20
tags: [MongoDB, NoSQL, Database, Node.js]
readTime: 13 min read
draft: false
---

## Schema Design Fundamentals

MongoDB's flexible schema allows for various design patterns based on your
access patterns.

```javascript
// User schema with embedded profile
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  email: "user@example.com",
  username: "johndoe",
  passwordHash: "$2b$10$...",
  profile: {
    firstName: "John",
    lastName: "Doe",
    avatar: "https://example.com/avatar.jpg",
    bio: "Full-stack developer",
    location: "San Francisco, CA",
    website: "https://johndoe.com"
  },
  preferences: {
    theme: "dark",
    notifications: {
      email: true,
      push: false
    },
    language: "en"
  },
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

## Embedding vs. Referencing

### When to Embed

```javascript
// Blog post with embedded comments (one-to-few)
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  title: "Introduction to MongoDB",
  content: "MongoDB is a NoSQL database...",
  author: {
    _id: ObjectId("507f1f77bcf86cd799439011"),
    username: "johndoe",
    avatar: "https://example.com/avatar.jpg"
  },
  comments: [
    {
      _id: ObjectId("507f1f77bcf86cd799439013"),
      userId: ObjectId("507f1f77bcf86cd799439014"),
      username: "janedoe",
      content: "Great article!",
      createdAt: ISODate("2024-01-16T09:15:00Z")
    },
    {
      _id: ObjectId("507f1f77bcf86cd799439015"),
      userId: ObjectId("507f1f77bcf86cd799439016"),
      username: "bobsmith",
      content: "Thanks for sharing!",
      createdAt: ISODate("2024-01-16T10:20:00Z")
    }
  ],
  tags: ["mongodb", "nosql", "database"],
  published: true,
  createdAt: ISODate("2024-01-15T14:00:00Z"),
  updatedAt: ISODate("2024-01-16T10:20:00Z")
}
```

### When to Reference

```javascript
// E-commerce order with references (one-to-many)
// Order collection
{
  _id: ObjectId("507f1f77bcf86cd799439017"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  items: [
    {
      productId: ObjectId("507f1f77bcf86cd799439018"),
      quantity: 2,
      price: 29.99
    },
    {
      productId: ObjectId("507f1f77bcf86cd799439019"),
      quantity: 1,
      price: 49.99
    }
  ],
  total: 109.97,
  status: "processing",
  shippingAddress: {
    street: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102"
  },
  createdAt: ISODate("2024-01-20T12:00:00Z")
}

// Product collection (referenced)
{
  _id: ObjectId("507f1f77bcf86cd799439018"),
  name: "Wireless Mouse",
  description: "Ergonomic wireless mouse",
  price: 29.99,
  stock: 150,
  category: "Electronics",
  images: ["url1", "url2"],
  reviews: [
    {
      userId: ObjectId("507f1f77bcf86cd799439020"),
      rating: 5,
      comment: "Great product!",
      createdAt: ISODate("2024-01-10T15:30:00Z")
    }
  ]
}
```

## Mongoose Schemas

```typescript
import mongoose, { Schema, Document } from 'mongoose';

interface IProfile {
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
}

interface IUser extends Document {
  email: string;
  username: string;
  passwordHash: string;
  profile: IProfile;
  preferences: {
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      push: boolean;
    };
    language: string;
  };
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
        message: 'Invalid email format',
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // Don't include in queries by default
    },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      avatar: String,
      bio: { type: String, maxlength: 500 },
      location: String,
      website: String,
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: false },
      },
      language: { type: String, default: 'en' },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property
userSchema.virtual('fullName').get(function () {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'profile.location': 1 });

// Instance method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const bcrypt = await import('bcrypt');
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static method
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

export const User = mongoose.model<IUser>('User', userSchema);
```

## Aggregation Pipeline

```javascript
// Complex analytics query
const userStats = await User.aggregate([
  // Match active users
  {
    $match: {
      'preferences.notifications.email': true,
      createdAt: { $gte: new Date('2024-01-01') },
    },
  },

  // Lookup orders
  {
    $lookup: {
      from: 'orders',
      localField: '_id',
      foreignField: 'userId',
      as: 'orders',
    },
  },

  // Add computed fields
  {
    $addFields: {
      orderCount: { $size: '$orders' },
      totalSpent: {
        $sum: '$orders.total',
      },
    },
  },

  // Group by location
  {
    $group: {
      _id: '$profile.location',
      userCount: { $sum: 1 },
      avgOrderCount: { $avg: '$orderCount' },
      totalRevenue: { $sum: '$totalSpent' },
      topUsers: {
        $push: {
          username: '$username',
          totalSpent: '$totalSpent',
        },
      },
    },
  },

  // Sort top users
  {
    $addFields: {
      topUsers: {
        $slice: [
          {
            $sortArray: {
              input: '$topUsers',
              sortBy: { totalSpent: -1 },
            },
          },
          5,
        ],
      },
    },
  },

  // Sort by revenue
  {
    $sort: { totalRevenue: -1 },
  },

  // Limit results
  {
    $limit: 10,
  },
]);
```

## Indexing Strategies

```javascript
// Compound index for common queries
db.posts.createIndex({ userId: 1, createdAt: -1 });

// Text index for search
db.posts.createIndex({ title: 'text', content: 'text' });

// Geospatial index
db.locations.createIndex({ coordinates: '2dsphere' });

// Partial index (only index published posts)
db.posts.createIndex(
  { createdAt: -1 },
  { partialFilterExpression: { published: true } }
);

// TTL index (auto-delete after 30 days)
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

// Query with text search
const results = await db.posts
  .find(
    { $text: { $search: 'mongodb tutorial' } },
    { score: { $meta: 'textScore' } }
  )
  .sort({ score: { $meta: 'textScore' } });

// Geospatial query
const nearbyLocations = await db.locations.find({
  coordinates: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [-122.4194, 37.7749], // [longitude, latitude]
      },
      $maxDistance: 5000, // 5km
    },
  },
});
```

## Transactions

```typescript
import mongoose from 'mongoose';

async function transferFunds(
  fromUserId: string,
  toUserId: string,
  amount: number
) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Deduct from sender
    const sender = await User.findByIdAndUpdate(
      fromUserId,
      { $inc: { balance: -amount } },
      { session, new: true }
    );

    if (!sender || sender.balance < 0) {
      throw new Error('Insufficient funds');
    }

    // Add to receiver
    await User.findByIdAndUpdate(
      toUserId,
      { $inc: { balance: amount } },
      { session, new: true }
    );

    // Create transaction record
    await Transaction.create(
      [
        {
          fromUserId,
          toUserId,
          amount,
          status: 'completed',
          createdAt: new Date(),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
```

## Conclusion

MongoDB's flexible schema design enables powerful data modeling patterns. Choose
your design based on your access patterns and data relationships!
