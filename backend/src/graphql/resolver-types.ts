import type { GlobalId } from '../globalId.ts';
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { UserNode } from '../user/user-domain.ts';
import type { TaskNode } from '../task/task-domain.ts';
import type { RoutineSlotNode } from '../routine-slot/routine-slot-domain.ts';
import type { TaskCompletionNode } from '../task-completion/task-completion-domain.ts';
import type { DailyRoutineData, WeeklyScheduleData, DayScheduleData } from '../schedule/schedule-domain.ts';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  icon?: InputMaybe<Scalars['String']['input']>;
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
  titleSearch?: InputMaybe<Scalars['String']['input']>;
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
  icon?: Maybe<Scalars['String']['output']>;
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
  icon?: InputMaybe<Scalars['String']['input']>;
  taskId: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;




/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  Node:
    | ( RoutineSlotNode )
    | ( TaskNode )
    | ( TaskCompletionNode )
    | ( UserNode )
  ;
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CompleteRoutineSlotPayload: ResolverTypeWrapper<Omit<CompleteRoutineSlotPayload, 'taskCompletionEdge'> & { taskCompletionEdge: ResolversTypes['TaskCompletionEdge'] }>;
  CreateRoutineSlotInput: CreateRoutineSlotInput;
  CreateRoutineSlotPayload: ResolverTypeWrapper<Omit<CreateRoutineSlotPayload, 'routineSlotEdge'> & { routineSlotEdge: ResolversTypes['RoutineSlotEdge'] }>;
  CreateTaskPayload: ResolverTypeWrapper<Omit<CreateTaskPayload, 'taskEdge'> & { taskEdge: ResolversTypes['TaskEdge'] }>;
  DailyRoutinePayload: ResolverTypeWrapper<DailyRoutineData>;
  DailyTaskInstance: ResolverTypeWrapper<Omit<DailyTaskInstance, 'completion' | 'routineSlot'> & { completion?: Maybe<ResolversTypes['TaskCompletion']>, routineSlot: ResolversTypes['RoutineSlot'] }>;
  DailyTaskInstanceConnection: ResolverTypeWrapper<Omit<DailyTaskInstanceConnection, 'edges'> & { edges: Array<ResolversTypes['DailyTaskInstanceEdge']> }>;
  DailyTaskInstanceEdge: ResolverTypeWrapper<Omit<DailyTaskInstanceEdge, 'node'> & { node: ResolversTypes['DailyTaskInstance'] }>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DayOfWeek: DayOfWeek;
  DaySchedule: ResolverTypeWrapper<DayScheduleData>;
  DaySection: DaySection;
  DeleteRoutineSlotPayload: ResolverTypeWrapper<DeleteRoutineSlotPayload>;
  DeleteTaskPayload: ResolverTypeWrapper<DeleteTaskPayload>;
  File: ResolverTypeWrapper<Scalars['File']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  NonNegativeInt: ResolverTypeWrapper<Scalars['NonNegativeInt']['output']>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RoutineSlot: ResolverTypeWrapper<RoutineSlotNode>;
  RoutineSlotConnection: ResolverTypeWrapper<Omit<RoutineSlotConnection, 'edges'> & { edges: Array<ResolversTypes['RoutineSlotEdge']> }>;
  RoutineSlotEdge: ResolverTypeWrapper<Omit<RoutineSlotEdge, 'node'> & { node: ResolversTypes['RoutineSlot'] }>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Task: ResolverTypeWrapper<TaskNode>;
  TaskCompletion: ResolverTypeWrapper<TaskCompletionNode>;
  TaskCompletionConnection: ResolverTypeWrapper<Omit<TaskCompletionConnection, 'edges'> & { edges: Array<ResolversTypes['TaskCompletionEdge']> }>;
  TaskCompletionEdge: ResolverTypeWrapper<Omit<TaskCompletionEdge, 'node'> & { node: ResolversTypes['TaskCompletion'] }>;
  TaskConnection: ResolverTypeWrapper<Omit<TaskConnection, 'edges'> & { edges: Array<ResolversTypes['TaskEdge']> }>;
  TaskEdge: ResolverTypeWrapper<Omit<TaskEdge, 'node'> & { node: ResolversTypes['Task'] }>;
  UncompleteRoutineSlotPayload: ResolverTypeWrapper<UncompleteRoutineSlotPayload>;
  UpdateTaskInput: UpdateTaskInput;
  UpdateTaskPayload: ResolverTypeWrapper<Omit<UpdateTaskPayload, 'task'> & { task: ResolversTypes['Task'] }>;
  User: ResolverTypeWrapper<UserNode>;
  WeeklySchedulePayload: ResolverTypeWrapper<WeeklyScheduleData>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CompleteRoutineSlotPayload: Omit<CompleteRoutineSlotPayload, 'taskCompletionEdge'> & { taskCompletionEdge: ResolversParentTypes['TaskCompletionEdge'] };
  CreateRoutineSlotInput: CreateRoutineSlotInput;
  CreateRoutineSlotPayload: Omit<CreateRoutineSlotPayload, 'routineSlotEdge'> & { routineSlotEdge: ResolversParentTypes['RoutineSlotEdge'] };
  CreateTaskPayload: Omit<CreateTaskPayload, 'taskEdge'> & { taskEdge: ResolversParentTypes['TaskEdge'] };
  DailyRoutinePayload: DailyRoutineData;
  DailyTaskInstance: Omit<DailyTaskInstance, 'completion' | 'routineSlot'> & { completion?: Maybe<ResolversParentTypes['TaskCompletion']>, routineSlot: ResolversParentTypes['RoutineSlot'] };
  DailyTaskInstanceConnection: Omit<DailyTaskInstanceConnection, 'edges'> & { edges: Array<ResolversParentTypes['DailyTaskInstanceEdge']> };
  DailyTaskInstanceEdge: Omit<DailyTaskInstanceEdge, 'node'> & { node: ResolversParentTypes['DailyTaskInstance'] };
  DateTime: Scalars['DateTime']['output'];
  DaySchedule: DayScheduleData;
  DeleteRoutineSlotPayload: DeleteRoutineSlotPayload;
  DeleteTaskPayload: DeleteTaskPayload;
  File: Scalars['File']['output'];
  ID: Scalars['ID']['output'];
  Mutation: Record<PropertyKey, never>;
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  NonNegativeInt: Scalars['NonNegativeInt']['output'];
  PageInfo: PageInfo;
  Query: Record<PropertyKey, never>;
  RoutineSlot: RoutineSlotNode;
  RoutineSlotConnection: Omit<RoutineSlotConnection, 'edges'> & { edges: Array<ResolversParentTypes['RoutineSlotEdge']> };
  RoutineSlotEdge: Omit<RoutineSlotEdge, 'node'> & { node: ResolversParentTypes['RoutineSlot'] };
  String: Scalars['String']['output'];
  Task: TaskNode;
  TaskCompletion: TaskCompletionNode;
  TaskCompletionConnection: Omit<TaskCompletionConnection, 'edges'> & { edges: Array<ResolversParentTypes['TaskCompletionEdge']> };
  TaskCompletionEdge: Omit<TaskCompletionEdge, 'node'> & { node: ResolversParentTypes['TaskCompletion'] };
  TaskConnection: Omit<TaskConnection, 'edges'> & { edges: Array<ResolversParentTypes['TaskEdge']> };
  TaskEdge: Omit<TaskEdge, 'node'> & { node: ResolversParentTypes['Task'] };
  UncompleteRoutineSlotPayload: UncompleteRoutineSlotPayload;
  UpdateTaskInput: UpdateTaskInput;
  UpdateTaskPayload: Omit<UpdateTaskPayload, 'task'> & { task: ResolversParentTypes['Task'] };
  User: UserNode;
  WeeklySchedulePayload: WeeklyScheduleData;
}>;

