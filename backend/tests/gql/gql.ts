/* eslint-disable */
import * as types from './graphql.js';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation CreateRoutineSlot($input: CreateRoutineSlotInput!) {\n    createRoutineSlot(input: $input) {\n      routineSlotEdge {\n        node {\n          id\n          task {\n            id\n            title\n          }\n          dayOfWeek\n          section\n          createdAt\n        }\n        cursor\n      }\n    }\n  }\n": typeof types.CreateRoutineSlotDocument,
    "\n  mutation CreateTaskMutation($title: String!) {\n    createTask(title: $title) {\n      taskEdge {\n        node {\n          id\n          title\n        }\n      }\n    }\n  }\n": typeof types.CreateTaskMutationDocument,
    "\n        mutation CreateRoutineSlot($input: CreateRoutineSlotInput!) {\n          createRoutineSlot(input: $input) {\n            routineSlotEdge {\n              node {\n                id\n                task {\n                  id\n                  title\n                }\n                dayOfWeek\n                section\n                createdAt\n              }\n              cursor\n            }\n          }\n        }\n      ": typeof types.CreateRoutineSlotDocument,
    "\n        mutation DeleteRoutineSlot($routineSlotId: ID!) {\n          deleteRoutineSlot(routineSlotId: $routineSlotId) {\n            deletedId\n          }\n        }\n      ": typeof types.DeleteRoutineSlotDocument,
    "\n        mutation UpdateTask($input: UpdateTaskInput!) {\n          updateTask(input: $input) {\n            task {\n              id\n              title\n            }\n          }\n        }\n      ": typeof types.UpdateTaskDocument,
    "\n        mutation DeleteTask($taskId: ID!) {\n          deleteTask(taskId: $taskId) {\n            deletedId\n          }\n        }\n      ": typeof types.DeleteTaskDocument,
    "\n        query TasksTestOne {\n          tasks(first: 1) {\n            edges {\n              node {\n                title\n              }\n            }\n          }\n        }\n      ": typeof types.TasksTestOneDocument,
    "\n      query PaginatedTasks($after: String) {\n        tasks(first: 10, after: $after) {\n          edges {\n            node {\n              id\n              title\n            }\n          }\n          pageInfo {\n            hasNextPage\n            endCursor\n            startCursor\n          }\n        }\n      }\n    ": typeof types.PaginatedTasksDocument,
};
const documents: Documents = {
    "\n  mutation CreateRoutineSlot($input: CreateRoutineSlotInput!) {\n    createRoutineSlot(input: $input) {\n      routineSlotEdge {\n        node {\n          id\n          task {\n            id\n            title\n          }\n          dayOfWeek\n          section\n          createdAt\n        }\n        cursor\n      }\n    }\n  }\n": types.CreateRoutineSlotDocument,
    "\n  mutation CreateTaskMutation($title: String!) {\n    createTask(title: $title) {\n      taskEdge {\n        node {\n          id\n          title\n        }\n      }\n    }\n  }\n": types.CreateTaskMutationDocument,
    "\n        mutation CreateRoutineSlot($input: CreateRoutineSlotInput!) {\n          createRoutineSlot(input: $input) {\n            routineSlotEdge {\n              node {\n                id\n                task {\n                  id\n                  title\n                }\n                dayOfWeek\n                section\n                createdAt\n              }\n              cursor\n            }\n          }\n        }\n      ": types.CreateRoutineSlotDocument,
    "\n        mutation DeleteRoutineSlot($routineSlotId: ID!) {\n          deleteRoutineSlot(routineSlotId: $routineSlotId) {\n            deletedId\n          }\n        }\n      ": types.DeleteRoutineSlotDocument,
    "\n        mutation UpdateTask($input: UpdateTaskInput!) {\n          updateTask(input: $input) {\n            task {\n              id\n              title\n            }\n          }\n        }\n      ": types.UpdateTaskDocument,
    "\n        mutation DeleteTask($taskId: ID!) {\n          deleteTask(taskId: $taskId) {\n            deletedId\n          }\n        }\n      ": types.DeleteTaskDocument,
    "\n        query TasksTestOne {\n          tasks(first: 1) {\n            edges {\n              node {\n                title\n              }\n            }\n          }\n        }\n      ": types.TasksTestOneDocument,
    "\n      query PaginatedTasks($after: String) {\n        tasks(first: 10, after: $after) {\n          edges {\n            node {\n              id\n              title\n            }\n          }\n          pageInfo {\n            hasNextPage\n            endCursor\n            startCursor\n          }\n        }\n      }\n    ": types.PaginatedTasksDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateRoutineSlot($input: CreateRoutineSlotInput!) {\n    createRoutineSlot(input: $input) {\n      routineSlotEdge {\n        node {\n          id\n          task {\n            id\n            title\n          }\n          dayOfWeek\n          section\n          createdAt\n        }\n        cursor\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateRoutineSlot($input: CreateRoutineSlotInput!) {\n    createRoutineSlot(input: $input) {\n      routineSlotEdge {\n        node {\n          id\n          task {\n            id\n            title\n          }\n          dayOfWeek\n          section\n          createdAt\n        }\n        cursor\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTaskMutation($title: String!) {\n    createTask(title: $title) {\n      taskEdge {\n        node {\n          id\n          title\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTaskMutation($title: String!) {\n    createTask(title: $title) {\n      taskEdge {\n        node {\n          id\n          title\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation CreateRoutineSlot($input: CreateRoutineSlotInput!) {\n          createRoutineSlot(input: $input) {\n            routineSlotEdge {\n              node {\n                id\n                task {\n                  id\n                  title\n                }\n                dayOfWeek\n                section\n                createdAt\n              }\n              cursor\n            }\n          }\n        }\n      "): (typeof documents)["\n        mutation CreateRoutineSlot($input: CreateRoutineSlotInput!) {\n          createRoutineSlot(input: $input) {\n            routineSlotEdge {\n              node {\n                id\n                task {\n                  id\n                  title\n                }\n                dayOfWeek\n                section\n                createdAt\n              }\n              cursor\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation DeleteRoutineSlot($routineSlotId: ID!) {\n          deleteRoutineSlot(routineSlotId: $routineSlotId) {\n            deletedId\n          }\n        }\n      "): (typeof documents)["\n        mutation DeleteRoutineSlot($routineSlotId: ID!) {\n          deleteRoutineSlot(routineSlotId: $routineSlotId) {\n            deletedId\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation UpdateTask($input: UpdateTaskInput!) {\n          updateTask(input: $input) {\n            task {\n              id\n              title\n            }\n          }\n        }\n      "): (typeof documents)["\n        mutation UpdateTask($input: UpdateTaskInput!) {\n          updateTask(input: $input) {\n            task {\n              id\n              title\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation DeleteTask($taskId: ID!) {\n          deleteTask(taskId: $taskId) {\n            deletedId\n          }\n        }\n      "): (typeof documents)["\n        mutation DeleteTask($taskId: ID!) {\n          deleteTask(taskId: $taskId) {\n            deletedId\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        query TasksTestOne {\n          tasks(first: 1) {\n            edges {\n              node {\n                title\n              }\n            }\n          }\n        }\n      "): (typeof documents)["\n        query TasksTestOne {\n          tasks(first: 1) {\n            edges {\n              node {\n                title\n              }\n            }\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query PaginatedTasks($after: String) {\n        tasks(first: 10, after: $after) {\n          edges {\n            node {\n              id\n              title\n            }\n          }\n          pageInfo {\n            hasNextPage\n            endCursor\n            startCursor\n          }\n        }\n      }\n    "): (typeof documents)["\n      query PaginatedTasks($after: String) {\n        tasks(first: 10, after: $after) {\n          edges {\n            node {\n              id\n              title\n            }\n          }\n          pageInfo {\n            hasNextPage\n            endCursor\n            startCursor\n          }\n        }\n      }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;