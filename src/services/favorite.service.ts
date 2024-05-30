import Favorite, { FavoriteModelType } from '../models/favorites';

async function findFavorite({ user, restaurant }: FavoriteModelType) {
  const favorited = await Favorite.findOne({ user, restaurant });
  return favorited;
}

async function createFave(data: FavoriteModelType) {
  const favorite = await Favorite.create(data);
  return favorite;
}

async function removeFave({ user, restaurant }: FavoriteModelType) {
  const bookmark = await Favorite.findOne({ user, restaurant });
  if (!bookmark) return false;
  bookmark.deleteOne();
  return true;
}

export default { findFavorite, createFave, removeFave }
