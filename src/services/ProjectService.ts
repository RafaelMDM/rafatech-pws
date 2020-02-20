import Project, { IProject } from "../db/Project";
import TagService from "../services/TagService";

class ProjectService {
  async create(projectData: IProject): Promise<IProject> {
    const { tags } = projectData;

    const tagsIds = (tags instanceof Array) ? await TagService.addTags(tags) : null;
    return Project.create({
      ...projectData,
      tags: tagsIds,
    });
  }

  async update(projectData: IProject): Promise<IProject> {
    const { tags } = projectData;
    const projectValues = {
      ...projectData,
    };
    if (tags instanceof Array) {
      await TagService.addTags(tags);
      const tagsIds = await TagService.getTagsIds(tags);
      projectValues.tags = tagsIds;
    }

    const project = await Project.findByIdAndUpdate(projectData._id, {
      $set: projectValues,
    }, { new: true });
    return project;
  }

  async remove(id: string): Promise<IProject> {
    return await Project.findByIdAndDelete(id);
  }

  async list(tags?: string[]): Promise<IProject[]> {
    const options = (tags instanceof Array) ? {
      tags: {
        $in: tags,
      },
    } : {};
    const foundProjects = await Project.find(options).lean();

    return foundProjects;
  }
};

export default new ProjectService();
