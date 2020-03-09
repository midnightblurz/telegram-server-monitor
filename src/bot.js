class Bot {

    constructor(instance) {
        this.bot = instance;
    }

    reply(ctx, message) {

        if (this.isAllowed(ctx)) {
            ctx.replyWithMarkdown(message);
        }
    }

    objectReply(ctx, object) {

        if (this.isAllowed(ctx)) {
            ctx.replyWithMarkdown("``` " + JSON.stringify(object, null, 2) + " ```");
        }
    }

    isAllowed(ctx) {
        if (ctx.message.chat.id === undefined) return false;

        return process.env.ALLOWED_IDENTIFIERS.split(',').includes(ctx.message.chat.id.toString());
    }

}

module.exports = Bot;