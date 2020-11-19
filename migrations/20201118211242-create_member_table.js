"use strict";

module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable("Members", {
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
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
    return queryInterface.dropTable("Members");
  },
};
