from django.shortcuts import render
from .models import Book, Person
from django.http import JsonResponse, HttpResponseRedirect
import json
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse


def index(request):
    return render(request, "index.html")


def fetchBooks(request):
    if request.method == "GET":
        response = []
        books = Book.objects.filter(borrowed_by=None)
        for book in books:
            data = book.serializle()
            title = data["title"]
            id = data["id"]
            response.append({"title": title, "id": id})
        return JsonResponse(response, safe=False)


@csrf_exempt
def borrow(request):
    if request.method == "POST":
        data = json.loads(request.body)
        book_id, name, phone, cls = data["id"], data["name"], data["phone"], data["class"]
        try:
            borrower = Person(name=name, phone=phone, cls=cls)
            borrower.save()
            Book.objects.filter(id=book_id).update(borrowed_by=borrower)
            return HttpResponseRedirect(reverse("thanks"))
        except IntegrityError:
            return render(request, "index.html", {
                "message": "invalid"
            })


def thanks(request):
    return render(request, "thanks.html")