export type AuthenticatedDirectiveArgs = { };

export type AuthenticatedDirectiveResolver<Result, Parent, ContextType = any, Args = AuthenticatedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type SkipAuthDirectiveArgs = { };

export type SkipAuthDirectiveResolver<Result, Parent, ContextType = any, Args = SkipAuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CompleteRoutineSlotPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CompleteRoutineSlotPayload'] = ResolversParentTypes['CompleteRoutineSlotPayload']> = ResolversObject<{
  taskCompletionEdge?: Resolver<ResolversTypes['TaskCompletionEdge'], ParentType, ContextType>;
}>;

export type CreateRoutineSlotPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateRoutineSlotPayload'] = ResolversParentTypes['CreateRoutineSlotPayload']> = ResolversObject<{
  routineSlotEdge?: Resolver<ResolversTypes['RoutineSlotEdge'], ParentType, ContextType>;
}>;

export type CreateTaskPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTaskPayload'] = ResolversParentTypes['CreateTaskPayload']> = ResolversObject<{
  taskEdge?: Resolver<ResolversTypes['TaskEdge'], ParentType, ContextType>;
}>;

export type DailyRoutinePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DailyRoutinePayload'] = ResolversParentTypes['DailyRoutinePayload']> = ResolversObject<{
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  dayOfWeek?: Resolver<ResolversTypes['DayOfWeek'], ParentType, ContextType>;
  evening?: Resolver<ResolversTypes['DailyTaskInstanceConnection'], ParentType, ContextType, Partial<DailyRoutinePayloadEveningArgs>>;
  midday?: Resolver<ResolversTypes['DailyTaskInstanceConnection'], ParentType, ContextType, Partial<DailyRoutinePayloadMiddayArgs>>;
  morning?: Resolver<ResolversTypes['DailyTaskInstanceConnection'], ParentType, ContextType, Partial<DailyRoutinePayloadMorningArgs>>;
}>;

