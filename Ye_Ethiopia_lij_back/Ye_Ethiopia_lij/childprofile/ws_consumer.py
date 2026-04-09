"""
WebSocket consumer — pushes real-time notifications to authenticated users.
Each user joins their own group: notifications_<user_id>
Signals call channel_layer.group_send() to push new notifications instantly.
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope.get('user')
        if not user or not user.is_authenticated:
            await self.close(code=4001)
            return

        self.group_name = f'notifications_{user.id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # Receive message from channel layer (sent by signals)
    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event['notification']))
