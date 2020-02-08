import mongoose from 'mongoose';
import Post, { IPost } from "@schemas/Post";
import BlogService from "./BlogService";
import TagService from "./TagService";

describe('Blog Service', () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URL) {
      throw new Error('MongoDB server not initialized');
    }

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Post.deleteMany({});
  });

  it('should be able to create new Posts', async () => {
    const bs = new BlogService();
    const requestData: IPost = {
      author: 'RafaelMDM',
      publishDate: new Date(),
      published: true,
      title: 'Primeiro Post',
      body: 'Isso é um <strong>Post</strong>',
    };
    await bs.create(requestData);

    const createdPosts = await Post.find({}).lean();
    expect(createdPosts).toEqual([
      expect.objectContaining({
        author: requestData.author,
        publishDate: requestData.publishDate,
        published: requestData.published,
        title: requestData.title,
        body: requestData.body,
      }),
    ]);
  });

  it('should be able to update existing Posts', async () => {
    const bs = new BlogService();
    const existingProject: IPost = {
      author: 'RafaelMDM',
      publishDate: new Date(),
      published: true,
      title: 'Primeiro Post',
      body: 'Isso é um <strong>Post</strong>',
    };
    const { _id: createdId } = await bs.create(existingProject);
    const requestBody = {
      _id: createdId,
      body: `Post modificado em: ${new Date().toLocaleDateString()}`,
    };
    await bs.update(requestBody);

    const updatedPosts = await Post.find({}).lean();
    expect(updatedPosts).toEqual([
      expect.objectContaining({
        author: existingProject.author,
        publishDate: existingProject.publishDate,
        published: existingProject.published,
        title: existingProject.title,
        body: requestBody.body,
      }),
    ]);
  });

  it('should be able to delete Posts', async () => {
    const bs = new BlogService();
    const existingProject = {
      author: 'RafaelMDM',
      publishDate: new Date(),
      published: true,
      title: 'Primeiro Post',
      body: 'Isso é um <strong>Post</strong>',
    };
    const { _id: createdId } = await bs.create(existingProject);

    await bs.remove(createdId);
    const projectList = await Post.find({});

    expect(projectList).toEqual([]);
  });

  it('should return a list of Projects filtered by Tag', async () => {
    const bs = new BlogService();
    const Projects = [{
      author: 'RafaelMDM',
      publishDate: new Date(),
      published: true,
      title: 'Primeiro Post',
      body: 'Isso é um <strong>Post</strong>',
      tags: ['tag1'],
    }, {
      author: 'RafaelMDM',
      publishDate: new Date(),
      published: true,
      title: 'Segundo Post',
      body: 'Isso é um <strong>Post</strong>',
      tags: ['tag1', 'tag2'],
    }, {
      author: 'RafaelMDM',
      publishDate: new Date(),
      published: true,
      title: 'Terceiro Post',
      body: 'Isso é um <strong>Post</strong>',
      tags: ['tag3'],
    }];

    for (const project of Projects) {
      await bs.create(project);
    }
    const createdTags = await TagService.list({});
    const filter1 = createdTags
      .filter(tag => tag.title === 'tag1')
      .map(tag => tag._id);
    const list1 = await bs.list(filter1);
    expect(list1).toEqual(expect.arrayContaining([
      expect.objectContaining({ tags: expect.arrayContaining(filter1) }),
    ]));

    const filter2 = createdTags
      .filter(tag => tag.title === 'tag3' || tag.title === 'tag2')
      .map(tag => tag._id);
    const list2 = await bs.list(filter2);
    expect(list2).toEqual(expect.arrayContaining([
      expect.objectContaining({ tags: expect.arrayContaining([filter2[0]]) }),
      expect.objectContaining({ tags: expect.arrayContaining([filter2[1]]) }),
    ]));
  });
});