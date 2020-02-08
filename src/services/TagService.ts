import Tag, { ITag } from "@schemas/Tag";

type tagSearchOptions = {
  id?: string,
  title?: string,
}

class TagService {
  static async addTags(tags: string[]): Promise<string[]> {
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

  static async getTagsIds(tags: string[]): Promise<string[]> {
    const tagList = await Tag.find({
      title: {
        $in: tags,
      },
    }).lean();

    const ids = tagList.map(tag => tag._id);
    return ids;
  }

  static async list(by?: tagSearchOptions): Promise<ITag[]> {
    const options: tagSearchOptions = {};
    if (by) {
      if (by.id)  options.id = by.id;
      if (by.title)  options.title = by.title;
    }

    const tags = await Tag.find(options).lean();
    return tags;
  }
}

export default TagService;
