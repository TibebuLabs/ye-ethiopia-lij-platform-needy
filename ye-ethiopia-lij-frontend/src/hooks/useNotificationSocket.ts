/**
 * WebSocket hook — disabled because backend runs as WSGI (no channels/daphne).
 * Notifications are delivered via REST polling in NotificationContext instead.
 */
import type { Notification } from '../types'

type Handler = (n: Notification) => void

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useNotificationSocket(_onNotification: Handler, _enabled: boolean) {
  // No-op: WebSocket not available in WSGI mode
}

export function resetNotificationSocket() {
  // No-op
}
