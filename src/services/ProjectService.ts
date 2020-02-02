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

  private async addTags(tags: string[]): Promise<string[]> {
    const existentTags = await Tag.find({
      title: {
        $in: tags,
      },
    }).lean();
    const existentTagsData = existentTags.reduce((data, tag) => {
      data.ids.push(tag._id);
      data.titles.push(tag.title);
      return data;
    }, { ids: [], titles: [] });

    const newTagsData = tags
      .filter(tag => !existentTagsData.titles.includes(tag))
      .map(tag => ({ title: tag }));
    const createdTags = await Tag.create(newTagsData);
    const createdTagsIds: string[] = createdTags.map(tag => tag._id);

    return [ ...existentTagsData.ids, ...createdTagsIds ];
  }
};

export default ProjectService;

