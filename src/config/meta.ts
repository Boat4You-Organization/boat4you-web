interface Meta {
  name: string;
  title: 'metadata.base.title';
  titleTemplate: 'metadata.base.titleTemplate';
  description: 'metadata.base.description';
  url: string;
}

export const meta: Meta = {
  name: 'Boat4You',
  title: 'metadata.base.title',
  titleTemplate: 'metadata.base.titleTemplate',
  description: 'metadata.base.description',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://boat4you.com',
};
