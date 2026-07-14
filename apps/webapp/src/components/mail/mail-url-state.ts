export const MAIL_THREAD_ID_PARAM = "threadId";
export const MAIL_COMPOSE_PARAM = "compose";
export const MAIL_PATIENT_ID_PARAM = "patientId";

export const MAIL_COMPOSE_NEW = "new";
export const MAIL_COMPOSE_REPLY = "reply";
export const MAIL_COMPOSE_FORWARD = "forward";

export type ComposeMode = typeof MAIL_COMPOSE_NEW | typeof MAIL_COMPOSE_REPLY | typeof MAIL_COMPOSE_FORWARD;
