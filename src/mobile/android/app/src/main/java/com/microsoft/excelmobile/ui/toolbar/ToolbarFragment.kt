package com.microsoft.excelmobile.ui.toolbar

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.microsoft.excelmobile.R
import com.microsoft.excelmobile.viewmodels.SpreadsheetViewModel

class ToolbarFragment : Fragment() {

    private lateinit var viewModel: SpreadsheetViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the toolbar layout
        return inflater.inflate(R.layout.fragment_toolbar, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Initialize the SpreadsheetViewModel
        viewModel = ViewModelProvider(requireActivity()).get(SpreadsheetViewModel::class.java)

        // Set up observers for relevant LiveData from the ViewModel
        setupObservers()

        // Initialize toolbar buttons and their functionality
        setupToolbarButtons()
    }

    private fun setupObservers() {
        // Observe changes in the ViewModel that affect the toolbar state
        viewModel.currentSelection.observe(viewLifecycleOwner) { selection ->
            updateToolbarState()
        }
    }

    private fun setupToolbarButtons() {
        // Find and initialize toolbar buttons
        val boldButton = view?.findViewById<View>(R.id.bold_button)
        val italicButton = view?.findViewById<View>(R.id.italic_button)
        val underlineButton = view?.findViewById<View>(R.id.underline_button)
        val insertChartButton = view?.findViewById<View>(R.id.insert_chart_button)
        val formulaButton = view?.findViewById<View>(R.id.formula_button)

        // Set up click listeners for each button
        boldButton?.setOnClickListener { viewModel.toggleBold() }
        italicButton?.setOnClickListener { viewModel.toggleItalic() }
        underlineButton?.setOnClickListener { viewModel.toggleUnderline() }
        insertChartButton?.setOnClickListener { showChartDialog() }
        formulaButton?.setOnClickListener { showFormulaDialog() }
    }

    private fun updateToolbarState() {
        // Get current selection or context from the ViewModel
        val currentSelection = viewModel.currentSelection.value

        // Update the enabled/disabled state of toolbar buttons
        view?.findViewById<View>(R.id.bold_button)?.isEnabled = currentSelection != null
        view?.findViewById<View>(R.id.italic_button)?.isEnabled = currentSelection != null
        view?.findViewById<View>(R.id.underline_button)?.isEnabled = currentSelection != null
        view?.findViewById<View>(R.id.insert_chart_button)?.isEnabled = currentSelection != null
        view?.findViewById<View>(R.id.formula_button)?.isEnabled = currentSelection != null

        // Update the visual state of toggle buttons (e.g., bold, italic)
        updateToggleButtonState(R.id.bold_button, viewModel.isBoldApplied())
        updateToggleButtonState(R.id.italic_button, viewModel.isItalicApplied())
        updateToggleButtonState(R.id.underline_button, viewModel.isUnderlineApplied())
    }

    private fun updateToggleButtonState(buttonId: Int, isActive: Boolean) {
        view?.findViewById<View>(buttonId)?.isSelected = isActive
    }

    private fun showChartDialog() {
        // TODO: Implement chart dialog
    }

    private fun showFormulaDialog() {
        // TODO: Implement formula dialog
    }

    companion object {
        fun newInstance() = ToolbarFragment()
    }
}

// TODO: Implement specific Excel functions and features in the toolbar buttons
// TODO: Design and implement custom toolbar icons for Excel-specific functions
// TODO: Optimize toolbar layout for different screen sizes and orientations