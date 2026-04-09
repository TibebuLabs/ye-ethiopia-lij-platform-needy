from django.apps import AppConfig


class AcadamicreportConfig(AppConfig):
    name = 'acadamicreport'

    def ready(self):
        import acadamicreport.signals  # noqa: F401
