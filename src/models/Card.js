import AuthorModel from './Author';
import WorkModel   from './Work';

export default function CardModel (sequelize, DataTypes) {
  const Author = sequelize.import('author', AuthorModel);
  const Work   = sequelize.import('work', WorkModel);

  return sequelize.define('card', {
    workId : {
      type : DataTypes.UUID,
      references : {
        model : Work,
        key   : 'uuid',
      },
    },
    authorId : {
      type       : DataTypes.UUID,
      references : {
        model : Author,
        key   : 'uuid',
      },
    },
    kanaType       : DataTypes.ENUM('新字新仮名', '新字旧仮名', '旧字新仮名', '旧字旧仮名', 'その他'),
    translaterName : DataTypes.STRING,
  });
}
