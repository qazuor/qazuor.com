---
title: GraphQL API Design and Best Practices
excerpt:
  Learn how to design efficient GraphQL APIs with proper schema design,
  resolvers, and query optimization techniques.
publishDate: 2025-01-19
tags: [GraphQL, API, Node.js, TypeScript]
readTime: 14 min read
draft: false
---

## Schema Definition

GraphQL schemas define the structure of your API.

```graphql
type User {
  id: ID!
  email: String!
  username: String!
  profile: Profile
  posts: [Post!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Profile {
  id: ID!
  bio: String
  avatar: String
  website: String
  location: String
}

type Post {
  id: ID!
  title: String!
  content: String!
  published: Boolean!
  author: User!
  comments: [Comment!]!
  tags: [Tag!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Comment {
  id: ID!
  content: String!
  author: User!
  post: Post!
  createdAt: DateTime!
}

type Tag {
  id: ID!
  name: String!
  posts: [Post!]!
}
```

## Queries and Mutations

```graphql
type Query {
  user(id: ID!): User
  users(limit: Int, offset: Int): [User!]!
  post(id: ID!): Post
  posts(filter: PostFilter, pagination: PaginationInput): PostConnection!
  searchPosts(query: String!): [Post!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!

  createPost(input: CreatePostInput!): Post!
  updatePost(id: ID!, input: UpdatePostInput!): Post!
  deletePost(id: ID!): Boolean!
  publishPost(id: ID!): Post!

  addComment(postId: ID!, content: String!): Comment!
}

input CreateUserInput {
  email: String!
  username: String!
  password: String!
  profile: ProfileInput
}

input UpdateUserInput {
  email: String
  username: String
  profile: ProfileInput
}

input ProfileInput {
  bio: String
  avatar: String
  website: String
  location: String
}

input CreatePostInput {
  title: String!
  content: String!
  tags: [String!]
}

input UpdatePostInput {
  title: String
  content: String
  published: Boolean
  tags: [String!]
}

input PostFilter {
  published: Boolean
  authorId: ID
  tags: [String!]
}

input PaginationInput {
  limit: Int = 10
  offset: Int = 0
}

type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PostEdge {
  node: Post!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

## Resolvers Implementation

```typescript
import { GraphQLResolveInfo } from 'graphql';

interface Context {
  db: Database;
  currentUser?: User;
}

const resolvers = {
  Query: {
    user: async (
      _parent: unknown,
      { id }: { id: string },
      context: Context,
      _info: GraphQLResolveInfo
    ) => {
      return context.db.users.findById(id);
    },

    users: async (
      _parent: unknown,
      { limit = 10, offset = 0 }: { limit?: number; offset?: number },
      context: Context
    ) => {
      return context.db.users.findMany({ limit, offset });
    },

    posts: async (
      _parent: unknown,
      {
        filter,
        pagination,
      }: { filter?: PostFilter; pagination?: PaginationInput },
      context: Context
    ) => {
      const { limit = 10, offset = 0 } = pagination || {};

      const posts = await context.db.posts.findMany({
        where: filter,
        limit: limit + 1, // Fetch one extra to check if there's a next page
        offset,
      });

      const hasNextPage = posts.length > limit;
      const edges = posts.slice(0, limit).map((post, index) => ({
        node: post,
        cursor: Buffer.from(`${offset + index}`).toString('base64'),
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: offset > 0,
          startCursor: edges[0]?.cursor,
          endCursor: edges[edges.length - 1]?.cursor,
        },
        totalCount: await context.db.posts.count({ where: filter }),
      };
    },
  },

  Mutation: {
    createUser: async (
      _parent: unknown,
      { input }: { input: CreateUserInput },
      context: Context
    ) => {
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(input.password, 10);

      return context.db.users.create({
        ...input,
        password: hashedPassword,
      });
    },

    createPost: async (
      _parent: unknown,
      { input }: { input: CreatePostInput },
      context: Context
    ) => {
      if (!context.currentUser) {
        throw new Error('Authentication required');
      }

      return context.db.posts.create({
        ...input,
        authorId: context.currentUser.id,
      });
    },

    publishPost: async (
      _parent: unknown,
      { id }: { id: string },
      context: Context
    ) => {
      if (!context.currentUser) {
        throw new Error('Authentication required');
      }

      const post = await context.db.posts.findById(id);

      if (post.authorId !== context.currentUser.id) {
        throw new Error('Not authorized');
      }

      return context.db.posts.update(id, { published: true });
    },
  },

  User: {
    profile: async (parent: User, _args: unknown, context: Context) => {
      return context.db.profiles.findByUserId(parent.id);
    },

    posts: async (parent: User, _args: unknown, context: Context) => {
      return context.db.posts.findByAuthorId(parent.id);
    },
  },

  Post: {
    author: async (parent: Post, _args: unknown, context: Context) => {
      return context.db.users.findById(parent.authorId);
    },

    comments: async (parent: Post, _args: unknown, context: Context) => {
      return context.db.comments.findByPostId(parent.id);
    },

    tags: async (parent: Post, _args: unknown, context: Context) => {
      return context.db.tags.findByPostId(parent.id);
    },
  },
};
```

## DataLoader for N+1 Problem

```typescript
import DataLoader from 'dataloader';

function createLoaders(db: Database) {
  const userLoader = new DataLoader<string, User>(async (ids) => {
    const users = await db.users.findByIds(ids);
    const userMap = new Map(users.map((user) => [user.id, user]));
    return ids.map((id) => userMap.get(id) || null);
  });

  const postLoader = new DataLoader<string, Post[]>(async (authorIds) => {
    const posts = await db.posts.findByAuthorIds(authorIds);
    const postsByAuthor = new Map<string, Post[]>();

    posts.forEach((post) => {
      const existing = postsByAuthor.get(post.authorId) || [];
      postsByAuthor.set(post.authorId, [...existing, post]);
    });

    return authorIds.map((id) => postsByAuthor.get(id) || []);
  });

  return { userLoader, postLoader };
}

// Use in context
const context = {
  db,
  currentUser,
  loaders: createLoaders(db),
};

// Use in resolvers
const user = await context.loaders.userLoader.load(userId);
```

## Server Setup with Apollo

```typescript
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';

const typeDefs = readFileSync('./schema.graphql', 'utf-8');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error(error);
    return {
      message: error.message,
      code: error.extensions?.code,
      path: error.path,
    };
  },
});

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const currentUser = token ? await verifyToken(token) : null;

    return {
      db,
      currentUser,
      loaders: createLoaders(db),
    };
  },
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);
```

## Conclusion

GraphQL provides a powerful and flexible approach to API design. Proper schema
design and resolver optimization are key to building efficient APIs!
