export type UserType = "STUDENT" | "INSTITUTE";

export type UserDetails = {
  userId: string;
  type: UserType;
  name: string;
};

export type Passage = {
  passageId: string;
  passageText: string;
  passageTitle?: string;
};
