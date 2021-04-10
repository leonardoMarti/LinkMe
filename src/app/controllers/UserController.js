import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExist = await User.findOne({ where: { email: req.body.email } });
    if (userExist)
      return res.status(400).json({ error: 'User already exists!' });

    const { id, name, email, type } = await User.create(req.body);

    return res.json({ id, name, email, type });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExist = await User.findOne({ where: { email } });
      if (userExist) {
        return res
          .status(400)
          .json({ error: 'This email has already been registered' });
      }
    }

    const nonMatchPassword = !(await user.checkPassword(oldPassword));

    if (oldPassword && nonMatchPassword) {
      return res.status(401).json({ error: 'Old password does not match' });
    }

    const { id, name, type } = await user.update(req.body);

    return res.json({ id, name, email, type });
  }
}

export default new UserController();
