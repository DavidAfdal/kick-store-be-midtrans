import { Op, Sequelize } from 'sequelize';
import Shoe from '../models/shoe.model.js';
import Size from '../models/size.model.js';
import Color from '../models/color.model.js';
import cloudinary from '../config/cloudinary.config.js';
import Image from '../models/image.model.js';
import apiRespon from '../utils/apiRespon.js';
import sequelize from '../config/db.config.js';

const PaginationShoes = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 9, category="", name="", type="",  } = req.query;
     
    const minPrice = parseInt(req.query.min) ?  parseInt(req.query.min) : 0
    const maxPrice = parseInt(req.query.max) ?  parseInt(req.query.max) : 0
    console.log(maxPrice)
    // Membuat objek untuk menyimpan kriteria filter
    const filterCriteria = {};

    // Menambahkan kriteria filter berdasarkan parameter yang diberikan
    if (category !== "") {
      filterCriteria.category = category.split(',').map((data) => data.toUpperCase());
    }

    if (name !== "") {
      filterCriteria.name = { [Op.iLike]: `%${name}%` };
    }

    if (type !== "") {
      filterCriteria.type = type.split(",").map((data) => data.toUpperCase());
    }

    if (minPrice >= 0 && maxPrice !== 0) {
      filterCriteria.price = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice >= 0 ) {
      filterCriteria.price = { [Op.gte]: minPrice };
    } 

    // Mendapatkan data sepatu dengan paginasi dan filter
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize, 10);
    const orderBy = req.query.sort || 'name';
    const  order = req.query.order || "ASC";

    const result = await Shoe.findAndCountAll({
      where: filterCriteria,
      attributes: {
        include: [
          [
            sequelize.literal(`(
                    SELECT url FROM images as image  WHERE image.shoe_id = shoe.id AND image.type = 'THUMBNAIL'
                )`),
            'thumbImg',
          ],
        ],
        exclude: ['description', 'category', 'type', 'updatedAt'],
      },
      offset,
      limit,
      order: [[orderBy, order.toUpperCase()]],
    });

    res.json({
      totalItems: result.count,
      totalPages: Math.ceil(result.count / pageSize),
      currentPage: page,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(apiRespon.StatusIntervalServerError(error));
  }
};

const CreateShoe = async (req, res, next) => {
  const { name, desc, price, discount, category, type, sizes, colors } = req.body;
  try {
    await sequelize.transaction(async () => {
      const newShoe = await Shoe.create({ name: name.toUpperCase(), description: desc, category: category.toUpperCase(), type: type.toUpperCase(), price, diskon: discount });

      for (const data of sizes) {
        const { size, stock } = data;

        await Size.create({
          size,
          stock,
          shoe_id: newShoe.id,
        });
      }

      const colorArray = await Color.findAll({ where: { id: colors } });

      await newShoe.addColor(colorArray);
    });

    res.json(apiRespon.StatusCreated('Succes Created Shoe'));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json(apiRespon.StatusIntervalServerError('Something wrong in server', error));
  }
};

const UpdateShoe = async (req, res, next) => {};

const DeleteShoe = async (req, res, next) => {};

const GetShoesById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const shoe = await Shoe.findByPk(id, {
      attributes: {
        exclude: ['updatedAt'],
      },
      include: [
        {
          model: Color,
          attributes: ['id', 'name', 'color'],
          through: { attributes: [] }, // Exclude the join table attributes
        },
        {
          model: Size,
          as: 'sizes',
          attributes: ['id', 'size', 'stock'],
        },
        {
          model: Image,
          as: 'images',
          attributes: ['url'],
        },
      ],
    });

    if (!shoe) {
      return res.status(404).json({ error: 'Shoe not found' });
    }
    console.log(shoe);
    // const response = { ...shoe, images: shoe.images.map((img) => img.url) };

    res.json(apiRespon.StatusGetData('succes get details shoe', shoe));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
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
      shoe_id: id,
    });

    images.forEach(async (image) => {
      const resultImage = await cloudinary.uploader.upload(image.path);
      await Image.create({
        id: resultImage.public_id,
        url: resultImage.url,
        shoe_id: id,
      });
    });

    res.json({
      status: 'ok',
      message: 'succes add image',
    });
  } catch (error) {
    console.log(process.env.CLOUD_API_KEY);
    console.log(error);
    return res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

const RecomandShoes = async (req, res, next) => {
  const limit = req.query.limit || 9;
  const orderBy = req.query.order || 'createdAt';
  const shoeId = req.query.id || 0;
  try {
    const recomandedShoe = await Shoe.findAll({
      where: {id: {
        [Sequelize.Op.not]: shoeId
      }},
      attributes: {
        include: [
          [
            sequelize.literal(`(
                    SELECT url FROM images as image  WHERE image.shoe_id = shoe.id AND image.type = 'THUMBNAIL'
                )`),
            'thumbImg',
          ],
        ],
      },
      limit: limit,
      order: [[orderBy, 'DESC']],
    });

    res.json(apiRespon.StatusGetData('Succes Get data recomanded', recomandedShoe));
  } catch (error) {
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

export default {
  PaginationShoes,
  CreateShoe,
  UpdateShoe,
  DeleteShoe,
  GetShoesById,
  AddImage,
  RecomandShoes,
};
