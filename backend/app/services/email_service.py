import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        # Read from pydantic settings so .env values are correctly loaded
        self.smtp_host = settings.SMTP_HOST or ""
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER or ""
        self.smtp_password = settings.SMTP_PASSWORD or ""
        
    def generate_otp_email_html(self, otp: str, user_email: str) -> str:
        """
        Generates a premium, beautiful HTML email template matching the Antigravity UI
        """
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your login</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090B; color: #ffffff;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #09090B; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table width="100%" max-width="500" cellpadding="0" cellspacing="0" style="background-color: #111216; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 40px 32px; margin: 0 auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
                            
                            <!-- Logo Area -->
                            <tr>
                                <td align="center" style="padding-bottom: 24px;">
                                    <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #7C3AED, #A78BFA); text-align: center; line-height: 48px; font-weight: bold; font-size: 18px; color: #ffffff; letter-spacing: 1px;">
                                        ERP
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Title -->
                            <tr>
                                <td align="center" style="padding-bottom: 8px;">
                                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em;">
                                        Reset your password
                                    </h1>
                                </td>
                            </tr>
                            
                            <!-- Subtitle -->
                            <tr>
                                <td align="center" style="padding-bottom: 32px;">
                                    <p style="margin: 0; font-size: 14px; color: #888888; line-height: 1.5;">
                                        Use the verification code below to securely reset your password for <span style="color: #A78BFA;">{user_email}</span>.
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- OTP Box -->
                            <tr>
                                <td align="center" style="padding-bottom: 32px;">
                                    <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 24px; letter-spacing: 8px; font-size: 32px; font-weight: 600; color: #ffffff;">
                                        {otp}
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Warning -->
                            <tr>
                                <td align="center" style="padding-bottom: 32px;">
                                    <p style="margin: 0; font-size: 12px; color: #666666; line-height: 1.5;">
                                        This code will expire in 2 minutes.<br>
                                        If you didn't request this, you can safely ignore this email.
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Divider -->
                            <tr>
                                <td style="border-top: 1px solid rgba(255,255,255,0.05); padding-bottom: 24px;"></td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td align="center">
                                    <p style="margin: 0; font-size: 11px; color: #444444;">
                                        &copy; 2026 StudentERP. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """

    def send_otp_email(self, to_email: str, otp: str):
        html_content = self.generate_otp_email_html(otp, to_email)
        
        # If SMTP is not configured, print to terminal for development
        if not self.smtp_host or not self.smtp_user:
            logger.warning(f"SMTP not configured. Simulating email send to {to_email} with OTP: {otp}")
            # print("----- HTML EMAIL PREVIEW -----")
            # print(html_content)
            # print("------------------------------")
            return
            
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = "StudentERP - Verification Code"
            msg["From"] = f"StudentERP <{self.smtp_user}>"
            msg["To"] = to_email

            part = MIMEText(html_content, "html")
            msg.attach(part)

            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            server.starttls()
            server.login(self.smtp_user, self.smtp_password)
            server.sendmail(self.smtp_user, to_email, msg.as_string())
            server.quit()
            logger.info(f"Successfully sent OTP email to {to_email}")
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            # Even if it fails, we shouldn't necessarily crash the app, just log it.
            
email_service = EmailService()
