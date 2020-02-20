import mongoose from 'mongoose';
import Project, { IProject } from '../db/Project';
import Tag from '../db/Tag';
import ps from './ProjectService';

describe('Project Service', () => {
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
    await Project.deleteMany({});
    await Tag.deleteMany({});
  });

  it('should be able to create new Projects', async () => {
    const requestBody: IProject = {
      name: 'Teste',
      license: 'MIT',
      releaseDate: new Date(),
      tags: ['teste', 'jest'],
    };
    await ps.create(requestBody);

    const createdTags = await Tag.find({}).lean();
    expect(createdTags).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: 'teste' }),
      expect.objectContaining({ title: 'jest' }),
    ]));

    const tagsIds = createdTags
      .filter(tag => tag.title === 'teste' || tag.title === 'jest')
      .map(tag => tag._id);
    const createdProjects = await Project.find({}).lean();
    expect(createdProjects).toEqual([
      expect.objectContaining({
        name: requestBody.name,
        license: requestBody.license,
        releaseDate: requestBody.releaseDate,
        tags: expect.arrayContaining(tagsIds),
      }),
    ]);
  });

  it('should not create duplicate Tags', async () => {
    const requestBody = {
      name: 'Teste',
      license: 'MIT',
      releaseDate: new Date(),
      tags: ['teste', 'jest'],
    };
    await Tag.create({ title: 'teste' });
    await ps.create(requestBody);

    const createdTags = await Tag.find({}).lean();
    expect(createdTags).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: 'teste' }),
      expect.objectContaining({ title: 'jest' }),
    ]));

    const tagsIds = createdTags.map(tag => tag._id);
    const createdProjects = await Project.find({}).lean();
    expect(createdProjects).toEqual(expect.arrayContaining([
      expect.objectContaining({ tags: expect.arrayContaining(tagsIds) }),
    ]));
  });

  it('should be able to update existing Projects', async () => {
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
    const changed = await ps.update(requestBody);
    expect(changed).toBeTruthy();

    const createdTags = await Tag.find({}).lean();
    expect(createdTags).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: 'teste' }),
      expect.objectContaining({ title: 'jest' }),
      expect.objectContaining({ title: 'novatag' }),
    ]));

    const tagsIds = createdTags.map(tag => tag._id);
    const updatedProjects = await Project.find({}).lean();
    expect(updatedProjects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: requestBody.name,
        license: requestBody.license,
        releaseDate: existingProject.releaseDate,
        description: requestBody.description,
        tags: expect.arrayContaining(tagsIds),
      }),
    ]));
  });

  it('should be able to delete Projects', async () => {
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

  it('should return a list of Projects filtered by Tag', async () => {
    const Projects = [{
      name: 'React',
      license: 'MIT',
      releaseDate: new Date(),
      tags: ['react'],
    }, {
      name: 'Node',
      license: 'MIT',
      releaseDate: new Date(),
      tags: ['react', 'node'],
    }, {
      name: 'Python',
      license: 'MIT',
      releaseDate: new Date(),
      tags: ['python'],
    }];

    for (const project of Projects) {
      await ps.create(project);
    }
    const createdTags = await Tag.find({}).lean();
    const filter1 = createdTags
      .filter(tag => tag.title === 'react')
      .map(tag => tag._id);
    const list1 = await ps.list(filter1);
    expect(list1).toEqual(expect.arrayContaining([
      expect.objectContaining({ tags: expect.arrayContaining(filter1) }),
    ]));

    const filter2 = createdTags
      .filter(tag => tag.title === 'python' || tag.title === 'node')
      .map(tag => tag._id);
    const list2 = await ps.list(filter2);
    expect(list2).toEqual(expect.arrayContaining([
      expect.objectContaining({ tags: expect.arrayContaining([filter2[0]]) }),
      expect.objectContaining({ tags: expect.arrayContaining([filter2[1]]) }),
    ]));
  });
});
