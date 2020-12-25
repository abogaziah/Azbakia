from django.db import models
from django.contrib.auth.models import User


class Person(models.Model):
    name = models.CharField(max_length=250)
    phone = models.CharField(max_length=250)
    cls = models.CharField(max_length=250)

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=250)
    category = models.CharField(max_length=250, default=None, blank=True,
                                null=True)
    borrowed_by = models.ForeignKey(Person,
                               on_delete=models.CASCADE,
                               related_name='blog_posts',
                                    default=None, blank=True,
                                    null=True)
    created = models.DateTimeField(auto_now_add=True)

    def serializle(self):
        return {
            "title":self.title,
            "id":self.id
        }



    class Meta:
        ordering = ('-created',)
    def __str__(self):
        return self.title
