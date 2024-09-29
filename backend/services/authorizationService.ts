import { User, UserRole } from '../../shared/types/user';
import { AuthorizationPolicy, AuthorizationScope, PermissionLevel } from '../../shared/security/authorizationTypes';
import { getConfig } from '../config/environment';
import { IDataStorage } from '../../shared/interfaces/IDataStorage';
import jwt from 'jsonwebtoken';

// Default expiration time for JWT tokens in seconds
const DEFAULT_TOKEN_EXPIRATION = 3600;

export class AuthorizationService {
  private dataStorage: IDataStorage;

  constructor(dataStorage: IDataStorage) {
    this.dataStorage = dataStorage;
  }

  /**
   * Checks if a user is authorized for a specific action on a resource
   * @param userId - The ID of the user
   * @param action - The action to be performed
   * @param resourceId - The ID of the resource
   * @param scope - The scope of the authorization check
   * @returns A promise that resolves to true if the user is authorized, false otherwise
   */
  async checkAuthorization(
    userId: string,
    action: string,
    resourceId: string,
    scope: AuthorizationScope
  ): Promise<boolean> {
    // Retrieve the user from the data storage
    const user = await this.dataStorage.getUser(userId);
    if (!user) {
      return false;
    }

    // Get the resource (workbook, worksheet, or range) based on the scope and resourceId
    const resource = await this.getResourceByScope(scope, resourceId);
    if (!resource) {
      return false;
    }

    // Check the user's role for the resource
    const userRole = this.getUserRoleForResource(user, resource);

    // Determine if the user's role has the required permission for the action
    const requiredPermission = this.getRequiredPermissionForAction(action);
    const isAuthorized = this.checkPermission(userRole, requiredPermission);

    return isAuthorized;
  }

  /**
   * Generates a JWT token for authenticated users
   * @param user - The user object
   * @returns A promise that resolves to the generated JWT token
   */
  async generateAuthToken(user: User): Promise<string> {
    // Get the JWT secret from the configuration
    const jwtSecret = getConfig().jwtSecret;

    // Create a payload with user information and expiration time
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + DEFAULT_TOKEN_EXPIRATION,
    };

    // Sign the token using the JWT secret
    return jwt.sign(payload, jwtSecret);
  }

  /**
   * Verifies a JWT token and returns the decoded user information
   * @param token - The JWT token to verify
   * @returns A promise that resolves to the decoded user information
   */
  async verifyAuthToken(token: string): Promise<User> {
    // Get the JWT secret from the configuration
    const jwtSecret = getConfig().jwtSecret;

    try {
      // Verify and decode the token using the JWT secret
      const decoded = jwt.verify(token, jwtSecret) as any;

      // Return the decoded user information
      return {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Updates a user's role for a specific resource
   * @param userId - The ID of the user
   * @param resourceId - The ID of the resource
   * @param scope - The scope of the resource
   * @param newRole - The new role to assign to the user
   * @returns A promise that resolves when the role update is complete
   */
  async updateUserRole(
    userId: string,
    resourceId: string,
    scope: AuthorizationScope,
    newRole: UserRole
  ): Promise<void> {
    // Retrieve the user from the data storage
    const user = await this.dataStorage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get the resource based on the scope and resourceId
    const resource = await this.getResourceByScope(scope, resourceId);
    if (!resource) {
      throw new Error('Resource not found');
    }

    // Update the user's role for the resource
    user.roles = user.roles || {};
    user.roles[resourceId] = newRole;

    // Save the updated user information in the data storage
    await this.dataStorage.updateUser(user);
  }

  private async getResourceByScope(scope: AuthorizationScope, resourceId: string): Promise<any> {
    switch (scope) {
      case AuthorizationScope.Workbook:
        return this.dataStorage.getWorkbook(resourceId);
      case AuthorizationScope.Worksheet:
        return this.dataStorage.getWorksheet(resourceId);
      case AuthorizationScope.Range:
        return this.dataStorage.getRange(resourceId);
      default:
        throw new Error('Invalid authorization scope');
    }
  }

  private getUserRoleForResource(user: User, resource: any): UserRole {
    return user.roles && user.roles[resource.id] ? user.roles[resource.id] : UserRole.Viewer;
  }

  private getRequiredPermissionForAction(action: string): PermissionLevel {
    // Implement logic to map actions to required permission levels
    // This is a simplified example and should be expanded based on your specific requirements
    switch (action) {
      case 'read':
        return PermissionLevel.Read;
      case 'write':
        return PermissionLevel.Write;
      case 'delete':
        return PermissionLevel.Delete;
      default:
        return PermissionLevel.None;
    }
  }

  private checkPermission(userRole: UserRole, requiredPermission: PermissionLevel): boolean {
    // Implement logic to check if the user role has the required permission
    // This is a simplified example and should be expanded based on your specific requirements
    const rolePermissions = {
      [UserRole.Owner]: PermissionLevel.Delete,
      [UserRole.Editor]: PermissionLevel.Write,
      [UserRole.Viewer]: PermissionLevel.Read,
    };

    return rolePermissions[userRole] >= requiredPermission;
  }
}

/**
 * Creates a new authorization policy
 * @param policy - The authorization policy to create
 * @returns A promise that resolves when the policy is created
 */
export async function createAuthorizationPolicy(policy: AuthorizationPolicy): Promise<void> {
  // Validate the policy object
  if (!policy || !policy.id || !policy.rules) {
    throw new Error('Invalid authorization policy');
  }

  // Store the policy in the data storage
  await getConfig().dataStorage.createAuthorizationPolicy(policy);
}

/**
 * Retrieves an authorization policy by its ID
 * @param policyId - The ID of the policy to retrieve
 * @returns A promise that resolves to the requested AuthorizationPolicy
 */
export async function getAuthorizationPolicy(policyId: string): Promise<AuthorizationPolicy> {
  // Retrieve the policy from the data storage using the policyId
  const policy = await getConfig().dataStorage.getAuthorizationPolicy(policyId);

  // If the policy is not found, throw an error
  if (!policy) {
    throw new Error('Authorization policy not found');
  }

  return policy;
}

// Human tasks (commented list)
/**
 * TODO: Human tasks for the Authorization Service
 * 1. [Required] Implement caching mechanism for authorization policies to improve performance
 * 2. [Optional] Add support for fine-grained cell-level permissions
 * 3. [Required] Implement audit logging for authorization checks and role updates
 * 4. [Critical] Review and update JWT token generation and verification process for security best practices
 * 5. [Required] Develop a user interface for managing authorization policies and user roles
 */