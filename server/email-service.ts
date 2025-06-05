import nodemailer from 'nodemailer';

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  // Check for email service configuration
  const emailConfig = getEmailConfig();
  
  if (!emailConfig) {
    console.log('Email service not configured, logging contact message:', data);
    return;
  }

  const transporter = nodemailer.createTransport(emailConfig as any);

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0ea5e9;">Nouveau message de contact - Sehha+</h2>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #334155;">Informations du contact</h3>
        <p><strong>Nom:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Catégorie:</strong> ${data.category}</p>
        <p><strong>Sujet:</strong> ${data.subject}</p>
      </div>
      
      <div style="background-color: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #334155;">Message</h3>
        <p style="line-height: 1.6; color: #475569;">${data.message.replace(/\n/g, '<br>')}</p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background-color: #eff6ff; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px; color: #1e40af;">
          Ce message a été envoyé depuis le formulaire de contact de Sehha+ le ${new Date().toLocaleString('fr-FR')}.
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: emailConfig.from,
    to: 'contact@sehhaplus.com',
    replyTo: data.email,
    subject: `[Sehha+] ${data.subject} - ${data.category}`,
    html: emailHtml,
    text: `
Nouveau message de contact - Sehha+

Nom: ${data.name}
Email: ${data.email}
Catégorie: ${data.category}
Sujet: ${data.subject}

Message:
${data.message}

Envoyé le ${new Date().toLocaleString('fr-FR')}
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

function getEmailConfig() {
  // Gmail App Password configuration (Recommended)
  if (process.env.GMAIL_APP_PASSWORD && process.env.GMAIL_USER) {
    return {
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      },
      from: process.env.GMAIL_USER
    };
  }

  // Gmail OAuth2 configuration
  if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN && process.env.GMAIL_USER) {
    return {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN
      },
      from: process.env.GMAIL_USER
    };
  }

  // SendGrid configuration
  if (process.env.SENDGRID_API_KEY) {
    return {
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      },
      from: 'noreply@sehhaplus.com'
    };
  }

  // Generic SMTP configuration
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      from: process.env.SMTP_FROM || process.env.SMTP_USER
    };
  }

  return null;
}