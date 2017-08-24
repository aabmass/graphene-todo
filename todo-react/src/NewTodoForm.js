import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import {
  Form,
  Search,
} from 'semantic-ui-react';
import { addTodoUpdateFactory } from './TodoOverview';
import Todo from './Todo';

class NewTodoForm extends Component {
  state = this._getInitialState();

  _onChange = (e, { name, value, checked }) => {
    this.setState({
      mutationParams: Object.assign({},
        this.state.mutationParams,
        { [name]: value || checked },
      ),
    });
  };

  _onSearchChange = (event, { value }) => {
    this.setState({
      searchQuery: value,
    });
  }

  _onResultSelect = (event, { result: { title, id } }) => {
    this.setState({
      mutationParams: Object.assign({},
        this.state.mutationParams,
        { creatorId: id },
      ),
      searchQuery: title,
    });
  }

  _onSubmit = e => {
    this.props.mutate({
      variables: this.state.mutationParams,
      update: addTodoUpdateFactory(res => res.data.createTodo.todo),
    })
      .then(() => {
        this.setState(this._getInitialState())
      });
  };

  _getInitialState() {
    return {
      mutationParams: {
        title: '',
        body: '',
        creatorId: null,
        completed: false,
      },
      searchQuery: '',
    };
  }

  render() {
    const { users } = this.props;
    const { mutationParams, searchQuery } = this.state;
    const {
      title,
      body,
      completed,
    } = mutationParams;

    const searchResults = users
      .filter(user => user.username.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1)
      .map(user => {
        const fullName = user.firstName + ' ' + user.lastName;
        return {
          title: user.username,
          description: fullName !== ' ' ? fullName : null,
          id: parseInt(user.id, 10),
        }
      });

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
        <Form.Field>
          <label>User</label>
          <Search
            onResultSelect={this._onResultSelect}
            onSearchChange={this._onSearchChange}
            results={searchResults}
            value={searchQuery}
          />
        </Form.Field>
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
      id
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
    $creatorId: ID!,
    $completed: Boolean!) {

    createTodo(
      creatorId: $creatorId,
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