export type DailyTaskInstanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['DailyTaskInstance'] = ResolversParentTypes['DailyTaskInstance']> = ResolversObject<{
  completion?: Resolver<Maybe<ResolversTypes['TaskCompletion']>, ParentType, ContextType>;
  routineSlot?: Resolver<ResolversTypes['RoutineSlot'], ParentType, ContextType>;
}>;

export type DailyTaskInstanceConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['DailyTaskInstanceConnection'] = ResolversParentTypes['DailyTaskInstanceConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['DailyTaskInstanceEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type DailyTaskInstanceEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DailyTaskInstanceEdge'] = ResolversParentTypes['DailyTaskInstanceEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['DailyTaskInstance'], ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DayScheduleResolvers<ContextType = any, ParentType extends ResolversParentTypes['DaySchedule'] = ResolversParentTypes['DaySchedule']> = ResolversObject<{
  dayOfWeek?: Resolver<ResolversTypes['DayOfWeek'], ParentType, ContextType>;
  evening?: Resolver<ResolversTypes['RoutineSlotConnection'], ParentType, ContextType, Partial<DayScheduleEveningArgs>>;
  midday?: Resolver<ResolversTypes['RoutineSlotConnection'], ParentType, ContextType, Partial<DayScheduleMiddayArgs>>;
  morning?: Resolver<ResolversTypes['RoutineSlotConnection'], ParentType, ContextType, Partial<DayScheduleMorningArgs>>;
}>;

export type DeleteRoutineSlotPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteRoutineSlotPayload'] = ResolversParentTypes['DeleteRoutineSlotPayload']> = ResolversObject<{
  deletedId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type DeleteTaskPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteTaskPayload'] = ResolversParentTypes['DeleteTaskPayload']> = ResolversObject<{
  deletedId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export interface FileScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['File'], any> {
  name: 'File';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  completeRoutineSlot?: Resolver<ResolversTypes['CompleteRoutineSlotPayload'], ParentType, ContextType, RequireFields<MutationCompleteRoutineSlotArgs, 'routineSlotId'>>;
  createRoutineSlot?: Resolver<ResolversTypes['CreateRoutineSlotPayload'], ParentType, ContextType, RequireFields<MutationCreateRoutineSlotArgs, 'input'>>;
  createTask?: Resolver<ResolversTypes['CreateTaskPayload'], ParentType, ContextType, RequireFields<MutationCreateTaskArgs, 'title'>>;
  deleteRoutineSlot?: Resolver<ResolversTypes['DeleteRoutineSlotPayload'], ParentType, ContextType, RequireFields<MutationDeleteRoutineSlotArgs, 'routineSlotId'>>;
  deleteTask?: Resolver<ResolversTypes['DeleteTaskPayload'], ParentType, ContextType, RequireFields<MutationDeleteTaskArgs, 'taskId'>>;
  uncompleteRoutineSlot?: Resolver<ResolversTypes['UncompleteRoutineSlotPayload'], ParentType, ContextType, RequireFields<MutationUncompleteRoutineSlotArgs, 'taskCompletionId'>>;
  updateTask?: Resolver<ResolversTypes['UpdateTaskPayload'], ParentType, ContextType, RequireFields<MutationUpdateTaskArgs, 'input'>>;
}>;

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<'RoutineSlot' | 'Task' | 'TaskCompletion' | 'User', ParentType, ContextType>;
}>;

export interface NonNegativeIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['NonNegativeInt'], any> {
  name: 'NonNegativeInt';
}

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  dailyRoutine?: Resolver<ResolversTypes['DailyRoutinePayload'], ParentType, ContextType, Partial<QueryDailyRoutineArgs>>;
  hello?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>;
  taskCompletions?: Resolver<ResolversTypes['TaskCompletionConnection'], ParentType, ContextType, Partial<QueryTaskCompletionsArgs>>;
  tasks?: Resolver<ResolversTypes['TaskConnection'], ParentType, ContextType, Partial<QueryTasksArgs>>;
  weeklySchedule?: Resolver<ResolversTypes['WeeklySchedulePayload'], ParentType, ContextType>;
}>;

