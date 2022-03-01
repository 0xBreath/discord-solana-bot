import {DataTypes} from 'sequelize'

export const User = (sequelize: any) => {
    const User = sequelize.define('user', {
            wallet: {
                type: DataTypes.STRING,
            },
            discord: {
                type: DataTypes.STRING,
            },
            signed: {
                type: DataTypes.BOOLEAN,
            }
        }
    )
    return User
}