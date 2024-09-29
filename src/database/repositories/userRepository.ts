import { IDataStorage } from '../interfaces/IDataStorage';
import { DbTypes } from '../types/dbTypes';
import { DB_CONSTANTS } from '../constants/dbConstants';

export class UserRepository {
    private dataStorage: IDataStorage;

    constructor(dataStorage: IDataStorage) {
        this.dataStorage = dataStorage;
    }

    async createUser(user: DbTypes.UserCreate): Promise<DbTypes.User> {
        try {
            await this.dataStorage.beginTransaction();
            const createdUser = await this.dataStorage.createUser(user);
            await this.dataStorage.commitTransaction();
            return createdUser;
        } catch (error) {
            await this.dataStorage.rollbackTransaction();
            throw error;
        }
    }

    async getUser(id: string): Promise<DbTypes.User | null> {
        try {
            return await this.dataStorage.getUser(id);
        } catch (error) {
            console.error(`Error fetching user with id ${id}:`, error);
            return null;
        }
    }

    async updateUser(id: string, user: DbTypes.UserUpdate): Promise<DbTypes.User> {
        try {
            await this.dataStorage.beginTransaction();
            const updatedUser = await this.dataStorage.updateUser(id, user);
            await this.dataStorage.commitTransaction();
            return updatedUser;
        } catch (error) {
            await this.dataStorage.rollbackTransaction();
            throw error;
        }
    }

    async deleteUser(id: string): Promise<void> {
        try {
            await this.dataStorage.beginTransaction();
            await this.dataStorage.deleteUser(id);
            await this.dataStorage.commitTransaction();
        } catch (error) {
            await this.dataStorage.rollbackTransaction();
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<DbTypes.User | null> {
        try {
            return await this.dataStorage.getUserByEmail(email);
        } catch (error) {
            console.error(`Error fetching user with email ${email}:`, error);
            return null;
        }
    }

    async getUserWorkbooks(userId: string): Promise<DbTypes.Workbook[]> {
        try {
            return await this.dataStorage.getUserWorkbooks(userId);
        } catch (error) {
            console.error(`Error fetching workbooks for user ${userId}:`, error);
            return [];
        }
    }
}

// Human tasks:
// TODO: Implement proper error handling and rollback transactions in case of failures
// TODO: Add logging for important operations and error scenarios
// TODO: Implement caching mechanisms for frequently accessed user data to improve performance
// TODO: Add methods for user authentication and authorization if not handled elsewhere