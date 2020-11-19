"use strict";

module.exports = (sequelize, DataTypes) => {
  const SantaPair = sequelize.define(
    "SantaPair",
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
      santaId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "SantaEvent",
          foreignKey: "id",
        },
      },
      providerId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "Member",
          foreignKey: "id",
        },
      },
      recipientId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "Member",
          foreignKey: "id",
        },
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

  SantaPair.associate = function (models) {
    SantaPair.belongsTo(models.Group, {
      as: "group",
    });
    SantaPair.belongsTo(models.SantaEvent, {
      as: "santaEvent",
    });
    SantaPair.hasOne(models.Member, {
      foreignKey: "providerId",
      as: "provider",
    });
    SantaPair.hasOne(models.Member, {
      foreignKey: "recipientId",
      as: "recipient",
    });
  };

  return SantaPair;
};
