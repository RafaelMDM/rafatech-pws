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

  async update(projectData: IProject): Promise<boolean> {
    const { tags } = projectData;
    if (tags instanceof Array) {
      await TagService.addTags(tags);
      const tagsIds = await TagService.getTagsIds(tags);
      const project = await Project.findByIdAndUpdate(projectData._id, {
        $set: {
          ...projectData,
          tags: tagsIds,
        }
      });
      return !!project;
    }

    const project = await Project.findByIdAndUpdate(projectData._id, {
      $set: {
        ...projectData,
      }
    });
    return !!project;
  }

  async remove(id: string): Promise<void> {
    await Project.findByIdAndDelete(id);
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
