import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail'; // cada job precisa de uma chave única
  }

  async handle({ data }) {
    const { host, user } = data;

    await Mail.sendMail({
      to: `${host.name} <${host.email}>`,
      subject: 'New user registered in the meetup',
      template: 'subscription',
      context: {
        user: user.name,
        email: user.email,
        host: host.name,
      },
    });
  }
}

export default new SubscriptionMail();
