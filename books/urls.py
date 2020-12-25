from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("getBooks", views.fetchBooks, name="get_books"),
    path("checkout", views.borrow, name="borrow"),
    path("thanks", views.thanks, name="thanks"),
]