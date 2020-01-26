import Project, { IProject } from "@schemas/Project";
import Tag from "@schemas/Tag";

class ProjectService {
  async create(projectData: IProject): Promise<IProject> {
    const { tags } = projectData;

    const tagsIds = (tags instanceof Array) ? await this.addTags(tags) : null;
    return Project.create({
      ...projectData,
      tags: tagsIds,
    });
  }

  async update(projectData: IProject): Promise<void> {
    const { tags } = projectData;
    if (tags instanceof Array)  await this.addTags(tags);

    const tagsIds = await Tag.find({
      title: {
        $in: tags,
      },
    });
    await Project.findByIdAndUpdate(projectData._id, {
      $set: {
        ...projectData,
        tags: tagsIds
      }
    });
  }

  async remove(id: string): Promise<void> {
    await Project.findByIdAndDelete(id);
  }

  async list() {}

  private async addTags(tags: string[]): Promise<number[]> {
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
    const createdTagsIds: number[] = createdTags.map(tag => tag._id);

    return createdTagsIds;
  }
};

export default ProjectService;

function isValidProjectKey(key: string, project: IProject): key is keyof IProject {
  return key in project;
}
