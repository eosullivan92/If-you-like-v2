import express, { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

type Error = {
  message?: string;
};

const router = express.Router();

const prisma = new PrismaClient();

//FAKING AUTHENTICATION
router.use(function (req, res, next) {
  if (req.cookies.userId !== defaultUserId) {
    req.cookies.userId = defaultUserId;
    res.clearCookie('userId');
    res.cookie('userId', defaultUserId);
  }
  next();
});

// Top level await is causing a TS error here, even though target/module is set to ESNEXT. If fixed, replace with await prisma user
const defaultUserId = '6916a93e-97c7-403c-942a-f028b3b58806';

const COMMENT_SELECT_FIELDS = {
  id: true,
  message: true,
  parentId: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

const postsWithComments = Prisma.validator<Prisma.PostArgs>()({
  select: { id: true, title: true, comments: true, likes: true },
});
type PostsWithComments = Prisma.PostGetPayload<typeof postsWithComments>;

//GET POSTS
router.get('/posts', async (req: Request, res: Response) => {
  const data = await prisma.post
    .findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        comments: true,
        likes: true,
      },
    })
    .then(async (posts: PostsWithComments[]) => {
      const userLikes = await prisma.postLike.findMany({
        where: {
          userId: req.cookies.userId || defaultUserId,
          postId: {
            in: posts.map((post: PostsWithComments) => post.id),
          },
        },
      });
      return posts.map((post: PostsWithComments) => {
        const { likes } = post;
        return {
          ...post,
          likedByMe: userLikes.some(
            (like: PostLikeT) => like.postId === post.id
          ),
          likeCount: likes.length,
        };
      });
    })
    .catch((error: Error) => {
      return error.message;
    });

  res.json(data);
});

const postWithComments = Prisma.validator<Prisma.PostArgs>()({
  select: {
    body: true,
    title: true,
    user: true,
    comments: { select: { ...COMMENT_SELECT_FIELDS, likes: true } },
  },
});
const postLikeT = Prisma.validator<Prisma.PostLikeArgs>()({
  select: { userId: true, postId: true },
});
const commentsWithLikes = Prisma.validator<Prisma.CommentArgs>()({
  select: { ...COMMENT_SELECT_FIELDS, likes: true },
});
const commentLikeT = Prisma.validator<Prisma.CommentLikeArgs>()({
  select: { userId: true, commentId: true },
});

type PostWithComments = Prisma.PostGetPayload<typeof postWithComments> | null;
type PostLikeT = Prisma.PostLikeGetPayload<typeof postLikeT>;
type CommentLikeT = Prisma.CommentLikeGetPayload<typeof commentLikeT>;

// GET POST
router.get('/posts/:id', async (req: Request, res: Response) => {
  const data = await prisma.post
    .findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        body: true,
        title: true,
        user: true,
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            ...COMMENT_SELECT_FIELDS,
            likes: true,
          },
        },
      },
    })
    .then(async (post: PostWithComments) => {
      const userLikes = await prisma.commentLike.findMany({
        where: {
          userId: req.cookies.userId,
          //returns id's of all comments
          commentId: {
            in: post?.comments.map((comment: CommentsWithLikes) => comment.id),
          },
        },
      });
      return {
        ...post,
        comments: post?.comments.map((comment: CommentsWithLikes) => {
          const { likes, ...commentFields } = comment;
          return {
            ...commentFields,
            // boolean - if like in this list has comment id that matches the current comment id.
            likedByMe: userLikes.some(
              (like: CommentLikeT) => like.commentId === comment.id
            ),
            likeCount: likes.length,
          };
        }),
      };
    });
  res.json(data);
});

//Create post
router.post('/posts', async (req: Request, res: Response) => {
  if (req.body.body === '' || req.body.body === null) {
    res.status(500).send({ Message: 'Error: Message is required' });
  }

  if (req.body.title === '' || req.body.title === null) {
    res.status(500).send({ Message: 'Error: Title is required' });
  }
  console.log(req.cookies.userId);
  const data = await prisma.post.create({
    data: {
      title: req.body.title,
      body: req.body.body,
      userId: req.cookies.userId,
    },
    select: { id: true, title: true },
  });

  res.json(data);
});

//DELETE POST
router.delete('/posts/:id', async (req: Request, res: Response) => {
  const userId = await prisma.post.findUnique({
    where: { id: req.params.id },
    select: { userId: true },
  });
  // auth check
  if (userId?.userId !== req.cookies.userId) {
    return res
      .status(500)
      .send({ message: 'You do not have permission to delete this post' });
  }

  const data = await prisma.post.delete({
    where: { id: req.params.id },
    select: { id: true },
  });

  res.json(data);
});

