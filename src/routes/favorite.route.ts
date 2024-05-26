import { Router } from 'express';
import { favoriteSchema } from '../schema/favorite.schema';
import { jwtCheck, jwtParse, validateInput } from '../middleware';
import FavoriteController from '../controllers/favorite.controller';

const router = Router();

router.route('/:restuarantId')
  .get(
    [jwtCheck, jwtParse, validateInput(favoriteSchema)], 
    FavoriteController.checkFavorite
  )
  .post(
    [jwtCheck, jwtParse, validateInput(favoriteSchema)], 
    FavoriteController.addFavorite
  )
  .delete(
    [jwtCheck, jwtParse, validateInput(favoriteSchema)], 
    FavoriteController.deleteFavorite
  );

export default router;

