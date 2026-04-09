from django.apps import AppConfig


class ChildprofileConfig(AppConfig):
    name = 'childprofile'

    def ready(self):
        import childprofile.signals  # noqa: F401
