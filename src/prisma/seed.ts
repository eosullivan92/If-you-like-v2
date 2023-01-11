/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  const eamonn = await prisma.user.create({ data: { name: 'Eamonn' } });
  const keith = await prisma.user.create({ data: { name: 'Keith' } });

  const post1 = await prisma.post.create({
    data: {
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pellentesque elit id orci porttitor lobortis. Cras bibendum dolor nec ligula consequat, vitae dignissim elit sollicitudin. Curabitur porta elementum fringilla. Morbi porttitor ex eget mi vehicula, sed aliquam sem sodales. Morbi ultrices dictum massa, quis eleifend erat. Maecenas molestie, nisi in ultricies sagittis, ex elit mollis lorem, quis lacinia nisi lorem mollis massa. Curabitur dui turpis, scelerisque vitae augue a, volutpat laoreet dui. Sed condimentum molestie nunc vitae dictum. Pellentesque vel laoreet eros, a malesuada arcu. Quisque a justo mattis, iaculis magna vitae, mattis nulla. Proin a libero vestibulum, ornare neque vel, molestie turpis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      title: 'Post 1',
      userId: eamonn.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pellentesque elit id orci porttitor lobortis. Cras bibendum dolor nec ligula consequat, vitae dignissim elit sollicitudin. Curabitur porta elementum fringilla. Morbi porttitor ex eget mi vehicula, sed aliquam sem sodales. Morbi ultrices dictum massa, quis eleifend erat. Maecenas molestie, nisi in ultricies sagittis, ex elit mollis lorem, quis lacinia nisi lorem mollis massa. Curabitur dui turpis, scelerisque vitae augue a, volutpat laoreet dui. Sed condimentum molestie nunc vitae dictum. Pellentesque vel laoreet eros, a malesuada arcu. Quisque a justo mattis, iaculis magna vitae, mattis nulla. Proin a libero vestibulum, ornare neque vel, molestie turpis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      title: 'Post 2',
      userId: eamonn.id,
    },
  });

  const comment1 = await prisma.comment.create({
    data: {
      message: 'I am a root comment',
      userId: eamonn.id,
      postId: post1.id,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      message: 'I am another root comment',
      userId: keith.id,
      postId: post1.id,
    },
  });

  const comment3 = await prisma.comment.create({
    data: {
      message: 'I am a nested comment',
      parentId: comment1.id,
      userId: eamonn.id,
      postId: post1.id,
    },
  });
}

seed();
