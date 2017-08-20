import graphene
from django.contrib.auth.models import User
from graphene_django.types import DjangoObjectType
from todos.models import Todo


class TodoType(DjangoObjectType):
    class Meta:
        model = Todo

class UserType(DjangoObjectType):
    class Meta:
        model = User

class Query(graphene.AbstractType):
    todos = graphene.List(
        TodoType,
        completed=graphene.Boolean(),
        first=graphene.Int(),
    )
    users = graphene.List(
        UserType,
        first=graphene.Int(),
    )

    todo = graphene.Field(
        TodoType,
        id=graphene.Int(),
        title=graphene.String(),
    )

    user = graphene.Field(
        UserType,
        id=graphene.Int(),
        username=graphene.String(),
    )

    def resolve_todos(self, args, context, info):
        completed = args.get('completed')
        first = args.get('first')

        todos = Todo.objects.all()

        if completed is not None:
            todos = todos.filter(completed=completed)
        if first is not None:
            todos = todos[:first]

        return todos
    
    def resolve_users(self, args, context, info):
        return User.objects.all()

    def resolve_todo(self, args, context, info):
        id = args.get('id')
        title = args.get('title')
        completed = args.get('completed')

        if id is not None:
            return Todo.objects.get(pk=id)
        elif title is not None:
            return Todo.objects.get(title=title)
        elif completed is not None:
            return Todo.objects.get(completed=completed)

        return None

    def resolve_user(self, args, context, info):
        id = args.get('id')
        username = args.get('username')

        if id is not None:
            return User.objects.get(pk=id)
        elif username is not None:
            return User.objects.get(username=username)

        return None


class UpdateTodo(graphene.Mutation):
    class Input:
        id = graphene.NonNull(graphene.ID)
        title = graphene.String()
        body = graphene.String()
        completed = graphene.Boolean()
    
    todo = graphene.Field(TodoType)

    @staticmethod
    def mutate(root, args, context, info):
        id = args.pop('id')
        todo = Todo.objects.get(pk=id)
        todo.set_properties(**args)
        todo.save()

        return UpdateTodo(todo)


class CreateTodo(graphene.Mutation):
    class Input:
        title = graphene.NonNull(graphene.String)
        body = graphene.NonNull(graphene.String)
        completed = graphene.NonNull(graphene.Boolean)
        creator_username = graphene.String()
        creator_id = graphene.Int()

    todo = graphene.Field(TodoType)

    @staticmethod
    def mutate(root, args, context, info):
        creator_username = args['creator_username']
        creator_id = args.get['creator_id']

        if creator_username:
            args['creator'] = User.objects.get(username=creator_username)
        else:
            args['creator'] = User.objects.get(pk=creator_id)

        todo = Todo(**args)
        todo.save()
        return CreateTodo(todo)

class TodoMutations(graphene.ObjectType):
    create_todo = CreateTodo.Field()
    update_todo = UpdateTodo.Field()
