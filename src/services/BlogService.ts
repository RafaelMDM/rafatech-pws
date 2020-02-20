import Post, { IPost } from "../db/Post";
import TagService from "../services/TagService";

class BlogService {
  async create(postData: IPost): Promise<IPost> {
    const { tags } = postData;

    const tagsIds = (tags instanceof Array) ? await TagService.addTags(tags) : null;
    return Post.create({
      ...postData,
      tags: tagsIds,
    });
  }

  async update(postData: IPost): Promise<IPost> {
    const { tags } = postData;
    const postValues = {
      ...postData,
    };
    if (tags instanceof Array) {
      await TagService.addTags(tags);
      const tagsIds = await TagService.getTagsIds(tags);
      postValues.tags = tagsIds;
    }

    const post = await Post.findByIdAndUpdate(postData._id, {
      $set: postValues,
    }, { new: true });
    return post;
  }

  async remove(id: string): Promise<IPost> {
    return await Post.findByIdAndDelete(id);
  }

  async list(tags?: string[]): Promise<IPost[]> {
    const options = (tags instanceof Array) ? {
      tags: {
        $in: tags,
      },
    } : {};
    const foundPosts = await Post.find(options).lean();

    return foundPosts;
  }
}

export default new BlogService();
