import Favorite, { FavoriteModelType } from '../models/favorites';

async function getUserFavorites(user: string) {
  const favorites = await Favorite.find({ user });
  return favorites;
}

async function findFavorite({ user, restaurant }: FavoriteModelType) {
  const favorite = await Favorite.findOne({ user, restaurant });
  return favorite;
}

async function createFave(data: FavoriteModelType) {
  const favorite = await Favorite.create(data);
  return favorite;
}

async function removeFave({ user, restaurant }: FavoriteModelType) {
  const bookmark = await Favorite.findOne({ user, restaurant });
  if (!bookmark) return false;
  await bookmark.deleteOne();
  return true;
}

export default { findFavorite, createFave, removeFave, getUserFavorites }
