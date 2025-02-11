import { Router } from 'express';
import { jwtCheck, jwtParse, validateInput } from '../middleware';
import { searchSchema } from '../schema/restaurant.schema';
import FavoritesController from '../controllers/favorite.controller';

const router = Router();

router.get('/', jwtCheck, jwtParse, FavoritesController.getAll);

router.get('/user', jwtCheck, jwtParse, FavoritesController.getUserBookmarks);

router.route('/:restaurantId')
  .get(
    [jwtCheck, jwtParse, validateInput(searchSchema)], 
    FavoritesController.checkFavorite
  )
  .post(
    [jwtCheck, jwtParse, validateInput(searchSchema)], 
    FavoritesController.addFavorite
  )
  .delete(
    [jwtCheck, jwtParse, validateInput(searchSchema)], 
    FavoritesController.deleteFavorite
  );

export default router;
