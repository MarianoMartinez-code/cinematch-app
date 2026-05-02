from django.db import models

class UserProfile(models.Model):
    # El user_id vendrá de Supabase (UUID)
    user_id = models.UUIDField(unique=True, primary_key=True)
    # Guardaremos algo como: {"28": 5.0, "12": 3.5}
    genre_scores = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Perfil: {self.user_id}"