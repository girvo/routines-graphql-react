// GENERATED FILE
// DO NOT EDIT
import type { GlobalId } from '../globalId.ts'
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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
};

export type CompleteTaskInput = {
  completionDate?: InputMaybe<Scalars['DateTime']['input']>;
  taskId: Scalars['ID']['input'];
};

export type CompleteTaskPayload = {
  __typename?: 'CompleteTaskPayload';
  taskCompletion: TaskCompletion;
};

export type CreateRoutineSlotInput = {
  dayOfWeek: DayOfWeek;
  section: DaySection;
  taskId: Scalars['ID']['input'];
};

export type CreateRoutineSlotPayload = {
  __typename?: 'CreateRoutineSlotPayload';
  routineSlot: RoutineSlot;
};

export type CreateTaskPayload = {
  __typename?: 'CreateTaskPayload';
  task: Task;
};

export type DailyRoutinePayload = {
  __typename?: 'DailyRoutinePayload';
  date: Scalars['DateTime']['output'];
  dayOfWeek: DayOfWeek;
  evening: Array<DailyTaskInstance>;
  midday: Array<DailyTaskInstance>;
  morning: Array<DailyTaskInstance>;
};

export type DailyTaskInstance = {
  __typename?: 'DailyTaskInstance';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  isCompleted: Scalars['Boolean']['output'];
  section: DaySection;
  task: Task;
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
  evening: Array<RoutineSlot>;
  midday: Array<RoutineSlot>;
  morning: Array<RoutineSlot>;
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
  completeTask: CompleteTaskPayload;
  createRoutineSlot: CreateRoutineSlotPayload;
  createTask: CreateTaskPayload;
  deleteRoutineSlot: DeleteRoutineSlotPayload;
  deleteTask: DeleteTaskPayload;
  uncompleteTask: UncompleteTaskPayload;
  updateTask: UpdateTaskPayload;
};


export type MutationCompleteTaskArgs = {
  input: CompleteTaskInput;
};


export type MutationCreateRoutineSlotArgs = {
  input: CreateRoutineSlotInput;
};


export type MutationCreateTaskArgs = {
  title: Scalars['String']['input'];
};


export type MutationDeleteRoutineSlotArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUncompleteTaskArgs = {
  input: UncompleteTaskInput;
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
  first?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryTasksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
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
  first?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type TaskSlotsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type TaskCompletion = Node & {
  __typename?: 'TaskCompletion';
  completedAt: Scalars['DateTime']['output'];
  completionDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  task: Task;
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

export type UncompleteTaskInput = {
  completionDate: Scalars['DateTime']['input'];
  taskId: Scalars['ID']['input'];
};

export type UncompleteTaskPayload = {
  __typename?: 'UncompleteTaskPayload';
  deletedId: Scalars['ID']['output'];
};

export type UpdateTaskInput = {
  id: Scalars['ID']['input'];
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
    | ( RoutineSlot )
    | ( Task )
    | ( TaskCompletion )
    | ( User )
  ;
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CompleteTaskInput: CompleteTaskInput;
  CompleteTaskPayload: ResolverTypeWrapper<CompleteTaskPayload>;
  CreateRoutineSlotInput: CreateRoutineSlotInput;
  CreateRoutineSlotPayload: ResolverTypeWrapper<CreateRoutineSlotPayload>;
  CreateTaskPayload: ResolverTypeWrapper<CreateTaskPayload>;
  DailyRoutinePayload: ResolverTypeWrapper<DailyRoutinePayload>;
  DailyTaskInstance: ResolverTypeWrapper<DailyTaskInstance>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DayOfWeek: DayOfWeek;
  DaySchedule: ResolverTypeWrapper<DaySchedule>;
  DaySection: DaySection;
  DeleteRoutineSlotPayload: ResolverTypeWrapper<DeleteRoutineSlotPayload>;
  DeleteTaskPayload: ResolverTypeWrapper<DeleteTaskPayload>;
  File: ResolverTypeWrapper<Scalars['File']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RoutineSlot: ResolverTypeWrapper<RoutineSlot>;
  RoutineSlotConnection: ResolverTypeWrapper<RoutineSlotConnection>;
  RoutineSlotEdge: ResolverTypeWrapper<RoutineSlotEdge>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Task: ResolverTypeWrapper<Task>;
  TaskCompletion: ResolverTypeWrapper<TaskCompletion>;
  TaskCompletionConnection: ResolverTypeWrapper<TaskCompletionConnection>;
  TaskCompletionEdge: ResolverTypeWrapper<TaskCompletionEdge>;
  TaskConnection: ResolverTypeWrapper<TaskConnection>;
  TaskEdge: ResolverTypeWrapper<TaskEdge>;
  UncompleteTaskInput: UncompleteTaskInput;
  UncompleteTaskPayload: ResolverTypeWrapper<UncompleteTaskPayload>;
  UpdateTaskInput: UpdateTaskInput;
  UpdateTaskPayload: ResolverTypeWrapper<UpdateTaskPayload>;
  User: ResolverTypeWrapper<User>;
  WeeklySchedulePayload: ResolverTypeWrapper<WeeklySchedulePayload>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CompleteTaskInput: CompleteTaskInput;
  CompleteTaskPayload: CompleteTaskPayload;
  CreateRoutineSlotInput: CreateRoutineSlotInput;
  CreateRoutineSlotPayload: CreateRoutineSlotPayload;
  CreateTaskPayload: CreateTaskPayload;
  DailyRoutinePayload: DailyRoutinePayload;
  DailyTaskInstance: DailyTaskInstance;
  DateTime: Scalars['DateTime']['output'];
  DaySchedule: DaySchedule;
  DeleteRoutineSlotPayload: DeleteRoutineSlotPayload;
  DeleteTaskPayload: DeleteTaskPayload;
  File: Scalars['File']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  PageInfo: PageInfo;
  Query: Record<PropertyKey, never>;
  RoutineSlot: RoutineSlot;
  RoutineSlotConnection: RoutineSlotConnection;
  RoutineSlotEdge: RoutineSlotEdge;
  String: Scalars['String']['output'];
  Task: Task;
  TaskCompletion: TaskCompletion;
  TaskCompletionConnection: TaskCompletionConnection;
  TaskCompletionEdge: TaskCompletionEdge;
  TaskConnection: TaskConnection;
  TaskEdge: TaskEdge;
  UncompleteTaskInput: UncompleteTaskInput;
  UncompleteTaskPayload: UncompleteTaskPayload;
  UpdateTaskInput: UpdateTaskInput;
  UpdateTaskPayload: UpdateTaskPayload;
  User: User;
  WeeklySchedulePayload: WeeklySchedulePayload;
}>;

export type AuthenticatedDirectiveArgs = { };

export type AuthenticatedDirectiveResolver<Result, Parent, ContextType = any, Args = AuthenticatedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type SkipAuthDirectiveArgs = { };

export type SkipAuthDirectiveResolver<Result, Parent, ContextType = any, Args = SkipAuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CompleteTaskPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CompleteTaskPayload'] = ResolversParentTypes['CompleteTaskPayload']> = ResolversObject<{
  taskCompletion?: Resolver<ResolversTypes['TaskCompletion'], ParentType, ContextType>;
}>;

export type CreateRoutineSlotPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateRoutineSlotPayload'] = ResolversParentTypes['CreateRoutineSlotPayload']> = ResolversObject<{
  routineSlot?: Resolver<ResolversTypes['RoutineSlot'], ParentType, ContextType>;
}>;

export type CreateTaskPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateTaskPayload'] = ResolversParentTypes['CreateTaskPayload']> = ResolversObject<{
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType>;
}>;

export type DailyRoutinePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DailyRoutinePayload'] = ResolversParentTypes['DailyRoutinePayload']> = ResolversObject<{
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  dayOfWeek?: Resolver<ResolversTypes['DayOfWeek'], ParentType, ContextType>;
  evening?: Resolver<Array<ResolversTypes['DailyTaskInstance']>, ParentType, ContextType>;
  midday?: Resolver<Array<ResolversTypes['DailyTaskInstance']>, ParentType, ContextType>;
  morning?: Resolver<Array<ResolversTypes['DailyTaskInstance']>, ParentType, ContextType>;
}>;

