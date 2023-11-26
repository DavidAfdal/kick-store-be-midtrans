import { Op } from 'sequelize';
import Shoe from '../models/shoe.model.js';
import Size from '../models/size.model.js';
import Color from '../models/color.model.js';
import cloudinary from '../config/cloudinary.config.js';
import Image from '../models/image.model.js';
import apiRespon from '../utils/apiRespon.js';
import sequelize from '../config/db.config.js';

const PaginationShoes = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, category, name, type, minPrice, maxPrice } = req.query;

    // Membuat objek untuk menyimpan kriteria filter
    const filterCriteria = {};

    // Menambahkan kriteria filter berdasarkan parameter yang diberikan
    if (category) {
      filterCriteria.category = category;
    }

    if (name) {
      filterCriteria.name = { [Op.iLike]: `%${name}%` };
    }

    if (type) {
      filterCriteria.type = type;
    }

    if (minPrice && maxPrice) {
      filterCriteria.price = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice) {
      filterCriteria.price = { [Op.gte]: minPrice };
    } else if (maxPrice) {
      filterCriteria.price = { [Op.lte]: maxPrice };
    }

    // Mendapatkan data sepatu dengan paginasi dan filter
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize, 10);

    const result = await Shoe.findAndCountAll({
      where: filterCriteria,
      offset,
      limit,
    });

    res.json({
      totalItems: result.count,
      totalPages: Math.ceil(result.count / pageSize),
      currentPage: page,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

const CreateShoe = async (req, res, next) => {
  const { name, desc, price, discount, category, type, sizes, colors } = req.body;
  try {
    await sequelize.transaction(async () => {
      const newShoe = await Shoe.create({ name, description: desc, category, type, price, diskon: discount });

      for (const data of sizes) {
        const { size, stock } = data;

        await Size.create({
          size,
          stock,
          ShoeId: newShoe.id,
        });
      }

      const colorArray = await Color.findAll({ where: { id: colors } });

      await newShoe.addColor(colorArray);
    });

    res.json(apiRespon.StatusCreated('Succes Created Shoe'));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Internal Server Error', error: error });
  }
};

const UpdateShoe = async (req, res, next) => {};

const DeleteShoe = async (req, res, next) => {};

const GetShoesById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const shoe = await Shoe.findByPk(id, {
      include: [
        {
          model: Color,
          attributes: ['id', 'name', 'color'],
          through: { attributes: [] }, // Exclude the join table attributes
        },
        {
          model: Size,
          attributes: ['id', 'size', 'stock'],
        },
        {
          model: Image,
          attributes: ['url', 'type'],
        },
      ],
    });

    if (!shoe) {
      return res.status(404).json({ error: 'Shoe not found' });
    }

    res.json(apiRespon.StatusGetData('succes get details shoe', shoe));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Internal Server Error', error: error });
  }
};

const AddImage = async (req, res, next) => {
  const { id } = req.params;
  const thumbnail = req.files['thumbnail'][0];
  const images = req.files['images'];

  try {
    const resultThumbnail = await cloudinary.uploader.upload(thumbnail.path);
    await Image.create({
      id: resultThumbnail.public_id,
      url: resultThumbnail.url,
      type: 'THUMBNAIL',
      ShoeId: id,
    });

    images.forEach(async (image) => {
      const resultImage = await cloudinary.uploader.upload(image.path);
      await Image.create({
        id: resultImage.public_id,
        url: resultImage.url,
        ShoeId: id,
      });
    });

    res.json({
      status: 'ok',
      message: 'succes add image',
    });
  } catch (error) {
    console.log(process.env.CLOUD_API_KEY);
    console.log(error);
    return res.status(500).json({
      message: 'Intenet Server Error',
      error: error,
    });
  }
};

export default {
  PaginationShoes,
  CreateShoe,
  UpdateShoe,
  DeleteShoe,
  GetShoesById,
  AddImage,
};
