import express from 'express';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';

const router = express.Router();

const prisma = new PrismaClient();

const defaultUserId: string | null = '0b9dfc48-0ce6-4828-8433-6387e19e881f';
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

//GET POSTS
router.get('/posts', async (req, res) => {
  const data = await prisma.post
    .findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        comments: true,
        _count: { select: { likes: true } },
      },
    })
    .then(async (posts) => {
      const likes = await prisma.postLike.findMany({
        where: {
          userId: req.cookies.userId || defaultUserId,
          postId: {
            in: posts.map((post) => post.id),
          },
        },
      });
      return posts.map((post) => {
        const { _count } = post;
        return {
          ...post,
          likedByMe: likes.some((like) => like.postId === post.id),
          likeCount: _count.likes,
        };
      });
    })
    .catch((error) => {
      return error.message;
    });

  res.json(data);
});

// GET POST
router.get('/posts/:id', async (req, res) => {
  const data = await prisma.post
    .findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        body: true,
        title: true,
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            ...COMMENT_SELECT_FIELDS,
            _count: { select: { likes: true } },
          },
        },
      },
    })
    .then(async (post) => {
      const likes = await prisma.commentLike.findMany({
        where: {
          userId: req.cookies.userId || defaultUserId,
          //returns id's of all comments
          commentId: {
            in: post?.comments.map((comment) => comment.id),
          },
        },
      });
      return {
        ...post,
        comments: post?.comments.map((comment) => {
          const { _count, ...commentFields } = comment;
          return {
            ...commentFields,
            // boolean - if like in this list has comment id that matches the current comment id.
            likedByMe: likes.some((like) => like.commentId === comment.id),
            likeCount: _count.likes,
          };
        }),
      };
    });
  res.json(data);
});

//Create post
router.post('/posts', async (req, res) => {
  if (req.body.body === '' || req.body.body === null) {
    res.status(500).send({ Message: 'Error: Message is required' });
  }

  if (req.body.title === '' || req.body.title === null) {
    res.status(500).send({ Message: 'Error: Title is required' });
  }

  const data = await prisma.post.create({
    data: { title: req.body.title, body: req.body.body, userId: defaultUserId },
    select: { id: true, title: true },
  });

  res.json(data);
});

//DELETE POST
router.delete('/posts/:id', async (req, res) => {
  //   const { userId } =
  //     (await prisma.post.findUnique({
  //       where: { id: req.params.id },
  //       select: { userId: true },
  //     })) || defaultUserId;
  //   // auth check
  //   if (userId !== req.cookies.userId) {
  //     return res.send(
  //       res
  //         .status(500)
  //         .send({ message: 'You do not have permission to delete this post' })
  //     );
  //   }

  const data = await prisma.post.delete({
    where: { id: req.params.id },
    select: { id: true },
  });

  res.json(data);
});

//UPDATE POST

export default router;
