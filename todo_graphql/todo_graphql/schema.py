import graphene
import todos.schema


class Query(todos.schema.Query, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=todos.schema.TodoMutations)
