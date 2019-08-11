export type Id = string;

export function* createIdGenerator(prefix: string): Iterator<Id> {
  let id = -1;

  while (true) {
    id = id + 1;
    yield `${prefix}${id}`;
  }
}