export type DailyTaskInstanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['DailyTaskInstance'] = ResolversParentTypes['DailyTaskInstance']> = ResolversObject<{
  completedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  isCompleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  section?: Resolver<ResolversTypes['DaySection'], ParentType, ContextType>;
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DayScheduleResolvers<ContextType = any, ParentType extends ResolversParentTypes['DaySchedule'] = ResolversParentTypes['DaySchedule']> = ResolversObject<{
  dayOfWeek?: Resolver<ResolversTypes['DayOfWeek'], ParentType, ContextType>;
  evening?: Resolver<Array<ResolversTypes['RoutineSlot']>, ParentType, ContextType>;
  midday?: Resolver<Array<ResolversTypes['RoutineSlot']>, ParentType, ContextType>;
  morning?: Resolver<Array<ResolversTypes['RoutineSlot']>, ParentType, ContextType>;
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
  completeTask?: Resolver<ResolversTypes['CompleteTaskPayload'], ParentType, ContextType, RequireFields<MutationCompleteTaskArgs, 'input'>>;
  createRoutineSlot?: Resolver<ResolversTypes['CreateRoutineSlotPayload'], ParentType, ContextType, RequireFields<MutationCreateRoutineSlotArgs, 'input'>>;
  createTask?: Resolver<ResolversTypes['CreateTaskPayload'], ParentType, ContextType, RequireFields<MutationCreateTaskArgs, 'title'>>;
  deleteRoutineSlot?: Resolver<ResolversTypes['DeleteRoutineSlotPayload'], ParentType, ContextType, RequireFields<MutationDeleteRoutineSlotArgs, 'id'>>;
  deleteTask?: Resolver<ResolversTypes['DeleteTaskPayload'], ParentType, ContextType, RequireFields<MutationDeleteTaskArgs, 'id'>>;
  uncompleteTask?: Resolver<ResolversTypes['UncompleteTaskPayload'], ParentType, ContextType, RequireFields<MutationUncompleteTaskArgs, 'input'>>;
  updateTask?: Resolver<ResolversTypes['UpdateTaskPayload'], ParentType, ContextType, RequireFields<MutationUpdateTaskArgs, 'input'>>;
}>;

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<'RoutineSlot' | 'Task' | 'TaskCompletion' | 'User', ParentType, ContextType>;
}>;

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
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  slots?: Resolver<ResolversTypes['RoutineSlotConnection'], ParentType, ContextType, Partial<TaskSlotsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TaskCompletionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaskCompletion'] = ResolversParentTypes['TaskCompletion']> = ResolversObject<{
  completedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  completionDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  task?: Resolver<ResolversTypes['Task'], ParentType, ContextType>;
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

export type UncompleteTaskPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UncompleteTaskPayload'] = ResolversParentTypes['UncompleteTaskPayload']> = ResolversObject<{
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
  CompleteTaskPayload?: CompleteTaskPayloadResolvers<ContextType>;
  CreateRoutineSlotPayload?: CreateRoutineSlotPayloadResolvers<ContextType>;
  CreateTaskPayload?: CreateTaskPayloadResolvers<ContextType>;
  DailyRoutinePayload?: DailyRoutinePayloadResolvers<ContextType>;
  DailyTaskInstance?: DailyTaskInstanceResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DaySchedule?: DayScheduleResolvers<ContextType>;
  DeleteRoutineSlotPayload?: DeleteRoutineSlotPayloadResolvers<ContextType>;
  DeleteTaskPayload?: DeleteTaskPayloadResolvers<ContextType>;
  File?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
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
  UncompleteTaskPayload?: UncompleteTaskPayloadResolvers<ContextType>;
  UpdateTaskPayload?: UpdateTaskPayloadResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  WeeklySchedulePayload?: WeeklySchedulePayloadResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  authenticated?: AuthenticatedDirectiveResolver<any, any, ContextType>;
  skipAuth?: SkipAuthDirectiveResolver<any, any, ContextType>;
}>;
