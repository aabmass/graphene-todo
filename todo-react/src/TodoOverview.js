import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import {
  Segment,
  Divider,
  Checkbox,
} from 'semantic-ui-react';
import TodoList from './TodoList';

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
      todos = []
    } = this.props.data;
    const { filterCompleted } = this.state;

    if (error) {
      return <p>Error!</p>;
    }

    return (
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
    );
  }
}

export default graphql(gql`
  query TodoOverview {
    todos {
      ...TodoList_todo
    }
  }

  ${TodoList.fragments.todo}
`)(TodoOverview);
