import Color from '../models/color.model.js';
import apiRespon from '../utils/apiRespon.js';

const CreateColor = async (req, res, next) => {
  const { name, color } = req.body;
  try {
    const newColor = await Color.create({ name, color });
    res.json(newColor);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json(apiRespon.StatusIntervalServerError(error, `Can't create color because error in server`));
  }
};

const GetAllColor = async (req, res) => {
  try {
    const newColor = await Color.findAll();
    res.json({ data: newColor });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

export default {
  CreateColor,
  GetAllColor,
};
