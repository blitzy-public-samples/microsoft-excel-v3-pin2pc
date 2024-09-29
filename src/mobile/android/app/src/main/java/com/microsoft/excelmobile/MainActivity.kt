package com.microsoft.excelmobile

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.FragmentContainerView
import androidx.lifecycle.ViewModelProvider
import com.google.android.material.navigation.NavigationView
import com.microsoft.excelmobile.ui.spreadsheet.SpreadsheetFragment
import com.microsoft.excelmobile.viewmodels.SpreadsheetViewModel

class MainActivity : AppCompatActivity() {

    private lateinit var viewModel: SpreadsheetViewModel
    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navigationView: NavigationView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initViewModel()
        setupToolbar()
        setupNavigation()
        loadSpreadsheetFragment()
    }

    private fun initViewModel() {
        viewModel = ViewModelProvider(this).get(SpreadsheetViewModel::class.java)
    }

    private fun setupToolbar() {
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.apply {
            setDisplayHomeAsUpEnabled(true)
            setHomeAsUpIndicator(R.drawable.ic_menu)
        }
    }

    private fun setupNavigation() {
        drawerLayout = findViewById(R.id.drawer_layout)
        navigationView = findViewById(R.id.nav_view)

        navigationView.setNavigationItemSelectedListener { menuItem ->
            // Handle navigation view item clicks here
            when (menuItem.itemId) {
                R.id.nav_home -> {
                    // Handle the home action
                }
                R.id.nav_settings -> {
                    // Handle the settings action
                }
                // Add more menu items as needed
            }
            drawerLayout.closeDrawers()
            true
        }
    }

    private fun loadSpreadsheetFragment() {
        val fragmentContainer: FragmentContainerView = findViewById(R.id.fragment_container)
        supportFragmentManager.beginTransaction()
            .replace(fragmentContainer.id, SpreadsheetFragment())
            .commit()
    }

    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(navigationView)) {
            drawerLayout.closeDrawer(navigationView)
        } else {
            super.onBackPressed()
        }
    }

    override fun onCreateOptionsMenu(menu: android.view.Menu): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: android.view.MenuItem): Boolean {
        return when (item.itemId) {
            android.R.id.home -> {
                drawerLayout.openDrawer(navigationView)
                true
            }
            R.id.action_settings -> {
                // Handle settings action
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
}
```

This implementation follows the JSON specification provided for the MainActivity class. Here are some key points about the implementation:

1. The class extends AppCompatActivity and implements the required lifecycle methods.
2. It initializes the SpreadsheetViewModel, sets up the Toolbar, NavigationView, and DrawerLayout as specified.
3. The loadSpreadsheetFragment() method is implemented to load the initial SpreadsheetFragment.
4. onBackPressed() is overridden to handle the drawer closing when the back button is pressed.
5. onCreateOptionsMenu() and onOptionsItemSelected() are implemented to handle the options menu and its item selections.

Note that this implementation assumes the existence of certain layout resources (R.layout.activity_main, R.id.toolbar, R.id.drawer_layout, R.id.nav_view, R.id.fragment_container) and menu resources (R.menu.main_menu) which should be created in the respective XML files.

Also, the SpreadsheetFragment and SpreadsheetViewModel classes are assumed to exist based on the import statements, but their exact implementations are not available. You may need to adjust the code if their interfaces differ from what's assumed here.

Lastly, here are the pending human tasks as comments:

```kotlin
// TODO: Implement proper error handling and user feedback mechanisms
// TODO: Add support for different screen sizes and orientations
// TODO: Implement deep linking for opening specific workbooks or worksheets
// TODO: Add accessibility features to ensure the app is usable by all users
// TODO: Implement analytics tracking for user interactions and app usage
// TODO: Add support for dark mode and other theme options