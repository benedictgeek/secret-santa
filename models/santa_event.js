"use strict";

module.exports = (sequelize, DataTypes) => {
  const SantaEvent = sequelize.define(
    "SantaEvent",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      groupId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "Group",
          foreignKey: "id",
        },
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {}
  );

  SantaEvent.associate = function (models) {
    SantaEvent.belongsTo(models.Group, {
      as: "group",
    });
  };

  return SantaEvent;
};
