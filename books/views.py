from django.shortcuts import render
from .models import Book, Person
from django.http import JsonResponse, HttpResponseRedirect
import json
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from django.http import HttpResponse
from django.template import loader


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


def get_data(request):
    data = [('الإسم', 'الرقم', 'الفرقة', 'الكتاب')]
    books = Book.objects.exclude(borrowed_by=None)
    for book in books:
        name = book.borrowed_by.name
        phone = book.borrowed_by.phone
        cls = book.borrowed_by.cls
        title = book.title
        response = (name, phone, cls, title)
        data.append(response)
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="AzbakiaData.csv"'

    t = loader.get_template('my_template_name.txt')
    c = {'data': data}
    response.write(t.render(c))
    return response


