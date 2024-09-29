using System;
using System.Threading.Tasks;
using Microsoft.Identity.Client;
using ExcelDesktop.Interfaces;
using ExcelDesktop.Models;

namespace ExcelDesktop.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private const string ClientId = "YOUR_CLIENT_ID_HERE"; // Replace with actual client ID
        private const string TenantId = "YOUR_TENANT_ID_HERE"; // Replace with actual tenant ID

        private readonly IPublicClientApplication _client;
        private IUser _currentUser;

        public AuthenticationService()
        {
            // Initialize the _client using Microsoft.Identity.Client with ClientId and TenantId
            _client = PublicClientApplicationBuilder
                .Create(ClientId)
                .WithAuthority(AzureCloudInstance.AzurePublic, TenantId)
                .WithRedirectUri("https://login.microsoftonline.com/common/oauth2/nativeclient")
                .Build();

            _currentUser = null;
        }

        public async Task<bool> AuthenticateAsync(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                throw new ArgumentException("Username and password cannot be empty.");
            }

            try
            {
                var result = await _client.AcquireTokenByUsernamePassword(
                    new[] { "User.Read" },
                    username,
                    password
                ).ExecuteAsync();

                _currentUser = new User { Id = result.Account.HomeAccountId.Identifier, Name = result.Account.Username };
                return true;
            }
            catch (MsalException)
            {
                return false;
            }
        }

        public async Task<bool> AuthenticateWithMicrosoftAccountAsync()
        {
            try
            {
                var result = await _client.AcquireTokenInteractive(new[] { "User.Read" })
                    .WithPrompt(Prompt.SelectAccount)
                    .ExecuteAsync();

                _currentUser = new User { Id = result.Account.HomeAccountId.Identifier, Name = result.Account.Username };
                return true;
            }
            catch (MsalException)
            {
                return false;
            }
        }

        public async Task<bool> AuthenticateWithAzureADAsync()
        {
            try
            {
                var result = await _client.AcquireTokenInteractive(new[] { "User.Read" })
                    .WithPrompt(Prompt.SelectAccount)
                    .ExecuteAsync();

                _currentUser = new User { Id = result.Account.HomeAccountId.Identifier, Name = result.Account.Username };
                return true;
            }
            catch (MsalException)
            {
                return false;
            }
        }

        public async Task LogoutAsync()
        {
            if (_currentUser != null)
            {
                var accounts = await _client.GetAccountsAsync();
                foreach (var account in accounts)
                {
                    await _client.RemoveAsync(account);
                }
                _currentUser = null;
            }
        }

        public async Task<IUser> GetCurrentUserAsync()
        {
            if (_currentUser == null)
            {
                try
                {
                    var accounts = await _client.GetAccountsAsync();
                    if (accounts.Any())
                    {
                        var result = await _client.AcquireTokenSilent(new[] { "User.Read" }, accounts.FirstOrDefault())
                            .ExecuteAsync();
                        _currentUser = new User { Id = result.Account.HomeAccountId.Identifier, Name = result.Account.Username };
                    }
                }
                catch (MsalUiRequiredException)
                {
                    // Silent token acquisition failed, user needs to sign-in interactively
                }
            }
            return _currentUser;
        }

        public async Task<bool> IsAuthenticatedAsync()
        {
            var currentUser = await GetCurrentUserAsync();
            return currentUser != null;
        }
    }

    // Placeholder User class, replace with actual implementation
    public class User : IUser
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}