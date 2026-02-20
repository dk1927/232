export async function sendSlackNotification(slackUrl: string, message: {
    name: string;
    email: string;
    text: string;
}) {
    if (!slackUrl) return;

    try {
        await fetch(slackUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: `📬 새 문의가 도착했습니다!`,
                blocks: [
                    {
                        type: "header",
                        text: { type: "plain_text", text: "📬 새 문의 알림" },
                    },
                    {
                        type: "section",
                        fields: [
                            { type: "mrkdwn", text: `*이름:*\n${message.name}` },
                            { type: "mrkdwn", text: `*이메일:*\n${message.email}` },
                        ],
                    },
                    {
                        type: "section",
                        text: { type: "mrkdwn", text: `*메시지:*\n${message.text}` },
                    },
                    {
                        type: "context",
                        elements: [
                            { type: "mrkdwn", text: `${new Date().toLocaleString("ko-KR")} | Portfolio Admin` },
                        ],
                    },
                ],
            }),
        });
    } catch (err) {
        console.error("Slack notification failed:", err);
    }
}

export async function sendEmailNotification(config: {
    host: string;
    port: number;
    user: string;
    pass: string;
    to: string;
}, message: {
    name: string;
    email: string;
    text: string;
}) {
    // Note: For production, use nodemailer or a transactional email service.
    // This is a simplified placeholder that logs the intent.
    console.log(`📧 Email notification to ${config.to}: New message from ${message.name} (${message.email})`);
}

export async function notifyNewContact(contactData: {
    name: string;
    email: string;
    message: string;
}) {
    try {
        const { prisma } = await import("@/lib/db");
        const webhook = await prisma.webhookConfig.findUnique({ where: { id: "webhooks" } });

        if (!webhook || !webhook.enabled) return;

        const msg = {
            name: contactData.name,
            email: contactData.email,
            text: contactData.message,
        };

        if (webhook.slackUrl) {
            await sendSlackNotification(webhook.slackUrl, msg);
        }

        if (webhook.emailTo && webhook.emailHost) {
            await sendEmailNotification({
                host: webhook.emailHost,
                port: webhook.emailPort,
                user: webhook.emailUser,
                pass: webhook.emailPass,
                to: webhook.emailTo,
            }, msg);
        }
    } catch (err) {
        console.error("Webhook notification failed:", err);
    }
}
