/**
 * Email Service
 * Handles sending confirmation emails
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send payment confirmation email to student
 */
export async function sendPaymentConfirmationToStudent(
  studentEmail: string,
  studentName: string,
  professionalName: string,
  bookingDate: string,
  bookingTime: string,
  amount: number
): Promise<boolean> {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0066cc; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">✅ Pagamento Confirmado!</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Olá <strong>${studentName}</strong>,</p>
          
          <p>Seu pagamento foi processado com sucesso! Sua aula foi confirmada.</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066cc;">
            <h3 style="margin-top: 0; color: #0066cc;">Detalhes da Aula</h3>
            <p><strong>Profissional:</strong> ${professionalName}</p>
            <p><strong>Data:</strong> ${bookingDate}</p>
            <p><strong>Horário:</strong> ${bookingTime}</p>
            <p><strong>Valor Pago:</strong> R$ ${amount.toFixed(2)}</p>
          </div>
          
          <p>Um email de confirmação também foi enviado para o profissional.</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Dúvidas? Entre em contato conosco através do LinkeGym.
          </p>
        </div>
        
        <div style="background-color: #f0f0f0; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
          <p>&copy; 2024 LinkeGym. Todos os direitos reservados.</p>
        </div>
      </div>
    `;

    return await sendEmail({
      to: studentEmail,
      subject: '✅ Pagamento Confirmado - LinkeGym',
      html,
    });
  } catch (err) {
    console.error('Error sending payment confirmation to student:', err);
    return false;
  }
}

/**
 * Send payment confirmation email to professional
 */
export async function sendPaymentConfirmationToProfessional(
  professionalEmail: string,
  professionalName: string,
  studentName: string,
  bookingDate: string,
  bookingTime: string,
  amount: number
): Promise<boolean> {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0066cc; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">💰 Nova Aula Confirmada!</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Olá <strong>${professionalName}</strong>,</p>
          
          <p>Uma nova aula foi confirmada e o pagamento foi processado com sucesso!</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066cc;">
            <h3 style="margin-top: 0; color: #0066cc;">Detalhes da Aula</h3>
            <p><strong>Aluno:</strong> ${studentName}</p>
            <p><strong>Data:</strong> ${bookingDate}</p>
            <p><strong>Horário:</strong> ${bookingTime}</p>
            <p><strong>Valor Recebido:</strong> R$ ${(amount * 0.9).toFixed(2)}</p>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
              (Após taxa de plataforma de 10%)
            </p>
          </div>
          
          <p>Acesse seu dashboard para gerenciar todos os seus agendamentos.</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Dúvidas? Entre em contato conosco através do LinkeGym.
          </p>
        </div>
        
        <div style="background-color: #f0f0f0; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
          <p>&copy; 2024 LinkeGym. Todos os direitos reservados.</p>
        </div>
      </div>
    `;

    return await sendEmail({
      to: professionalEmail,
      subject: '💰 Nova Aula Confirmada - LinkeGym',
      html,
    });
  } catch (err) {
    console.error('Error sending payment confirmation to professional:', err);
    return false;
  }
}

/**
 * Generic email sending function
 * In production, integrate with SendGrid, AWS SES, or similar service
 */
async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    // For now, we'll just log the email
    // In production, replace with actual email service
    console.log('Email would be sent:', {
      to: payload.to,
      subject: payload.subject,
    });

    // Mock implementation - always returns true for development
    return true;

    // Production implementation example:
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email: payload.to }] }],
    //     from: { email: 'noreply@linkegym.com' },
    //     subject: payload.subject,
    //     content: [{ type: 'text/html', value: payload.html }],
    //   }),
    // });
    // return response.ok;
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
}
