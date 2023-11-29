import Cart from '../models/cart.model.js';
import { Op } from 'sequelize';
import Shoe from '../models/shoe.model.js';
import Image from '../models/image.model.js';
import apiRespon from '../utils/apiRespon.js';
import sequelize from '../config/db.config.js';

const AddItemToCart = async (req, res, next) => {
  const { userId } = req.user;
  const { shoeId, cart_color, cart_size, price } = req.body;

  try {
    const exitedCartItem = await Cart.findOne({
      where: {
        [Op.and]: [{ shoe_id: shoeId }, { shoe_color: cart_color }, { shoe_size: cart_size }, { user_id: userId }],
      },
    });

    if (exitedCartItem) {
      await Cart.update({ quantity: exitedCartItem.quantity + 1 }, { where: { id: exitedCartItem.id } });
    } else {
      await Cart.create({
        shoe_id: shoeId,
        user_id: userId,
        shoe_color: cart_color,
        shoe_size: cart_size,
        quantity: 1,
        price,
      });
    }

    return res.json(apiRespon.StatusNoContent('Succes Add to Cart'));
  } catch (error) {
    console.log(error);
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

const GetItemsInCart = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      attributes: { exclude: ['createdAt', 'updatedAt', 'user_id'] },
      include: [
        {
          model: Shoe,
          attributes: [
            'name',
            'category',
            'type',
            [
              sequelize.literal(`(
            SELECT url FROM images as image  WHERE image.shoe_id = shoe.id AND image.type = 'THUMBNAIL'
        )`),
              'thumbImg',
            ],
          ],
        },
      ],
    });

    res.json(apiRespon.StatusGetData('Sucess Get Items In Cart', cartItems));
  } catch (error) {
    console.log(error);
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

const UpdateItemCart = (req, res, next) => {};

const DeleteItemCart = async (req, res, next) => {
  const { cartId } = req.params;

  try {
    await Cart.destroy({ where: { id: cartId } });

    res.json({
      code: 204,
      status: 'No Content',
      message: 'Sucess Delete Items In Cart',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(apiRespon.StatusIntervalServerError(error));
  }
};

export default {
  AddItemToCart,
  GetItemsInCart,
  UpdateItemCart,
  DeleteItemCart,
};
