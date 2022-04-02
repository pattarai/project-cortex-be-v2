import { Webhook } from "discord-webhook-node"

const sendToDiscord = async () => {
    let WEBHOOK_URL = process.env.WEBHOOK_URL;
    let PATH = process.env.BACKUP_PATH;
    const hook = new Webhook(WEBHOOK_URL);
    hook.setUsername("Database Dump");
    hook.setAvatar(
        "https://cortex-be.pattarai.in/images/29.jpg"
    );
    await hook.sendFile(PATH);
};

sendToDiscord();