import React from 'react';
import { gql } from 'react-apollo';
import {
  Card
} from 'semantic-ui-react';

import Todo from './Todo';

const TodoList = ({ todos, filterCompleted }) => {
  todos = filterCompleted ? todos.filter(todo => todo.completed) : todos;
  return (
    <Card.Group>
      {todos
        .map((todo, i) => <Todo todo={todo} key={i} />)}
    </Card.Group>
  );
};

TodoList.fragments = {
  todo: gql`
    fragment TodoList_todo on TodoType {
      completed
      ...Todo_todo
    }

    ${Todo.fragments.todo}
  `
}

export default TodoList;
