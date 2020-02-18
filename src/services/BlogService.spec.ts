import mongoose from 'mongoose';
import Post, { IPost } from "../db/Post";
import bs from "./BlogService";

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

  afterEach(async () => {
    await Post.deleteMany({});
  });

  it('should be able to create new Posts', async () => {
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
});
