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
