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
    all_todos = graphene.List(TodoType)
    all_users = graphene.List(UserType)

    def resolve_all_todos(self, args, context, info):
        return Todo.objects.all()
    
    def resolve_all_users(self, args, context, info):
        return User.objects.all()
