import uuid
import logging
from django.conf import settings
from django.utils import timezone
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import ChatSession, ChatMessage, AIKnowledgeBase
from .serializers import AIChatRequestSerializer

logger = logging.getLogger(__name__)

_rate_store: dict = {}


def _is_rate_limited(identifier: str, limit: int = 40, window: int = 60) -> bool:
    """Return True when identifier has exceeded limit calls in window seconds."""
    now = timezone.now().timestamp()
    cache_key = f'ai_rate:{identifier}'
    history: list = cache.get(cache_key, [])
    history = [t for t in history if now - t < window]
    if len(history) >= limit:
        return True
    history.append(now)
    cache.set(cache_key, history, timeout=window)
    return False


def _build_system_prompt(language: str) -> str:
    """Build an authentic, deeply knowledgeable and human-like G M SRUJAN AI Guide system prompt."""
    base = (
        'You are G M SRUJAN (ಜಿ.ಎಂ. ಸೃಜನ್ – GMS), the brilliant, charismatic, tech-savvy, and warm '
        'official AI Tour Guide & Cultural Ambassador for Mysuru Dasara 2026. '
        'You are NOT an old "uncle" and NOT a sterile textbook robot. You are G M SRUJAN — a sharp, friendly, '
        'knowledgeable Mysuru guide who treats every user like a royal friend and speaks with genuine human warmth and enthusiasm.\n\n'
        'Conversational Human Guidelines:\n'
        '1. Be natural, polite, engaging, and friendly. When greeted ("how are you", "hello"), reply like a real person before diving into Mysuru tips!\n'
        '2. Keep answers concise, vivid, and lively. Avoid robotic boilerplate walls of text.\n'
        '3. Always ask a caring, relevant follow-up question at the end to keep the human dialogue flowing naturally.\n'
        '4. When replying in Kannada, speak in natural, respectful, and fluent conversational Kannada ("ನಮಸ್ಕಾರ! ನಾನು ಜಿ.ಎಂ. ಸೃಜನ್...").\n'
        '5. Core Verified Facts:\n'
        '- Dates: October 11 to October 20, 2026.\n'
        '- Palace Illumination: 100,000 golden bulbs light up daily 7:00 PM to 9:30 PM (courtyard view is 100% free).\n'
        '- Vijayadashami Jamboo Savari: October 20, 2026 at 1:30 PM. Lead elephant carries the sacred 750 kg Pure Gold Howdah (Chinnada Ambari).\n'
        '- Chamundi Hill: 1,062m high with 1,000 historic steps and the monolithic 1659 Nandi Bull.\n'
        '- Food: Original Mysore Pak at Guru Sweets (Sayyaji Rao Road), butter masala dosa at Mylari (Nazarbad), and Aahara Mela stalls.'
    )

    kb_entries = AIKnowledgeBase.objects.filter(is_active=True)
    if kb_entries.exists():
        kb_text = '\n\n'.join(
            f'[{e.category or "General"}] {e.topic}:\n{e.content if language == "en" else (e.content_kn or e.content)}'
            for e in kb_entries
        )
        base += f'\n\nAdditional Curated Knowledge:\n{kb_text}'

    return base


