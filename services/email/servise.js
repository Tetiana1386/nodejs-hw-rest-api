const Mailgen = require('mailgen');

class EmailService {
    constructor(env, sender) {
        this.sender = sender
        switch (env) {
            case 'development':
                this.link = process.env.LINK_DEV;
                    break;
            case 'stage':
                this.link = process.env.LINK_STAGE;
                break;
            case 'production':
                this.link = process.env.LINK_PROD;
                break;
            default:
                this.link = process.env.LINK_DEV;
                break;
        }
    }

    createTemplateEmail(name, verifyToken) {
        const mailGenerator = new Mailgen({
            theme: 'cerberus',
            product: {
                name: 'System of contacts',
                link: this.link
            }
        })

        const email = {
            body: {
                name,
                intro:
                    "Welcome to System of contacts! We're very excited to have you on board.",
                action: {
                    instructions:
                        'To get started with System of contacts, please click here:',
                    button: {
                        color: '#22BC66', 
                        text: 'Confirm your account',
                        link: `${this.link}/api/users/verify/${verifyToken}`,
                    },
                },
            },
        }
        return mailGenerator.generate(email)
    }

    async sendVerifyEmail(email, name, verifyToken) {
        const emailHTML = this.createTemplateEmail(name, verifyToken)
        const msg = {
            to: email,
            subject: 'Verify your email',
            html: emailHTML,
        }
        try {
            const result = await this.sender.send(msg)
            console.log(result)
            return true
        } catch (error) {
            console.log(error.message)
            return false
        }
    }
};

module.exports = EmailService;