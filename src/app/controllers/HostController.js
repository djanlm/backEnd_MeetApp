import MeetUp from '../models/Meetup';
import File from '../models/File';

class HostController {
  async index(req, res) {
    const meetups = await MeetUp.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });

    return res.json(meetups);
  }
}

export default new HostController();
