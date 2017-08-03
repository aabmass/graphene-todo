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
    )
    users = graphene.List(UserType)

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

        if completed is not None:
            return Todo.objects.filter(completed=completed)

        return Todo.objects.all()
    
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


class CreateTodo(graphene.Mutation):
    class Input:
        title = graphene.String()
        body = graphene.String()
        completed = graphene.Boolean()
        creator_username = graphene.String()
        creator_id = graphene.Int()

    ok = graphene.Boolean()
    todo = graphene.Field(TodoType)

    @staticmethod
    def mutate(root, args, context, info):
        title = args.get('title')
        body = args.get('body')
        completed = args.get('completed')
        creator_username = args.get('creator_username')
        creator_id = args.get('creator_id')
        creator = None

        if creator_username:
            creator = User.objects.get(username=creator_username)
        else:
            creator = User.objects.get(pk=creator_id)

        ok = True
        constr_args = dict(
            title=title,
            body=body,
            completed=completed,
            creator=creator,
        )
        todo = TodoType(**constr_args)

        todoModel = Todo(**constr_args)
        todoModel.save()

        return CreateTodo(ok=ok, todo=todo)

class TodoMutations(graphene.ObjectType):
    create_todo = CreateTodo.Field()
