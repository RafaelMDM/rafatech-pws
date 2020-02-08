import Post, { IPost } from "@schemas/Post";
import TagService from "@services/TagService";

class BlogService {
  async create(postData: IPost): Promise<IPost> {
    const { tags } = postData;

    const tagsIds = (tags instanceof Array) ? await TagService.addTags(tags) : null;
    return Post.create({
      ...postData,
      tags: tagsIds,
    });
  }

  async update(postData: IPost): Promise<void> {
    const { tags } = postData;
    if (tags instanceof Array)  await TagService.addTags(tags);

    const tagsIds = await TagService.getTagsIds(tags);
    await Post.findByIdAndUpdate(postData._id, {
      $set: {
        ...postData,
        tags: tagsIds
      }
    });
  }

  async remove(id: string): Promise<void> {
    await Post.findByIdAndDelete(id);
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

export default BlogService;
