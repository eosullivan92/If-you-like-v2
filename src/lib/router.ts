import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

const prisma = new PrismaClient();

router.get('/', async (_req, res) => {
  //   res.status(200).json({ message: 'Hello World!' });
  const data = await prisma.post.findMany({
    select: {
      title: true,
    },
  });
  res.send(data);
});

// const COMMENT_SELECT_FIELDS = {
//   id: true,
//   message: true,
//   parentId: true,
//   createdAt: true,
//   user: {
//     select: {
//       id: true,
//       name: true,
//     },
//   },
// };

router.get('/posts', async (_req, res) => {
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
    // .then(async (posts) => {
    //   const likes = await prisma.postLike.findMany({
    //     where: {
    //       userId: req.cookies.userId,
    //       postId: {
    //         in: posts.map((post) => post.id),
    //       },
    //     },
    //   });
    //   return posts.map((post) => {
    //     const { _count } = post;
    //     return {
    //       ...post,
    //       likedByMe: likes.some((like) => like.postId === post.id),
    //       likeCount: _count.likes,
    //     };
    //   });
    // })
    .catch((error) => {
      return error.message;
    });

  res.json(data);
});

export default router;