//UPDATE POST
router.put('/posts/:id', async (req: Request, res: Response) => {
  if (req.body.body === '' || req.body.body === null) {
    res.status(500).send({ Message: 'Error: Message is required' });
  }

  if (req.body.title === '' || req.body.title === null) {
    res.status(500).send({ Message: 'Error: Title is required' });
  }

  const userId = await prisma.post.findUnique({
    where: { id: req.params.id },
    select: { userId: true },
  });

  if (userId?.userId !== req.cookies.userId) {
    return res
      .status(500)
      .send({ message: 'You do not have permission to edit this post' });
  }

  const data = await prisma.post.update({
    where: { id: req.params.id },
    data: { title: req.body.title, body: req.body.body },
    select: { id: true, title: true, body: true },
  });

  res.json(data);
});

// TOGGLE POST LIKE
router.post('/posts/:id/toggleLike', async (req: Request, res: Response) => {
  const data = {
    postId: req.params.id,
    userId: req.cookies.userId,
  };

  const like = await prisma.postLike.findUnique({
    where: { userId_postId: data },
  });

  if (like == null) {
    return await prisma.postLike.create({ data }).then(() => {
      res.json({ addLike: true });
    });
  } else {
    return await prisma.postLike
      .delete({
        where: { userId_postId: data },
      })
      .then(() => {
        res.json({ addLike: false });
      });
  }
});

const commentsT = Prisma.validator<Prisma.CommentArgs>()({
  select: { ...COMMENT_SELECT_FIELDS },
});

type CommentsT = Prisma.CommentGetPayload<typeof commentsT>;

//CREATE COMMENT
type CommentsWithLikes = Prisma.CommentGetPayload<typeof commentsWithLikes>;
router.post('/posts/:id/comments', async (req: Request, res: Response) => {
  //error
  if (req.body.message === '' || req.body.message === null) {
    res.status(500).send({ message: 'Error: Message is required' });
  }

  const data = await prisma.comment
    .create({
      data: {
        message: req.body.message,
        userId: req.cookies.userId,
        parentId: req.body.parentId,
        postId: req.params.id,
      },
      select: COMMENT_SELECT_FIELDS,
    })
    .then((comment: CommentsT) => {
      return {
        // brand new comment has no likes
        ...comment,
        likeCount: 0,
        likedByMe: false,
      };
    });

  res.json(data);
});

//UPDATE COMMENT
router.put(
  '/posts/:id/comments/:commentId',
  async (req: Request, res: Response) => {
    //error check
    if (req.body.message === '' || req.body.message === null) {
      res.status(500).send({ message: 'Error: Message is required' });
    }

    const userId = await prisma.comment.findUnique({
      where: { id: req.params.commentId },
      select: { userId: true },
    });

    // auth check
    if (userId?.userId !== req.cookies.userId) {
      return res
        .status(500)
        .send({ message: 'You do not have permission to edit this comment' });
    }

    const data = await prisma.comment.update({
      where: { id: req.params.commentId },
      data: { message: req.body.message },
      select: { message: true },
    });

    res.json(data);
  }
);

//DELETE COMMENT
router.delete(
  '/posts/:id/comments/:commentId',
  async (req: Request, res: Response) => {
    const userId = await prisma.comment.findUnique({
      where: { id: req.params.commentId },
      select: { userId: true },
    });

    // auth check
    if (userId?.userId !== req.cookies.userId) {
      return res
        .status(500)
        .send({ message: 'You do not have permission to delete this comment' });
    }

    const data = await prisma.comment.delete({
      where: { id: req.params.commentId },
      select: { id: true },
    });

    res.json(data);
  }
);

//TOGGLE COMMENT LIKE
router.post(
  '/posts/:id/comments/:commentId/toggleLike',
  async (req: Request, res: Response) => {
    const data = {
      commentId: req.params.commentId,
      userId: req.cookies.userId,
    };

    const like = await prisma.commentLike.findUnique({
      where: { userId_commentId: data },
    });

    if (like == null) {
      return await prisma.commentLike.create({ data }).then(() => {
        res.json({ addLike: true });
      });
    } else {
      return await prisma.commentLike
        .delete({
          where: { userId_commentId: data },
        })
        .then(() => {
          res.json({ addLike: false });
        });
    }
  }
);

export default router;
