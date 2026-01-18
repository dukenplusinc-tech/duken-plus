# Supabase Email Templates

This directory contains customized email templates for Supabase authentication emails.

## Templates

All templates support three locales: English (en), Russian (ru), and Kazakh (kz), with Russian as the default.

### Available Templates

1. **confirmation.html** - Email confirmation for new user signups
2. **magic_link.html** - Magic link for passwordless sign-in
3. **password_reset.html** - Password reset emails
4. **email_change.html** - Email change confirmation
5. **invite.html** - User invitation emails
6. **reauthentication.html** - Reauthentication requests

## Locale Detection

Templates automatically detect the user's language preference from the `language` field in user metadata (`.Data.language`). If no language is specified, templates default to Russian (ru).

The language should be set in user metadata when:
- Registering a new user (via `register` action)
- Resetting password (via `recoverPassword` action)
- Other auth operations

## Configuration

Templates are configured in `supabase/config.toml`:

```toml
[auth.email.template.confirmation]
subject = "..."
content_path = "./supabase/templates/confirmation.html"
```

## Design

All templates use:
- **Primary Color**: #02404f (teal/dark blue)
- **Background**: White (#ffffff)
- **Text Color**: #333333 (dark gray)
- **Clean, modern design** with responsive layout

## Testing

For local development, emails are captured by Inbucket (Supabase's email testing server) and can be viewed at `http://localhost:54324`.

## Production

For production, upload these templates via the Supabase Dashboard:
1. Go to Authentication → Email Templates
2. Select the template type
3. Upload or paste the HTML content
4. Update the subject line

Note: In production, you may need to manually configure locale detection or use separate templates per locale if Supabase doesn't support Go template conditionals in the dashboard.
