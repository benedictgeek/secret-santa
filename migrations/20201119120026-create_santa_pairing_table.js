"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable("SantaPairs", {
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
          model: "Groups",
          foreignKey: "id",
        },
      },
      santaId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "SantaEvents",
          foreignKey: "id",
        },
      },
      providerId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "Members",
          foreignKey: "id",
        },
      },
      recipientId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "Members",
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("SantaPairs");
  },
};
