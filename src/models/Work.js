export default function WorkModel (sequelize, DataTypes) {
  return sequelize.define('Work', {
    uuid  : { type : DataTypes.UUID, primaryKey : true },
    title : DataTypes.STRING,
  });
}
