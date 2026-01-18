import { loadEnvConfig } from '@next/env';
import { readFileSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

// Get environment variables
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const SUPABASE_PROJECT_REF = 
  process.env.SUPABASE_PROJECT_REF || 
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF ||
  'fsqtsbvalhwspeeomtgj'; // Fallback to project_id from config.toml

if (!SUPABASE_ACCESS_TOKEN) {
  console.error('❌ Error: SUPABASE_ACCESS_TOKEN environment variable is required');
  console.error('   Get your access token from: https://supabase.com/dashboard/account/tokens');
  console.error('   Make sure it has "auth:write" scope');
  process.exit(1);
}

// Template mapping: file name -> Supabase API fields
const TEMPLATE_MAPPING = {
  'confirmation.html': {
    content: 'mailer_templates_confirmation_content',
    subject: 'mailer_subjects_confirmation',
    defaultSubject: {
      en: 'Confirm your email address',
      ru: 'Подтвердите ваш email адрес',
      kz: 'Email мекенжайыңызды растаңыз',
    },
  },
  'password_reset.html': {
    content: 'mailer_templates_recovery_content',
    subject: 'mailer_subjects_recovery',
    defaultSubject: {
      en: 'Reset your password',
      ru: 'Сброс пароля',
      kz: 'Құпия сөзді қалпына келтіру',
    },
  },
  'magic_link.html': {
    content: 'mailer_templates_magic_link_content',
    subject: 'mailer_subjects_magic_link',
    defaultSubject: {
      en: 'Your sign-in link',
      ru: 'Ваша ссылка для входа',
      kz: 'Кіру сілтемеңіз',
    },
  },
  'email_change.html': {
    content: 'mailer_templates_email_change_content',
    subject: 'mailer_subjects_email_change',
    defaultSubject: {
      en: 'Confirm your new email address',
      ru: 'Подтвердите ваш новый email адрес',
      kz: 'Жаңа email мекенжайыңызды растаңыз',
    },
  },
  'invite.html': {
    content: 'mailer_templates_invite_content',
    subject: 'mailer_subjects_invite',
    defaultSubject: {
      en: "You've been invited",
      ru: 'Вас пригласили',
      kz: 'Сіз шақырылдыңыз',
    },
  },
  'reauthentication.html': {
    content: 'mailer_templates_reauthentication_content',
    subject: 'mailer_subjects_reauthentication',
    defaultSubject: {
      en: 'Confirm your identity',
      ru: 'Подтвердите вашу личность',
      kz: 'Жеке басыңызды растаңыз',
    },
  },
} as const;

// Default locale for subject (can be overridden via EMAIL_TEMPLATE_LOCALE env var)
const DEFAULT_LOCALE = (process.env.EMAIL_TEMPLATE_LOCALE || 'ru') as 'en' | 'ru' | 'kz';

async function updateEmailTemplates() {
  console.log('🚀 Starting email template update...\n');
  console.log(`📦 Project: ${SUPABASE_PROJECT_REF}`);
  console.log(`🌐 Default locale: ${DEFAULT_LOCALE}\n`);

  const templatesDir = join(projectDir, 'supabase', 'templates');
  const payload: Record<string, string> = {};

  // Read and prepare each template
  for (const [filename, mapping] of Object.entries(TEMPLATE_MAPPING)) {
    const filePath = join(templatesDir, filename);
    
    try {
      const content = readFileSync(filePath, 'utf-8');
      const subject = mapping.defaultSubject[DEFAULT_LOCALE];

      payload[mapping.content] = content;
      payload[mapping.subject] = subject;

      console.log(`✅ Prepared: ${filename}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Content length: ${content.length} characters\n`);
    } catch (error) {
      console.error(`❌ Error reading ${filename}:`, error);
      process.exit(1);
    }
  }

  // Update via Management API
  const apiUrl = `https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/config/auth`;
  
  console.log('📡 Sending update request to Supabase Management API...\n');

  try {
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, response.statusText);
      console.error('Response:', errorText);
      process.exit(1);
    }

    const result = await response.json();
    console.log('✅ Successfully updated email templates!\n');
    console.log('📧 Updated templates:');
    Object.keys(TEMPLATE_MAPPING).forEach((filename) => {
      console.log(`   - ${filename}`);
    });
    console.log('\n✨ All done! Test by sending a test email (signup, password reset, etc.)');
  } catch (error) {
    console.error('❌ Network error:', error);
    process.exit(1);
  }
}

// Run the script
updateEmailTemplates().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
