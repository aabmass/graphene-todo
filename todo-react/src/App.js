import React, { Component } from 'react';
import { ApolloClient, ApolloProvider } from 'react-apollo';

import PageLayout from './PageLayout';
import TodoOverview from './TodoOverview';

const client = new ApolloClient();

class App extends Component {
  render() {
    return (
      <div className="App">
        <ApolloProvider client={client}>
          <PageLayout>
            <TodoOverview />
          </PageLayout>
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
