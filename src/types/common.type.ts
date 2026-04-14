export type Node<T> = {
  node: T;
};

export type Nodes<T> = {
  nodes: T;
};

export type PageInfo = {
  startCursor?: string;
  endCursor?: string;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
};

export type QueryResult<TKey extends string, TData = unknown> = {
  [key in TKey]: TData;
};

type QueryNodesKeys = 'posts' | 'post';

export type QueryNodesResult<TKey extends QueryNodesKeys, TData extends {} = {}> = {
  [key in TKey]: Nodes<TData>;
};

export type QueryNodesAndPageInfoResult<TKey extends QueryNodesKeys, TData extends {} = {}> = {
  [key in TKey]: {
    nodes: TData[];
    pageInfo: PageInfo;
  };
};
