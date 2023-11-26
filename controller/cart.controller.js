import Cart from '../models/cart.model.js';
import { Op } from 'sequelize';
import Shoe from '../models/shoe.model.js';
import Image from '../models/image.model.js';
import apiRespon from '../utils/apiRespon.js';

const AddItemToCart = async (req, res, next) => {
  const { userId } = req.user;
  const { shoeId, cart_color, cart_size, price } = req.body;

  try {
    const exitedCartItem = await Cart.findOne({
      where: {
        [Op.and]: [{ ShoeId: shoeId }, { shoe_color: cart_color }, { shoe_size: cart_size }, { UserId: userId }],
      },
    });

    if (exitedCartItem) {
      await Cart.update({ quantity: exitedCartItem.quantity + 1 }, { where: { id: exitedCartItem.id } });
    } else {
      await Cart.create({
        ShoeId: shoeId,
        UserId: userId,
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
      where: { UserId: userId },
      attributes: { exclude: ['createdAt', 'updatedAt', 'UserId'] },
      include: [
        {
          model: Shoe,
          attributes: ['name', 'category', 'type'],
          include: {
            model: Image,
            attributes: ['url'],
            where: {
              type: 'THUMBNAIL',
            },
          },
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
