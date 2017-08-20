import React from 'react';
import './Todo.css'
import { gql, graphql } from 'react-apollo';
import { stringToSemanticColor } from './util';
import {
  Card,
  Checkbox,
  Label,
  Grid,
  Icon,
} from 'semantic-ui-react';

const Todo = ({ todo, mutate }) => {
  const {
    title,
    body,
    completed,
    creator,
  } = todo;

  const onToggle = (event, { checked }) => {
    mutate({
      variables: {
        id: todo.id,
        completed: checked,
      },
      optimisticResponse: {
        updateTodo: {
          __typename: 'TodoType',
          todo: {
            ...todo,
            completed: checked,
          },
        },
      },
    });
  }

  return (
    <Card>
      <Card.Content>
        <Card.Header>{title}</Card.Header>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Grid columns={2}>
          <Grid.Column floated="left">
            <Label
              color={stringToSemanticColor(creator.username)}
              ribbon>

              <Icon name='user' /> {creator.username}
            </Label>
          </Grid.Column>
          <Grid.Column floated="right">
            <Checkbox
              label="Completed"
              checked={completed}
              onChange={onToggle}
            />
          </Grid.Column>
        </Grid>
      </Card.Content>
    </Card>
  );
};

Todo.fragments = {
  todo: gql`
    fragment Todo_todo on TodoType {
      id
      title
      body
      completed
      creator {
        username
        firstName
        lastName
      }
    }
  `
}

export default graphql(gql`
  mutation UpdateTodo(
    $id: ID!,
    $title: String,
    $body: String,
    $completed: Boolean) {

    updateTodo(
      id: $id,
      title: $title,
      body: $body,
      completed: $completed
    ) {
      todo {
        ...Todo_todo
      }
    }
  }
  
  ${Todo.fragments.todo}
`)(Todo);
