import mongoose from 'mongoose';
import Project, { IProject } from '@schemas/Project';
import Tag from '@schemas/Tag';
import ProjectService from './ProjectService';

describe('Project Service', () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URL) {
      throw new Error('MongoDB server not initialized');
    }

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Project.deleteMany({});
    await Tag.deleteMany({});
  });

  it('should be able to create new Projects', async () => {
    const ps = new ProjectService();
    const requestBody: IProject = {
      name: 'Teste',
      license: 'MIT',
      releaseDate: new Date(),
      tags: ['teste', 'jest'],
    };
    await ps.create(requestBody);

    const createdTags = await Tag.find({}).lean();
    expect(createdTags).toEqual([
      expect.objectContaining({ title: 'teste' }),
      expect.objectContaining({ title: 'jest' }),
    ]);

    const tagsIds = createdTags.map(tag => tag._id);
    const createdProjects = await Project.find({}).lean();
    expect(createdProjects).toEqual([
      expect.objectContaining({
        name: requestBody.name.toLowerCase(),
        license: requestBody.license.toLowerCase(),
        releaseDate: requestBody.releaseDate,
        tags: tagsIds,
      }),
    ]);
  });

  it('should not create duplicate Tags', async () => {
    const ps = new ProjectService();
    const requestBody = {
      name: 'Teste',
      license: 'MIT',
      releaseDate: new Date(),
      tags: ['teste', 'jest'],
    };
    await Tag.create({ title: 'teste' });
    await ps.create(requestBody);

    const createdTags = await Tag.find({}).lean();
    expect(createdTags).toEqual([
      expect.objectContaining({ title: 'teste' }),
      expect.objectContaining({ title: 'jest' }),
    ]);
  });

  it('should be able to update existing Projects', async () => {
    const ps = new ProjectService();
    const existingProject = {
      name: 'Teste',
      license: 'MIT',
      releaseDate: new Date(),
      tags: ['teste', 'jest'],
    };
    const { _id: createdId } = await ps.create(existingProject);
    const requestBody = {
      _id: createdId,
      name: 'Teste',
      license: 'GNU',
      description: 'Testando atualização de projeto',
      tags: ['teste', 'jest', 'novaTag'],
    };
    await ps.update(requestBody);

    const createdTags = await Tag.find({}).lean();
    expect(createdTags).toEqual([
      expect.objectContaining({ title: 'teste' }),
      expect.objectContaining({ title: 'jest' }),
      expect.objectContaining({ title: 'novatag' }),
    ]);

    const tagsIds = createdTags.map(tag => tag._id);
    const updatedProjects = await Project.find({}).lean();
    expect(updatedProjects).toEqual([
      expect.objectContaining({
        name: requestBody.name.toLowerCase(),
        license: requestBody.license.toLowerCase(),
        releaseDate: existingProject.releaseDate,
        description: requestBody.description,
        tags: expect.arrayContaining(tagsIds),
      }),
    ]);
  });

  it('should be able to delete Projects', async () => {
    const ps = new ProjectService();
    const existingProject = {
      name: 'Teste',
      license: 'MIT',
      releaseDate: new Date(),
      tags: ['teste', 'jest'],
    };
    const { _id: createdId } = await ps.create(existingProject);

    await ps.remove(createdId);
    const projectList = await Project.find({});

    expect(projectList).toEqual([]);
  });
});
