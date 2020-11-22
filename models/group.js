"use strict";

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    "Group",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "User",
          foreignKey: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("active", "deleted"),
        allowNull: false,
        defaultValue: "active",
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

  Group.associate = function (models) {
    Group.belongsTo(models.User, {
      as: "user",
    });
    Group.hasMany(models.Member, {
      foreignKey: "groupId",
      as: "members",
    });
    Group.hasMany(models.SantaEvent, {
      foreignKey: "groupId",
      as: "santaEvents",
    });
  };

  return Group;
};
