const FilmModel = require('../models/Film')

module.exports = class FilmDatabase {

  async getFilmById({ filmId }) {
    return FilmModel.findById({ _id: filmId })
      .lean()
      .exec();
  }

  async getFilmByDate({ filmdate }) {
    return FilmModel.findOne({ date: filmdate })
      .lean()
      .exec();
  }

  async createFilm({ film }) {
    return (await FilmModel.create(film)).toObject();
  }

  async updateExample({ filmId, data }) {
    return FilmModel.findByIdAndUpdate(
      { _id: filmId },
      data,
      { new: true },
    )
      .lean()
      .exec();
  }

  async deleteExample({ filmId }) {
    return FilmModel.findByIdAndDelete({ _id: filmId })
      .lean()
      .exec();
  }
};
