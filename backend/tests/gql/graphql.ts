/* eslint-disable */
import type { GlobalId } from '../../src/globalId.ts';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: GlobalId; output: GlobalId; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date; output: Date; }
  File: { input: any; output: any; }
  NonNegativeInt: { input: number; output: number; }
};

export type CompleteRoutineSlotPayload = {
  __typename?: 'CompleteRoutineSlotPayload';
  taskCompletionEdge: TaskCompletionEdge;
};

export type CreateRoutineSlotInput = {
  dayOfWeek: DayOfWeek;
  section: DaySection;
  taskId: Scalars['ID']['input'];
};

export type CreateRoutineSlotPayload = {
  __typename?: 'CreateRoutineSlotPayload';
  routineSlotEdge: RoutineSlotEdge;
};

export type CreateTaskPayload = {
  __typename?: 'CreateTaskPayload';
  taskEdge: TaskEdge;
};

export type DailyRoutinePayload = {
  __typename?: 'DailyRoutinePayload';
  date: Scalars['DateTime']['output'];
  dayOfWeek: DayOfWeek;
  evening: DailyTaskInstanceConnection;
  midday: DailyTaskInstanceConnection;
  morning: DailyTaskInstanceConnection;
};


export type DailyRoutinePayloadEveningArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['NonNegativeInt']['input']>;
};


export type DailyRoutinePayloadMiddayArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['NonNegativeInt']['input']>;
};


export type DailyRoutinePayloadMorningArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['NonNegativeInt']['input']>;
};

export type DailyTaskInstance = {
  __typename?: 'DailyTaskInstance';
  completion?: Maybe<TaskCompletion>;
  routineSlot: RoutineSlot;
};

export type DailyTaskInstanceConnection = {
  __typename?: 'DailyTaskInstanceConnection';
  edges: Array<DailyTaskInstanceEdge>;
  pageInfo: PageInfo;
};

export type DailyTaskInstanceEdge = {
  __typename?: 'DailyTaskInstanceEdge';
  cursor: Scalars['String']['output'];
  node: DailyTaskInstance;
};

export type DayOfWeek =
  | 'FRIDAY'
  | 'MONDAY'
  | 'SATURDAY'
  | 'SUNDAY'
  | 'THURSDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | '%future added value';

export type DaySchedule = {
  __typename?: 'DaySchedule';
  dayOfWeek: DayOfWeek;
  evening: RoutineSlotConnection;
  midday: RoutineSlotConnection;
  morning: RoutineSlotConnection;
};


export type DayScheduleEveningArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['NonNegativeInt']['input']>;
};


export type DayScheduleMiddayArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['NonNegativeInt']['input']>;
};


export type DayScheduleMorningArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['NonNegativeInt']['input']>;
};

export type DaySection =
  | 'EVENING'
  | 'MIDDAY'
  | 'MORNING'
  | '%future added value';

export type DeleteRoutineSlotPayload = {
  __typename?: 'DeleteRoutineSlotPayload';
  deletedId: Scalars['ID']['output'];
};

export type DeleteTaskPayload = {
  __typename?: 'DeleteTaskPayload';
  deletedId: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  completeRoutineSlot: CompleteRoutineSlotPayload;
  createRoutineSlot: CreateRoutineSlotPayload;
  createTask: CreateTaskPayload;
  deleteRoutineSlot: DeleteRoutineSlotPayload;
  deleteTask: DeleteTaskPayload;
  uncompleteRoutineSlot: UncompleteRoutineSlotPayload;
  updateTask: UpdateTaskPayload;
};


export type MutationCompleteRoutineSlotArgs = {
  routineSlotId: Scalars['ID']['input'];
};


export type MutationCreateRoutineSlotArgs = {
  input: CreateRoutineSlotInput;
};


export type MutationCreateTaskArgs = {
  title: Scalars['String']['input'];
};


export type MutationDeleteRoutineSlotArgs = {
  routineSlotId: Scalars['ID']['input'];
};


export type MutationDeleteTaskArgs = {
  taskId: Scalars['ID']['input'];
};


export type MutationUncompleteRoutineSlotArgs = {
  taskCompletionId: Scalars['ID']['input'];
};


export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  dailyRoutine: DailyRoutinePayload;
  hello: Scalars['String']['output'];
  me: User;
  node?: Maybe<Node>;
  taskCompletions: TaskCompletionConnection;
  tasks: TaskConnection;
  weeklySchedule: WeeklySchedulePayload;
};


export type QueryDailyRoutineArgs = {
  date?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTaskCompletionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['NonNegativeInt']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryTasksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['NonNegativeInt']['input']>;
};

export type RoutineSlot = Node & {
  __typename?: 'RoutineSlot';
  createdAt: Scalars['DateTime']['output'];
  dayOfWeek: DayOfWeek;
  id: Scalars['ID']['output'];
  section: DaySection;
  task: Task;
};

