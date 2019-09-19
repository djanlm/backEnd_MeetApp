import * as Yup from 'yup'; // it is used for validation
import {
  startOfHour,
  parseISO,
  isBefore,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetUpController {
  async index(req, res) {
    const page = req.query.page || 1; // caso a pagina não seja informada ela será considerada igual a 1
    const searchDate = parseISO(req.query.date); // tranforma a data para o formato certo
    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
      limit: 10,
      offset: 10 * page - 10,
      // o include é usado quando queremos trazer dados de tabelas relacionadas, nesse caso o user id é chave estrangeira da tabela de meetups
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      date: Yup.date().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      file_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { title, description, location, date, file_id } = req.body;

    // startofhour arredonda a hora
    const hourStart = startOfHour(parseISO(date)); // parseISO transforma string em formato de data do JS

    // isBefore compara a data atual com a hourStart
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const meetup = await Meetup.create({
      user_id: req.userId,
      title,
      description,
      location,
      date,
      file_id,
    });
    const user = await User.findOne({ where: { id: req.userId } });
    const { name, email } = user;

    const banner = await File.findOne({ where: { id: meetup.file_id } });
    const { url } = banner;

    return res.json({
      meetup,
      host: {
        name,
        email,
      },
      banner: {
        url,
      },
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      date: Yup.date(),
      description: Yup.string(),
      location: Yup.string(),
      file_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { date } = req.body;

    // startofhour arredonda a hora
    const hourStart = startOfHour(parseISO(date)); // parseISO transforma string em formato de data do JS

    // isBefore compara a data atual com a hourStart
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== user.id) {
      return res.status(400).json({
        error: 'You can not update this meetup, it belongs to another person',
      });
    }

    if (meetup.past) {
      return res.status(400).json({ error: "Can't update past meetups." });
    }

    const { title, description, location, file_id } = await meetup.update(
      req.body
    );
    return res.json({
      title,
      description,
      location,
      file_id,
    });
  }

  async delete(req, res) {
    const meetup = await Meetup.findOne({ where: { id: req.params.id } });

    if (meetup.user_id !== req.userId) {
      return res
        .status(400)
        .json({ error: 'Not authorized to delete this meetup' });
    }

    if (meetup.past) {
      return res.status(400).json({ error: 'Cannot delete past meetups' });
    }

    await meetup.destroy();

    return res.json({ Message: 'Meetup deleted.' });
  }
}

export default new MeetUpController();
