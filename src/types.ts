export type Attributes = {
  archive: boolean;
  hidden: boolean;
  readonly: boolean;
  system: boolean;
};

export type SetAttributes = Partial<Attributes>;
