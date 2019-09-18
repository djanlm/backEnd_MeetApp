import MeetUp from '../models/Meetup';

class HostController {
  async index(req, res) {
    const meetups = await MeetUp.findAll({ where: { user_id: req.userId } });

    return res.json(meetups);
  }
}

export default new HostController();
