import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import {
  Form,
} from 'semantic-ui-react';
import { addTodoUpdateFactory } from './TodoOverview';
import Todo from './Todo';

class NewTodoForm extends Component {
  state = this._getInitialState();

  _onChange = (e, { name, value, checked }) => {
    this.setState({ [name]: value || checked });
  };

  _onSubmit = e => {
    this.props.mutate({
      variables: this.state,
      update: addTodoUpdateFactory(res => res.data.createTodo.todo),
    });

    this.setState(this._getInitialState())
  };

  _getInitialState() {
    return {
      title: '',
      body: '',
      creatorUsername: '',
      completed: false,
    };
  }

  render() {
    const {
      title,
      body,
      completed,
      creatorUsername
    } = this.state;

    const { users } = this.props;

    const userOptions = users.map(user => ({
      text: user.username,
      value: user.username
    }));

    return (
      <Form onSubmit={this._onSubmit}>
        <Form.Input
          name="title"
          label="Title"
          placeholder="Todo Title"
          type="text"
          onChange={this._onChange}
          value={title}
        />
        <Form.TextArea
          name="body"
          label="Body"
          onChange={this._onChange}
          placeholder="I have to &hellip;"
          value={body}
        />
        <Form.Select
          name="creatorUsername"
          onChange={this._onChange}
          label="Creator"
          placeholder="Creator"
          options={userOptions}
          value={creatorUsername}
        />
        <Form.Checkbox
          name="completed"
          onChange={this._onChange}
          label="Completed"
          checked={completed}
        />
        <Form.Button>Submit</Form.Button>
      </Form>
    )
  }
}

NewTodoForm.fragments = {
  user: gql`
    fragment NewTodoForm_user on UserType {
      username
      firstName
      lastName
    }
  `,
};

export default graphql(gql`
  mutation CreateTodo(
    $title: String!,
    $body: String!,
    $creatorUsername: String!,
    $completed: Boolean!) {

    createTodo(
      creatorUsername: $creatorUsername,
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
`)(NewTodoForm);
