import { Op } from 'sequelize';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      attributes: ['id'],
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(), // greater than (gt), somente datas que ainda não passaram
            },
          },
          required: true,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name', 'email'],
            },
            {
              model: File,
              as: 'banner',
              attributes: ['id', 'url', 'path'],
            },
          ],
        },
      ],
      order: [[Meetup, 'date']],
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetup_id);

    if (meetup.user_id === req.userId) {
      return res.status(400).json({
        error: 'You cannot subscribe in this meetup because you are the host',
      });
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

    await Queue.add(SubscriptionMail.key, {
      user,
      host,
    });

    return res.json({ subscription });
  }

  async delete(req, res) {
    const subscription = await Subscription.findOne({
      where: { id: req.params.id },
    });

    if (subscription.user_id !== req.userId) {
      return res
        .status(400)
        .json({ error: 'Not authorized to delete this subscription.' });
    }

    await subscription.destroy();

    return res.json({ Message: 'Subscription deleted.' });
  }
}

export default new SubscriptionController();
