import Project, { IProject } from "@schemas/Project";
import TagService from "@services/TagService";

class ProjectService {
  async create(projectData: IProject): Promise<IProject> {
    const { tags } = projectData;

    const tagsIds = (tags instanceof Array) ? await TagService.addTags(tags) : null;
    return Project.create({
      ...projectData,
      tags: tagsIds,
    });
  }

  async update(projectData: IProject): Promise<void> {
    const { tags } = projectData;
    if (tags instanceof Array)  await TagService.addTags(tags);

    const tagsIds = await TagService.getTagsIds(tags);
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

export default ProjectService;
