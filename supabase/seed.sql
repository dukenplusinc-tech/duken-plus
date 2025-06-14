SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '26976885-f618-4f74-9d9e-a72c104705f1', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"shop1@bp.ltd","user_id":"ad0b1d54-3b89-45ea-9ead-c96073a7d2b5","user_phone":""}}', '2025-06-14 17:08:48.368844+00', ''),
	('00000000-0000-0000-0000-000000000000', '15fae251-ac03-4e84-a23d-dca40d9ab6e8', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"shop2@bp.ltd","user_id":"26e02e59-8748-46d1-840b-7551249d7317","user_phone":""}}', '2025-06-14 17:14:09.258624+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a1dd56f3-fef4-400f-84b2-c02d8cf6ea34', '{"action":"login","actor_id":"ad0b1d54-3b89-45ea-9ead-c96073a7d2b5","actor_username":"shop1@bp.ltd","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-14 17:17:07.130241+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '26e02e59-8748-46d1-840b-7551249d7317', 'authenticated', 'authenticated', 'shop2@bp.ltd', '$2a$10$.REtw3rHWV5KnwSi40XQPOp1e1hvEm0Xyjj0U76.k6RLzYh7Nlk02', '2025-06-14 17:14:09.260084+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-06-14 17:14:09.254682+00', '2025-06-14 17:14:09.260937+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'ad0b1d54-3b89-45ea-9ead-c96073a7d2b5', 'authenticated', 'authenticated', 'shop1@bp.ltd', '$2a$10$dh3qNwVfm72jO3Yuye3dgO98fCWPMrNyg4ttoQx5J339hSbJqrhta', '2025-06-14 17:08:48.376481+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-06-14 17:17:07.133378+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-06-14 17:08:48.346879+00', '2025-06-14 17:17:07.14248+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('ad0b1d54-3b89-45ea-9ead-c96073a7d2b5', 'ad0b1d54-3b89-45ea-9ead-c96073a7d2b5', '{"sub": "ad0b1d54-3b89-45ea-9ead-c96073a7d2b5", "email": "shop1@bp.ltd", "email_verified": false, "phone_verified": false}', 'email', '2025-06-14 17:08:48.363354+00', '2025-06-14 17:08:48.363419+00', '2025-06-14 17:08:48.363419+00', '69beff64-f01c-41a9-b417-7d4d90881b1f'),
	('26e02e59-8748-46d1-840b-7551249d7317', '26e02e59-8748-46d1-840b-7551249d7317', '{"sub": "26e02e59-8748-46d1-840b-7551249d7317", "email": "shop2@bp.ltd", "email_verified": false, "phone_verified": false}', 'email', '2025-06-14 17:14:09.257641+00', '2025-06-14 17:14:09.257691+00', '2025-06-14 17:14:09.257691+00', '4ae2a675-b409-4273-b17e-c74130928155');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('c48de8ab-375d-488c-8f82-0ba7741616c8', 'ad0b1d54-3b89-45ea-9ead-c96073a7d2b5', '2025-06-14 17:17:07.134027+00', '2025-06-14 17:17:07.134027+00', NULL, 'aal1', NULL, NULL, 'undici', '79.117.193.20', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('c48de8ab-375d-488c-8f82-0ba7741616c8', '2025-06-14 17:17:07.143129+00', '2025-06-14 17:17:07.143129+00', 'password', '9c59402c-9610-412a-b1b8-f62132ae9549');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 480, 'hfqry2esvs6e', 'ad0b1d54-3b89-45ea-9ead-c96073a7d2b5', false, '2025-06-14 17:17:07.136083+00', '2025-06-14 17:17:07.136083+00', NULL, 'c48de8ab-375d-488c-8f82-0ba7741616c8');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: cash_register; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shops; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."shops" ("id", "title", "address", "city") VALUES
	('5edadfbf-bd80-4530-b064-1ddc7f042227', 'Shop1', 'адрес', 'City'),
	('3980db0a-9225-4369-85fc-1807967a5dff', 'Shop 2', 'Shop2 addr', 'NY');


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: chat_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: contractors; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: debtors; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: debtor_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."employees" ("id", "shop_id", "full_name", "pin_code", "created_at", "updated_at") VALUES
	('de72bea6-b9a3-4cfc-9d9f-ff1f51be6ee8', '5edadfbf-bd80-4530-b064-1ddc7f042227', 'Степан', '1234', '2025-06-14 17:18:43.539362', '2025-06-14 17:18:43.539362');


--
-- Data for Name: employee_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."roles" ("id", "created_at", "role", "scope") VALUES
	(1, '2025-06-14 17:12:10.101811+00', 'admin', '{general,"cash desk",debtor,users,store}');


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "updated_at", "full_name", "avatar_url", "role_id", "created_at", "language", "shop_id", "pin_code") VALUES
	('ad0b1d54-3b89-45ea-9ead-c96073a7d2b5', '2025-06-14 17:10:08.290538+00', 'Admin Shop 1', NULL, 1, '2025-06-14 17:10:08.290538+00', 'en', '5edadfbf-bd80-4530-b064-1ddc7f042227', '0000'),
	('26e02e59-8748-46d1-840b-7551249d7317', '2025-06-14 17:16:47.614896+00', 'Admin 2', NULL, 1, '2025-06-14 17:16:47.614896+00', 'ru', '3980db0a-9225-4369-85fc-1807967a5dff', '0000');


