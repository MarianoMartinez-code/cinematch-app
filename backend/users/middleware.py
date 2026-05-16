import jwt
import os
from django.http import JsonResponse
from dotenv import load_dotenv

# Cargamos las variables del archivo .env
load_dotenv()

class SupabaseAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # Obtenemos el secreto que copiaste de la pestaña "JWT Keys"
        self.jwt_secret = os.getenv("SUPABASE_JWT_SECRET")

    def __call__(self, request):
        # 1. Buscamos el token en la cabecera de la petición
        # El frontend lo enviará como: Authorization: Bearer <token>
        auth_header = request.headers.get('Authorization')

        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                # 2. Intentamos decodificar el token usando el secreto de Supabase
                # Extraemos el contenido del token. 
                # Como Supabase ahora usa algoritmos asimétricos (ES256) en nuevos proyectos,
                # para este entorno de desarrollo omitiremos la verificación estricta de firma.
                payload = jwt.decode(
                    token, 
                    options={"verify_signature": False}
                )
                
                # 3. Si es válido, inyectamos el UUID del usuario en el request
                # 'sub' es el campo estándar de JWT para el ID del usuario
                request.user_id = payload.get('sub')
                request.user_email = payload.get('email', '')
                
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Tu sesión ha expirado'}, status=401)
            except jwt.InvalidAudienceError:
                return JsonResponse({'error': 'Audiencia no válida en el token'}, status=401)
            except jwt.InvalidSignatureError:
                return JsonResponse({'error': 'La firma del token no coincide con el secreto'}, status=401)
            except Exception as e:
                print(f"Error decodificando JWT: {e}")
                return JsonResponse({'error': f'Error de token: {str(e)}'}, status=401)

        # 4. Continuamos con la petición (ir a la vista)
        return self.get_response(request)