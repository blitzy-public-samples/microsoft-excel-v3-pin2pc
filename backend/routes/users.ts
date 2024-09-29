import express from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authentication';
import { authorizationMiddleware } from '../middleware/authorization';
import { rateLimiterMiddleware } from '../middleware/rateLimiter';

export function configureUserRoutes(userController: UserController): express.Router {
    const router = express.Router();

    // POST /users - Create a new user
    router.post('/', rateLimiterMiddleware, userController.createUser);

    // GET /users/:id - Get a user by ID
    router.get('/:id', authMiddleware, authorizationMiddleware, userController.getUser);

    // PUT /users/:id - Update a user
    router.put('/:id', authMiddleware, authorizationMiddleware, userController.updateUser);

    // DELETE /users/:id - Delete a user
    router.delete('/:id', authMiddleware, authorizationMiddleware, userController.deleteUser);

    // POST /users/login - User login
    router.post('/login', rateLimiterMiddleware, userController.login);

    // POST /users/logout - User logout
    router.post('/logout', authMiddleware, userController.logout);

    // PUT /users/:id/preferences - Update user preferences
    router.put('/:id/preferences', authMiddleware, authorizationMiddleware, userController.updateUserPreferences);

    return router;
}

// TODO: Implement proper error handling for route configuration
// TODO: Add input validation middleware for all routes
// TODO: Implement CORS configuration for the user routes
// TODO: Add unit and integration tests for the user routes
// TODO: Review and implement necessary security headers for all routes
// TODO: Implement API versioning strategy (Optional)