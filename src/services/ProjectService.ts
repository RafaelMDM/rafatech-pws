import Project, { projectProps } from "@schemas/Project";
import Tag from "@schemas/Tag";

class ProjectService {
  async create(body: projectProps): Promise<void> {
    const { tags } = body;

    const existentTags = await Tag.find({
      title: {
        $in: tags,
      },
    }).lean();
    const existentTagTitles = existentTags.map(tag => tag.title);

    const newTagsData = tags
      .filter(tag => !existentTagTitles.includes(tag))
      .map(tag => ({ title: tag }));
    const createdTags = await Tag.create(newTagsData);
    const tagsIds = createdTags.map(tag => tag._id);

    await Project.create({
      ...body,
      tags: tagsIds,
    });
  }

  async list() {}
};

export default ProjectService;
