using System;
using System.Collections.Generic;
using System.Windows;

namespace ExcelDesktop.Utils
{
    /// <summary>
    /// Singleton class responsible for managing and applying themes throughout the Excel desktop application.
    /// </summary>
    public class ThemeManager
    {
        private static ThemeManager _instance;
        private Dictionary<string, ResourceDictionary> _themes;
        private string _currentTheme;

        /// <summary>
        /// Gets the singleton instance of ThemeManager.
        /// </summary>
        public static ThemeManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new ThemeManager();
                }
                return _instance;
            }
        }

        /// <summary>
        /// Gets the currently applied theme.
        /// </summary>
        public string CurrentTheme => _currentTheme;

        /// <summary>
        /// Private constructor to ensure singleton pattern.
        /// </summary>
        private ThemeManager()
        {
            InitializeThemes();
        }

        /// <summary>
        /// Initializes the themes dictionary with default themes.
        /// </summary>
        private void InitializeThemes()
        {
            _themes = new Dictionary<string, ResourceDictionary>();

            // Load default themes (Light, Dark, and High Contrast)
            _themes["Light"] = new ResourceDictionary { Source = new Uri("/ExcelDesktop;component/Resources/Styles.xaml", UriKind.Relative) };
            _themes["Dark"] = new ResourceDictionary { Source = new Uri("/ExcelDesktop;component/Resources/DarkStyles.xaml", UriKind.Relative) };
            _themes["HighContrast"] = new ResourceDictionary { Source = new Uri("/ExcelDesktop;component/Resources/HighContrastStyles.xaml", UriKind.Relative) };

            // Set default theme as 'Light'
            _currentTheme = "Light";
        }

        /// <summary>
        /// Applies the specified theme to the application.
        /// </summary>
        /// <param name="themeName">The name of the theme to apply.</param>
        public void ApplyTheme(string themeName)
        {
            if (_themes.TryGetValue(themeName, out ResourceDictionary theme))
            {
                Application.Current.Resources.MergedDictionaries.Clear();
                Application.Current.Resources.MergedDictionaries.Add(theme);
                _currentTheme = themeName;

                // Notify UI components of theme change
                Application.Current.Resources["ThemeChanged"] = !((bool)Application.Current.Resources["ThemeChanged"]);
            }
            else
            {
                throw new ArgumentException($"Theme '{themeName}' not found.", nameof(themeName));
            }
        }

        /// <summary>
        /// Returns the name of the currently applied theme.
        /// </summary>
        /// <returns>The name of the current theme.</returns>
        public string GetCurrentTheme()
        {
            return _currentTheme;
        }

        /// <summary>
        /// Adds a custom theme to the Themes dictionary.
        /// </summary>
        /// <param name="themeName">The name of the custom theme.</param>
        /// <param name="themeResources">The ResourceDictionary containing the theme resources.</param>
        /// <returns>True if successfully added, false if theme name already exists.</returns>
        public bool AddCustomTheme(string themeName, ResourceDictionary themeResources)
        {
            if (!_themes.ContainsKey(themeName))
            {
                _themes[themeName] = themeResources;
                return true;
            }
            return false;
        }

        /// <summary>
        /// Removes a custom theme from the Themes dictionary.
        /// </summary>
        /// <param name="themeName">The name of the theme to remove.</param>
        /// <returns>True if successfully removed, false if theme doesn't exist or is a default theme.</returns>
        public bool RemoveCustomTheme(string themeName)
        {
            if (_themes.ContainsKey(themeName) && themeName != "Light" && themeName != "Dark" && themeName != "HighContrast")
            {
                _themes.Remove(themeName);
                if (_currentTheme == themeName)
                {
                    ApplyTheme("Light");
                }
                return true;
            }
            return false;
        }
    }
}
```

This implementation of the ThemeManager class follows the specifications provided in the JSON representation. Here are some key points about the implementation:

1. The class is implemented as a singleton to ensure only one instance manages themes across the application.
2. The constructor is private, and the Instance property provides access to the single instance.
3. The InitializeThemes method sets up the default themes (Light, Dark, and High Contrast) and sets the default theme to "Light".
4. The ApplyTheme method changes the current theme and notifies UI components of the change.
5. AddCustomTheme and RemoveCustomTheme methods allow for dynamic theme management.
6. Error handling is implemented for cases like applying a non-existent theme.
7. The class assumes the existence of Styles.xaml, DarkStyles.xaml, and HighContrastStyles.xaml in the Resources folder. These files should be created and populated with appropriate styles for each theme.

Here are the human tasks listed as comments at the end of the file:

```csharp
// Human tasks:
// TODO: Design and implement custom themes for Excel desktop application (Optional)
// TODO: Integrate ThemeManager with the main application to allow users to change themes (Required)