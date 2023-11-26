import Color from '../models/color.model.js';

const CreateColor = async (req, res, next) => {
  const { name, color } = req.body;
  try {
    const newColor = await Color.create({ name, color });
    res.json(newColor);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

const GetAllColor = async (req, res) => {
  try {
    const newColor = await Color.findAll();
    res.json({ data: newColor });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

export default {
  CreateColor,
  GetAllColor,
};