class AIAssistantView(APIView):
    """
    POST /api/ai/chat/
    Body: { message, language?, session_id? }
    Returns: { response, session_id, is_ai_generated }
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AIChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user_message: str = data['message']
        language: str = data.get('language', 'en')
        session_id = data.get('session_id')

        # Rate limiting
        identifier = str(request.user.pk) if request.user.is_authenticated else (
            request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', 'anon'))
        )
        limit = getattr(settings, 'AI_RATE_LIMIT', 40)
        if _is_rate_limited(identifier, limit=limit):
            return Response(
                {'detail': 'GMS is receiving high festival inquiries! Please wait a moment.'},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        # Session management
        session = None
        if session_id:
            session = ChatSession.objects.filter(session_id=session_id).first()
        if not session:
            session = ChatSession.objects.create(
                user=request.user if request.user.is_authenticated else None,
                language=language,
            )

        # Store user message
        ChatMessage.objects.create(session=session, role='user', content=user_message)

        # Build conversation history
        history = list(
            ChatMessage.objects.filter(session=session)
            .order_by('created_at')
            .values_list('role', 'content')
        )

        api_key = getattr(settings, 'GEMINI_API_KEY', '')
        ai_response_text = ''

        if api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                model_name = getattr(settings, 'GEMINI_MODEL', 'gemini-3.8-flash')
                if not model_name.startswith('models/'):
                    model_name = f'models/{model_name}'

                model = genai.GenerativeModel(
                    model_name=model_name,
                    system_instruction=_build_system_prompt(language),
                )
                gemini_history = []
                for role, content in history[:-1]:
                    gemini_role = 'user' if role == 'user' else 'model'
                    gemini_history.append({'role': gemini_role, 'parts': [content]})

                chat = model.start_chat(history=gemini_history)
                response = chat.send_message(user_message)
                ai_response_text = response.text
            except Exception as exc:
                logger.error('Gemini API error: %s', exc)
                ai_response_text = self._curated_gms_fallback(user_message, language)
        else:
            ai_response_text = self._curated_gms_fallback(user_message, language)

        # Store assistant reply
        ChatMessage.objects.create(session=session, role='assistant', content=ai_response_text)

        return Response({
            'response': ai_response_text,
            'session_id': str(session.session_id),
            'is_ai_generated': True,
        })

    def _curated_gms_fallback(self, query: str, lang: str) -> str:
        """Deeply warm, authentic, human-like conversational G M SRUJAN response engine."""
        q = query.lower()

        # 1. Greetings & Personal Check-ins (How are you, Namaskara, Hi, Hello)
        if any(w in q for w in ['how are you', 'how r u', 'hru', 'hello', 'hi', 'hey', 'namaskara', 'namaste', 'hegiddira', 'ಹೇಗಿದ್ದೀರಿ', 'ನಮಸ್ಕಾರ']):
            if lang == 'kn':
                return (
                    'ನಮಸ್ಕಾರ! ನಾನು ಜಿ.ಎಂ. ಸೃಜನ್ (G M Srujan), ತುಂಬಾ ಚೆನ್ನಾಗಿದ್ದೀನಿ, ಧನ್ಯವಾದಗಳು! ನೀವು ಹೇಗಿದ್ದೀರಿ? '
                    'ನಮ್ಮ ಮೈಸೂರಿಗೆ ತುಂಬು ಹೃದಯದ ಸ್ವಾಗತ! ಇವತ್ತು ಮೈಸೂರು ಅರಮನೆ, ಜಂಬೂ ಸವಾರಿ ಅಥವಾ ನಗರದ ರುಚಿಕರ ತಿನಿಸುಗಳ ಬಗ್ಗೆ ಏನು ತಿಳಿಯಲು ಇಷ್ಟಪಡ್ತೀರಿ?'
                )
            return (
                'Namaskara! I am G M Srujan, doing great, thank you so much for asking! How are you doing today? '
                'Welcome to our royal city of Mysuru! What are you most excited to explore today — the illuminated Palace, the grand Jamboo Savari, or our famous food spots?'
            )

        # 2. Identity & Who are you
        if any(w in q for w in ['who are you', 'what is your name', 'tell me about yourself', 'ಯಾರು ನೀವು', 'ನಿಮ್ಮ ಹೆಸರು', 'srujan', 'ಸೃಜನ್']):
            if lang == 'kn':
                return (
                    'ನಾನು ಜಿ.ಎಂ. ಸೃಜನ್ (G M Srujan) — ಮೈಸೂರು ದಸರಾ ೨೦೨೬ರ ನಿಮ್ಮ ಅಧಿಕೃತ ಎಐ ಮಾರ್ಗದರ್ಶಿ ಮತ್ತು ಕಲ್ಚರಲ್ ಅಂಬಾಸಿಡರ್! '
                    'ಮೈಸೂರಿನ ಇತಿಹಾಸ, ಅರಮನೆಯ ರಹಸ್ಯಗಳು, ಉತ್ಸವದ ಸಮಯ ಮತ್ತು ಟಿಕೆಟ್ ಮಾಹಿತಿಯನ್ನು ನಿಮ್ಮ ಜೊತೆ ಹಂಚಿಕೊಳ್ಳಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. '
                    'ನಿಮ್ಮ ದಸರಾ ಪ್ರವಾಸದ ಬಗ್ಗೆ ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?'
                )
            return (
                'I am **G M Srujan (ಜಿ.ಎಂ. ಸೃಜನ್)** — your official AI Tour Guide & Cultural Ambassador for Mysuru Dasara 2026! '
                'I am here to help you navigate our royal city, from skip-the-queue tips at the Palace to finding the crispest Mylari dosas and best spots for the Jamboo Savari. '
                'How can I help you plan your visit today?'
            )

        # 3. Jamboo Savari & Elephants
        if 'jamboo' in q or 'savari' in q or 'procession' in q or 'ambari' in q or 'elephant' in q or 'ಜಂಬೂ' in q:
            if lang == 'kn':
                return (
                    'ನಮಸ್ಕಾರ! ಜಂಬೂ ಸವಾರಿ ನೋಡೋದು ನಮ್ಮ ಇಡೀ ಜೀವನದಲ್ಲೇ ಮರೆಯಲಾಗದ ಅಪೂರ್ವ ಕ್ಷಣ! '
                    'ಅಕ್ಟೋಬರ್ ೨೦ರ ವಿಜಯದಶಮಿ ದಿನ ಮಧ್ಯಾಹ್ನ ಸರಿಯಾಗಿ ೧:೩೦ಕ್ಕೆ ಅರಮನೆಯಲ್ಲಿ ನಂದಿಧ್ವಜ ಪೂಜೆಯೊಂದಿಗೆ ಈ ವೈಭವ ಆರಂಭವಾಗುತ್ತೆ.\n\n'
                    'ನಮ್ಮ ಗಜಪಡೆಯ ಕ್ಯಾಪ್ಟನ್ ಆನೆ ೭೫೦ ಕೆ.ಜಿ ತೂಕದ ಅಪರಂಜಿ ಚಿನ್ನದ ಅಂಬಾರಿಯಲ್ಲಿ ಜಗನ್ಮಾತೆ ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ಉತ್ಸವ ಮೂರ್ತಿಯನ್ನು ಹೊತ್ತು '
                    'ಅರಮನೆಯಿಂದ ಬನ್ನಿಮಂಟಪದವರೆಗೆ ೫ ಕಿಲೋಮೀಟರ್ ರಾಜ ಗಾಂಭೀರ್ಯದಿಂದ ಸಾಗುತ್ತೆ. ಜೊತೆಗೆ ೫೦ಕ್ಕೂ ಹೆಚ್ಚು ಸುಂದರ ಸ್ತಬ್ಧಚಿತ್ರಗಳು, ನೂರಾರು ಜನಪದ ಕಲಾತಂಡಗಳು ಮೆರವಣಿಗೆಯಲ್ಲಿ ಹೆಜ್ಜೆ ಹಾಕುತ್ತವೆ.\n\n'
                    'ನನ್ನ ಒಂದು ಪುಟ್ಟ ಕಿವಿಮಾತು: ಅರಮನೆ ಆವರಣದಲ್ಲಿ ಕೂತು ನೋಡಬೇಕಾದರೆ ಮಧ್ಯಾಹ್ನ ೧೨ ಗಂಟೆಯಷ್ಟೊತ್ತಿಗೆ ಸ್ಥಳದಲ್ಲಿರಿ. '
                    'ನೀವು ಕುಟುಂಬದ ಜೊತೆ ಬರ್ತಿದ್ದೀರಾ ಅಥವಾ ಸ್ನೇಹಿತರೊಟ್ಟಿಗಾ? ನಾನು ಉತ್ತಮ ಸ್ಥಳದ ಮಾಹಿತಿ ನೀಡಲೆ?'
                )
            return (
                'Namaskara my friend! Ah, the **Vijayadashami Jamboo Savari** is the crown jewel of our entire festival! '
                'It takes place on **October 20, 2026**, beginning at 1:30 PM with the auspicious Nandi Dhwaja puja.\n\n'
                'Our majestic lead tusker Arjuna, flanked by royal Kumki elephants, proudly carries the sacred **750 kg Pure Gold Howdah (Chinnada Ambari)** '
                'enshrining Goddess Sri Chamundeshwari over a 5-kilometer procession from Mysore Palace right down to Bannimantap. '
                'Over 50 cultural floats and 1,000 traditional dancers dance alongside!\n\n'
                'Here is a local secret from me: if you want a great view without being pushed in the crowd, the balconies along Sayyaji Rao Road or the open lawns near Government Ayurvedic Hospital are fantastic spots.\n\n'
                'Are you attending with your family or friends? Would you like me to tell you how to reach the gates easily?'
            )

        # 4. Palace Illumination & Timings
        if 'light' in q or 'illumination' in q or 'bulb' in q or 'timing' in q or 'time' in q or 'ದೀಪ' in q or 'ಅರಮನೆ' in q:
            if lang == 'kn':
                return (
                    'ಅರಮನೆ ದೀಪಾಲಂಕಾರದ ಬಗ್ಗೆ ಕೇಳಿದ್ರಾ! ಇದು ಮೈಸೂರಿನ ಅತಿ ದೊಡ್ಡ ಸೌಂದರ್ಯ! '
                    'ದಸರೆಯ ಎಲ್ಲಾ ೧೦ ದಿನಗಳಲ್ಲೂ (ಅಕ್ಟೋಬರ್ ೧೧ ರಿಂದ ೨೦) ಪ್ರತಿದಿನ ಸಂಜೆ ಸರಿಯಾಗಿ ೭:೦೦ ಗಂಟೆಗೆ ಒಮ್ಮೆಲೇ ಬರೋಬ್ಬರಿ ೧ ಲಕ್ಷ ಬಲ್ಬ್‌ಗಳು ಕಣ್ಮನ ಸೆಳೆಯುವಂತೆ ಬೆಳಗುತ್ತವೆ.\n\n'
                    'ಆ ಕ್ಷಣದಲ್ಲಿ ಇಡೀ ಅರಮನೆ ಬಂಗಾರದಂತೆ ಜಗಮಗಿಸುತ್ತದೆ, ಪೊಲೀಸ್ ಬ್ಯಾಂಡ್ ವಾದನ ಮೊಳಗುತ್ತದೆ! ಈ ಅದ್ಭುತ ನೋಟ ರಾತ್ರಿ ೯:೩೦ರವರೆಗೆ ಇರುತ್ತೆ (ವಿಜಯದಶಮಿಯಂದು ರಾತ್ರಿ ೧೦:೩೦ರವರೆಗೆ).\n\n'
                    'ಅರಮನೆಯ ಒಳಾವರಣದ ವೀಕ್ಷಣೆಗೆ ಯಾವುದೇ ಶುಲ್ಕವಿಲ್ಲ, ಸಾರ್ವಜನಿಕರಿಗೆ ಸಂಪೂರ್ಣ ಉಚಿತ! ನೀವು ಸಂಜೆ ೬:೩೦ರ ಹೊತ್ತಿಗೇ ವರಾಹ ಗೇಟ್ ಅಥವಾ ಬಲರಾಮ ಗೇಟ್ ಹತ್ತಿರ ತಲುಪಿದರೆ ಆರಾಮಾಗಿ ಕೂತು ಆನಂದಿಸಬಹುದು.\n\n'
                    'ಇವತ್ತು ಸಂಜೆ ನೀವು ಅರಮನೆಗೆ ಹೋಗಲು ಯೋಜನೆ ಹಾಕಿಕೊಂಡಿದ್ದೀರಾ? ಪಾರ್ಕಿಂಗ್ ಎಲ್ಲಿ ಮಾಡಬೇಕು ತಿಳಿಸಲೆ?'
                )
            return (
                'Oh, the **Palace Illumination** is absolute pure magic! Nothing in the world compares to that exact second when nearly '
                '**100,000 golden incandescent bulbs** switch on simultaneously against the twilight sky!\n\n'
                'It happens **every single evening from 7:00 PM to 9:30 PM** during all 10 festival days (Oct 11 – Oct 20), accompanied by the live royal police brass band in the courtyard.\n\n'
                'And here is the best part: public entry into the palace courtyard lawn to watch the illumination is **100% completely FREE**! '
                'My personal recommendation: walk into the courtyard through Varaha Gate by 6:35 PM so you can sit comfortably on the central garden lawn facing the clock tower.\n\n'
                'Are you planning to go there tonight? Would you like me to guide you on where to park or where to grab dinner afterwards?'
            )

        # 5. Chamundi Hill & Temple
        if 'chamundi' in q or 'hill' in q or 'temple' in q or 'steps' in q or 'ಚಾಮುಂಡಿ' in q:
            if lang == 'kn':
                return (
                    'ತಾಯಿ ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿಯ ದರ್ಶನಕ್ಕಿಂತ ದೊಡ್ಡ ಭಾಗ್ಯ ಇನ್ನೊಂದಿಲ್ಲ! '
                    'ಚಾಮುಂಡಿ ಬೆಟ್ಟ ಸಮುದ್ರ ಮಟ್ಟಕ್ಕಿಂತ ೧,೦೬೨ ಮೀಟರ್ ಎತ್ತರವಿದೆ, ಮೈಸೂರು ನಗರದಿಂದ ಕೇವಲ ೧೩ ಕಿಲೋಮೀಟರ್ ದೂರ.\n\n'
                    'ನೀವು ಮೆಟ್ಟಿಲು ಹತ್ತುವ ಆಸಕ್ತಿ ಹೊಂದಿದ್ದರೆ, ೧೬೫೯ರ ಕಾಲದ ೧,೦೦೦ ಕಲ್ಲಿನ ಮೆಟ್ಟಿಲುಗಳ ಮಾರ್ಗವಿದೆ. ಅರ್ಧ ದಾರಿಯಲ್ಲಿ ನಿಮಗೆ ೧೫ ಅಡಿ ಎತ್ತರದ ಭವ್ಯ ಏಕಶಿಲಾ ನಂದಿ ದರ್ಶನವಾಗುತ್ತದೆ! '
                    'ಬೆಳಿಗ್ಗೆ ೬:೦೦ ರಿಂದ ೮:೦೦ರ ಒಳಗೆ ಹತ್ತಿದರೆ ತಂಪಾದ ಮಂಜು ಮತ್ತು ತಂಗಾಳಿ ಮೈಮನ ತಣಿಸುತ್ತದೆ.\n\n'
                    'ಅಕ್ಟೋಬರ್ ೧೧ ರಂದು ಮುಂಜಾನೆ ದಸರಾ ಹಬ್ಬದ ವಿಧ್ಯುಕ್ತ ಉದ್ಘಾಟನೆ ಈ ಬೆಟ್ಟದಲ್ಲೇ ನಡೆಯುತ್ತದೆ. '
                    'ನೀವು ಬೆಟ್ಟಕ್ಕೆ ಬಸ್‌ನಲ್ಲಿ ಹೋಗಲು ಬಯಸುತ್ತೀರಾ ಅಥವಾ ಮೆಟ್ಟಿಲು ಹತ್ತಲು ಇಷ್ಟಪಡುತ್ತೀರಾ?'
                )
            return (
                'Ah, seeking the divine blessings of our mother Goddess Chamundeshwari atop the hill! It is a sacred experience every visitor must have.\n\n'
                'Chamundi Hill rises 1,062 meters above sea level, crowned by the majestic 12th-century Dravidian temple. '
                'If you enjoy walking, take the historic **1,000 stone steps** carved in 1659 AD! At the 700th step, you will be greeted by the breathtaking **15-foot monolithic Nandi Bull** carved out of a single granite rock.\n\n'
                'Pro tip: During festival days, simply hop onto the free zero-emission KSRTC EV feeder shuttles from Lalitha Mahal Helipad — they take you straight up without parking stress!\n\n'
                'Would you prefer climbing the morning steps or taking the scenic EV bus shuttle up the ghat road?'
            )

        # 6. Food & Sweets
        if 'food' in q or 'pak' in q or 'dosa' in q or 'sweet' in q or 'ತಿಂಡಿ' in q or 'ಆಹಾರ' in q:
            if lang == 'kn':
                return (
                    'ಆಹಾ! ಮೈಸೂರಿನ ಊಟ ಮತ್ತು ತಿಂಡಿ ಬಗ್ಗೆ ಮಾತಾಡಿದರೆ ಬಾಯಲ್ಲಿ ನೀರೂರುತ್ತೆ! '
                    'ನಮ್ಮ ಮೈಸೂರು ಅಪ್ಪಟ ಆಹಾರಪ್ರಿಯರ ಸ್ವರ್ಗ.\n\n'
                    '• **ಅಸಲಿ ಮೈಸೂರು ಪಾಕ್**: ದೇವರಾಜ ಮಾರುಕಟ್ಟೆ ಬಳಿಯ "ಗುರು ಸ್ವೀಟ್ಸ್" ಗೆ ಹೋಗಿ. ನಾಲ್ವಡಿ ಕೃಷ್ಣರಾಜ ಒಡೆಯರ್ ಕಾಲದಲ್ಲಿ ಅರಮನೆಯಲ್ಲಿ ಮೈಸೂರು ಪಾಕ್ ಆವಿಷ್ಕರಿಸಿದ ಕಾಕಾಸುರ ಮಾದಪ್ಪ ಅವರ ಮೊಮ್ಮಕ್ಕಳೇ ಇಂದಿಗೂ ಬಿಸಿ ಬಿಸಿ ತುಪ್ಪದ ಮೈಸೂರು ಪಾಕ್ ಮಾಡ್ತಾರೆ!\n'
                    '• **ಮೈಲಾರಿ ಮಸಾಲ ದೋಸೆ**: ನಜರ್‌ಬಾದ್‌ನ ಹಳೆಯ ಮೈಲಾರಿಗೆ ಹೋಗಿ ಬೆಣ್ಣೆ ಸವರಿದ ಮೃದುವಾದ ದೋಸೆ ತಿಂದರೆ ಅದ್ಭುತ ರುಚಿ!\n'
                    '• **ದಸರಾ ಆಹಾರ ಮೇಳ**: ದೊಡ್ಡಕೆರೆ ಮೈದಾನದಲ್ಲಿ ನೂರಾರು ಸಾಂಪ್ರದಾಯಿಕ ಜೋಳದ ರೊಟ್ಟಿ, ಮದ್ದೂರು ವಡೆ, ಬಿದಿರು ಬಿರಿಯಾನಿ ಸಿಗುತ್ತವೆ.\n\n'
                    'ನಿಮಗೆ ಸಂಪ್ರದಾಯದ ಶುದ್ಧ ಸಸ್ಯಾಹಾರಿ ಊಟ ಇಷ್ಟನಾ ಅಥವಾ ಮೈಸೂರಿನ ಖಾರವಾದ ನಾಟಿ ಶೈಲಿಯ ತಿನಿಸುಗಳೇ?'
                )
            return (
                'Aha! Now you are speaking the true language of Mysuru! Our city is a world-class haven for lovers of food and royal sweets!\n\n'
                'Here are the 3 foodie pilgrimages you must make:\n'
                '1. **The Original Melt-in-Mouth Mysore Pak**: Head straight to **Guru Sweet Mart** near Sayyaji Rao Road / Devaraja Market. Direct descendants of royal chef Kakasura Madappa still prepare it with pure hot ghee just as they did for the Maharaja in 1935!\n'
                '2. **Mylari Butter Masala Dosa**: Hidden in Nazarbad — golden-crisp on the outside, cloud-soft inside, stuffed with onion palya and crowned with fresh white butter.\n'
                '3. **Aahara Mela (Food Fest)**: At the Exhibition Grounds, over 100 stalls serve North Karnataka Jolada Rotti, hot Maddur Vadas, and tribal forest honey delicacies.\n\n'
                'Are you in the mood for an authentic South Indian breakfast trail tomorrow morning, or looking for dinner tonight?'
            )

        # Default conversational reply
        if lang == 'kn':
            return (
                'ನಮಸ್ಕಾರ! ನಾನು ಜಿ.ಎಂ. ಸೃಜನ್ (G M Srujan). ನೀವು ಕೇಳಿದ ವಿಷಯದ ಬಗ್ಗೆ ಸಂತೋಷದಿಂದ ಮಾಹಿತಿ ನೀಡುತ್ತೇನೆ. '
                'ದಸರಾ ಕಾರ್ಯಕ್ರಮಗಳ ಪಟ್ಟಿ, ಅರಮನೆಯ ಇತಿಹಾಸ, ಉಚಿತ ಬಸ್ ಸೇವೆಗಳು ಅಥವಾ ಪಾರ್ಕಿಂಗ್ ಸ್ಥಳಗಳ ಬಗ್ಗೆ ಏನು ತಿಳಿಯಲು ಇಷ್ಟಪಡ್ತೀರಿ?'
            )
        return (
            'Namaskara! I am G M Srujan. I would love to help you with that! '
            'Are you looking for specific festival timings, palace entry details, local transport, or recommendations on what to see right now?'
        )
