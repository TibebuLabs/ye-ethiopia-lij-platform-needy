from django.contrib import admin
from .models import Organization, OrganizationReport, ChildSubmissionTracking, SponsorshipReceived

admin.site.register(Organization)
admin.site.register(OrganizationReport)
admin.site.register(ChildSubmissionTracking)
admin.site.register(SponsorshipReceived)
