import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';

import Mail from '../../lib/Mail';
import User from '../models/User';

class SubscriptionController {
  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetup_id);

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: 'You cannot subscribe in this meetup' });
    }

    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'You cannot subscribe in past meetups' });
    }

    const user = await User.findByPk(req.userId);
    const host = await User.findByPk(meetup.user_id);

    // check if the user already registered in a meetup with the same date and time
    const checkDate = await Subscription.findOne({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDate) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to two meetups at the same time" });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });

    await Mail.sendMail({
      to: `${host.name} <${host.email}>`,
      subject: 'New user registered in the meetup',
      text: `Name: ${user.name},
      Email: ${user.email}`,
    });

    return res.json({ subscription });
  }
}

export default new SubscriptionController();
