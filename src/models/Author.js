export default function AuthorModel (sequelize, DataTypes) {
  return sequelize.define('author', {
    uuid : { type : DataTypes.UUID, primaryKey : true },
    name : DataTypes.STRING,
  });
}
