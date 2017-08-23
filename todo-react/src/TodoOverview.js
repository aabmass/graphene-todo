import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import {
  Grid,
  Segment,
  Divider,
  Checkbox,
} from 'semantic-ui-react';

import TodoList from './TodoList';
import NewTodoForm from './NewTodoForm';

class TodoOverview extends Component {
  state = {
    filterCompleted: false,
  }

  _onChangeFilterCompleted = (event, { checked }) => {
    this.setState({
      filterCompleted: checked,
    });
  }

  render() {
    const {
      error,
      loading,
      todos = [],
      users = [],
    } = this.props.data;
    const { filterCompleted } = this.state;

    if (error) {
      return <p>Error!</p>;
    }

    return (
      <Grid columns={2}>
        <Grid.Column>
          <Segment>
            <NewTodoForm users={users} />
          </Segment>
        </Grid.Column>
        
        <Grid.Column>
          <Segment loading={loading}>
            <p>{todos.length} todos</p>
            <div>
              <Checkbox
                label="Completed"
                onChange={this._onChangeFilterCompleted}
                checked={filterCompleted}
              />
            </div>
            <Divider />
            <TodoList todos={todos} filterCompleted={filterCompleted} />
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export const TodoOverviewQuery = gql`
  query TodoOverview {
    todos {
      ...TodoList_todo
    }

    users {
      ...NewTodoForm_user
    }
  }

  ${TodoList.fragments.todo}
  ${NewTodoForm.fragments.user}
`;

export default graphql(TodoOverviewQuery)(TodoOverview);
