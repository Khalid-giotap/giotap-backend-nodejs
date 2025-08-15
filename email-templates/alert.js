export const alertWelcome = (name) => {
  return `<html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">
            Welcome, ${name}!
          </h1>
        </div>
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e1e1e1; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            We're thrilled to have you on the platform!
          </p>
          <p style="margin-bottom: 30px;">
            Your are signed in successfully. Here's what you can do next:
          </p>
          <ul style="margin-bottom: 30px; padding-left: 20px;">
            <li style="margin-bottom: 10px;">
              Manage routes, admins, schools, transports
            </li>
            <li style="margin-bottom: 10px;">Add Bulk Data</li>
            <li style="margin-bottom: 10px;">Manage Platform settings</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a
              href="http://localhost:3000/dasboard"
              style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;"
            >
              Get Started
            </a>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Need help? Reply to this email or contact our support team.
          </p>
        </div>
      </body>
    </html>`;
};