export type RoutineSlotResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoutineSlot'] = ResolversParentTypes['RoutineSlot']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  dayOfWeek?: Resolver<ResolversTypes['DayOfWeek'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  section?: Resolver<ResolversTypes['DaySection'], ParentType, ContextType>;
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RoutineSlotConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoutineSlotConnection'] = ResolversParentTypes['RoutineSlotConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['RoutineSlotEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type RoutineSlotEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoutineSlotEdge'] = ResolversParentTypes['RoutineSlotEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['RoutineSlot'], ParentType, ContextType>;
}>;

export type TaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = ResolversObject<{
  completions?: Resolver<ResolversTypes['TaskCompletionConnection'], ParentType, ContextType, Partial<TaskCompletionsArgs>>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  slots?: Resolver<ResolversTypes['RoutineSlotConnection'], ParentType, ContextType, Partial<TaskSlotsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaskCompletionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskCompletion'] = ResolversParentTypes['TaskCompletion']> = ResolversObject<{
  completedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  routineSlot?: Resolver<ResolversTypes['RoutineSlot'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaskCompletionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskCompletionConnection'] = ResolversParentTypes['TaskCompletionConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['TaskCompletionEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type TaskCompletionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskCompletionEdge'] = ResolversParentTypes['TaskCompletionEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['TaskCompletion'], ParentType, ContextType>;
}>;

export type TaskConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskConnection'] = ResolversParentTypes['TaskConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['TaskEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
}>;

export type TaskEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskEdge'] = ResolversParentTypes['TaskEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Task'], ParentType, ContextType>;
}>;

export type UncompleteRoutineSlotPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UncompleteRoutineSlotPayload'] = ResolversParentTypes['UncompleteRoutineSlotPayload']> = ResolversObject<{
  deletedId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type UpdateTaskPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateTaskPayload'] = ResolversParentTypes['UpdateTaskPayload']> = ResolversObject<{
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WeeklySchedulePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['WeeklySchedulePayload'] = ResolversParentTypes['WeeklySchedulePayload']> = ResolversObject<{
  friday?: Resolver<ResolversTypes['DaySchedule'], ParentType, ContextType>;
  monday?: Resolver<ResolversTypes['DaySchedule'], ParentType, ContextType>;
  saturday?: Resolver<ResolversTypes['DaySchedule'], ParentType, ContextType>;
  sunday?: Resolver<ResolversTypes['DaySchedule'], ParentType, ContextType>;
  thursday?: Resolver<ResolversTypes['DaySchedule'], ParentType, ContextType>;
  tuesday?: Resolver<ResolversTypes['DaySchedule'], ParentType, ContextType>;
  wednesday?: Resolver<ResolversTypes['DaySchedule'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  CompleteRoutineSlotPayload?: CompleteRoutineSlotPayloadResolvers<ContextType>;
  CreateRoutineSlotPayload?: CreateRoutineSlotPayloadResolvers<ContextType>;
  CreateTaskPayload?: CreateTaskPayloadResolvers<ContextType>;
  DailyRoutinePayload?: DailyRoutinePayloadResolvers<ContextType>;
  DailyTaskInstance?: DailyTaskInstanceResolvers<ContextType>;
  DailyTaskInstanceConnection?: DailyTaskInstanceConnectionResolvers<ContextType>;
  DailyTaskInstanceEdge?: DailyTaskInstanceEdgeResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DaySchedule?: DayScheduleResolvers<ContextType>;
  DeleteRoutineSlotPayload?: DeleteRoutineSlotPayloadResolvers<ContextType>;
  DeleteTaskPayload?: DeleteTaskPayloadResolvers<ContextType>;
  File?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  NonNegativeInt?: GraphQLScalarType;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RoutineSlot?: RoutineSlotResolvers<ContextType>;
  RoutineSlotConnection?: RoutineSlotConnectionResolvers<ContextType>;
  RoutineSlotEdge?: RoutineSlotEdgeResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  TaskCompletion?: TaskCompletionResolvers<ContextType>;
  TaskCompletionConnection?: TaskCompletionConnectionResolvers<ContextType>;
  TaskCompletionEdge?: TaskCompletionEdgeResolvers<ContextType>;
  TaskConnection?: TaskConnectionResolvers<ContextType>;
  TaskEdge?: TaskEdgeResolvers<ContextType>;
  UncompleteRoutineSlotPayload?: UncompleteRoutineSlotPayloadResolvers<ContextType>;
  UpdateTaskPayload?: UpdateTaskPayloadResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  WeeklySchedulePayload?: WeeklySchedulePayloadResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  authenticated?: AuthenticatedDirectiveResolver<any, any, ContextType>;
  skipAuth?: SkipAuthDirectiveResolver<any, any, ContextType>;
}>;