--
-- Data for Name: file_references; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shop_statistics; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: subscription_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."subscription_payments" ("id", "shop_id", "amount", "date", "started_from", "available_until", "transaction_id", "payment_method", "note", "created_at") VALUES
	('e86a2c9a-2a08-4113-a8f7-c8c5c8abffaa', '5edadfbf-bd80-4530-b064-1ddc7f042227', 100, '2025-06-14 17:18:05.732338', '2025-06-14 19:17:47', '2026-06-14 19:17:54', 'tx2344', 'card', 'yearly', '2025-06-14 17:18:05.732338');


--
-- Data for Name: user_action_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_action_logs" ("id", "timestamp", "user_id", "action", "entity", "entity_id", "details", "employee_id") VALUES
	(1, '2025-06-14 17:10:08.290538+00', NULL, 'INSERT', 'profiles', 'ad0b1d54-3b89-45ea-9ead-c96073a7d2b5', '{"id": "ad0b1d54-3b89-45ea-9ead-c96073a7d2b5", "role_id": null, "shop_id": "5edadfbf-bd80-4530-b064-1ddc7f042227", "language": "en", "pin_code": "0000", "full_name": "Admin Shop 1", "avatar_url": null, "created_at": "2025-06-14T17:10:08.290538+00:00", "updated_at": "2025-06-14T17:10:08.290538+00:00"}', NULL),
	(2, '2025-06-14 17:13:40.63504+00', NULL, 'UPDATE', 'profiles', 'ad0b1d54-3b89-45ea-9ead-c96073a7d2b5', '{"id": "ad0b1d54-3b89-45ea-9ead-c96073a7d2b5", "role_id": 1, "shop_id": "5edadfbf-bd80-4530-b064-1ddc7f042227", "language": "en", "pin_code": "0000", "full_name": "Admin Shop 1", "avatar_url": null, "created_at": "2025-06-14T17:10:08.290538+00:00", "updated_at": "2025-06-14T17:10:08.290538+00:00"}', NULL),
	(3, '2025-06-14 17:16:47.614896+00', NULL, 'INSERT', 'profiles', '26e02e59-8748-46d1-840b-7551249d7317', '{"id": "26e02e59-8748-46d1-840b-7551249d7317", "role_id": 1, "shop_id": "3980db0a-9225-4369-85fc-1807967a5dff", "language": "ru", "pin_code": "0000", "full_name": "Admin 2", "avatar_url": null, "created_at": "2025-06-14T17:16:47.614896+00:00", "updated_at": "2025-06-14T17:16:47.614896+00:00"}', NULL),
	(4, '2025-06-14 17:18:43.539362+00', NULL, 'INSERT', 'employees', 'de72bea6-b9a3-4cfc-9d9f-ff1f51be6ee8', '{"id": "de72bea6-b9a3-4cfc-9d9f-ff1f51be6ee8", "shop_id": "5edadfbf-bd80-4530-b064-1ddc7f042227", "pin_code": "1234", "full_name": "Степан", "created_at": "2025-06-14T17:18:43.539362", "updated_at": "2025-06-14T17:18:43.539362"}', 'de72bea6-b9a3-4cfc-9d9f-ff1f51be6ee8');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('uploads', 'uploads', NULL, '2024-11-24 06:13:46.749196+00', '2024-11-24 06:13:46.749196+00', false, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 480, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."roles_id_seq"', 1, false);


--
-- Name: user_action_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."user_action_logs_id_seq"', 4, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