export type RoutineSlotConnection = {
  __typename?: 'RoutineSlotConnection';
  edges: Array<RoutineSlotEdge>;
  pageInfo: PageInfo;
};

export type RoutineSlotEdge = {
  __typename?: 'RoutineSlotEdge';
  cursor: Scalars['String']['output'];
  node: RoutineSlot;
};

export type Task = Node & {
  __typename?: 'Task';
  completions: TaskCompletionConnection;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  slots: RoutineSlotConnection;
  title: Scalars['String']['output'];
};


export type TaskCompletionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['NonNegativeInt']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type TaskSlotsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['NonNegativeInt']['input']>;
};

export type TaskCompletion = Node & {
  __typename?: 'TaskCompletion';
  completedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  routineSlot: RoutineSlot;
};

export type TaskCompletionConnection = {
  __typename?: 'TaskCompletionConnection';
  edges: Array<TaskCompletionEdge>;
  pageInfo: PageInfo;
};

export type TaskCompletionEdge = {
  __typename?: 'TaskCompletionEdge';
  cursor: Scalars['String']['output'];
  node: TaskCompletion;
};

export type TaskConnection = {
  __typename?: 'TaskConnection';
  edges: Array<TaskEdge>;
  pageInfo: PageInfo;
};

export type TaskEdge = {
  __typename?: 'TaskEdge';
  cursor: Scalars['String']['output'];
  node: Task;
};

export type UncompleteRoutineSlotPayload = {
  __typename?: 'UncompleteRoutineSlotPayload';
  deletedId: Scalars['ID']['output'];
};

export type UpdateTaskInput = {
  taskId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type UpdateTaskPayload = {
  __typename?: 'UpdateTaskPayload';
  task: Task;
};

export type User = Node & {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type WeeklySchedulePayload = {
  __typename?: 'WeeklySchedulePayload';
  friday: DaySchedule;
  monday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
  thursday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
};

export type CreateTaskMutationMutationVariables = Exact<{
  title: Scalars['String']['input'];
}>;


export type CreateTaskMutationMutation = { __typename?: 'Mutation', createTask: { __typename?: 'CreateTaskPayload', taskEdge: { __typename?: 'TaskEdge', node: { __typename?: 'Task', id: GlobalId, title: string } } } };

export type CreateRoutineSlotMutationVariables = Exact<{
  input: CreateRoutineSlotInput;
}>;


export type CreateRoutineSlotMutation = { __typename?: 'Mutation', createRoutineSlot: { __typename?: 'CreateRoutineSlotPayload', routineSlotEdge: { __typename?: 'RoutineSlotEdge', cursor: string, node: { __typename?: 'RoutineSlot', id: GlobalId, dayOfWeek: DayOfWeek, section: DaySection, createdAt: Date, task: { __typename?: 'Task', id: GlobalId, title: string } } } } };

export type UpdateTaskMutationVariables = Exact<{
  input: UpdateTaskInput;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', updateTask: { __typename?: 'UpdateTaskPayload', task: { __typename?: 'Task', id: GlobalId, title: string } } };

export type DeleteTaskMutationVariables = Exact<{
  taskId: Scalars['ID']['input'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask: { __typename?: 'DeleteTaskPayload', deletedId: GlobalId } };

export type TasksTestOneQueryVariables = Exact<{ [key: string]: never; }>;


export type TasksTestOneQuery = { __typename?: 'Query', tasks: { __typename?: 'TaskConnection', edges: Array<{ __typename?: 'TaskEdge', node: { __typename?: 'Task', title: string } }> } };

export type PaginatedTasksQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type PaginatedTasksQuery = { __typename?: 'Query', tasks: { __typename?: 'TaskConnection', edges: Array<{ __typename?: 'TaskEdge', node: { __typename?: 'Task', id: GlobalId, title: string } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, startCursor?: string | null } } };


export const CreateTaskMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTaskMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskEdge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateTaskMutationMutation, CreateTaskMutationMutationVariables>;
export const CreateRoutineSlotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRoutineSlot"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRoutineSlotInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRoutineSlot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"routineSlotEdge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cursor"}}]}}]}}]}}]} as unknown as DocumentNode<CreateRoutineSlotMutation, CreateRoutineSlotMutationVariables>;
export const UpdateTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTaskInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const DeleteTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletedId"}}]}}]}}]} as unknown as DocumentNode<DeleteTaskMutation, DeleteTaskMutationVariables>;
export const TasksTestOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TasksTestOne"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tasks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TasksTestOneQuery, TasksTestOneQueryVariables>;
export const PaginatedTasksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PaginatedTasks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tasks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<PaginatedTasksQuery, PaginatedTasksQueryVariables>;