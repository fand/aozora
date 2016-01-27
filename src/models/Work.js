export default function WorkModel (sequelize, DataTypes) {
  return sequelize.define('work', {
    uuid  : { type : DataTypes.UUID, primaryKey : true },
    title : DataTypes.STRING,
  });
}
