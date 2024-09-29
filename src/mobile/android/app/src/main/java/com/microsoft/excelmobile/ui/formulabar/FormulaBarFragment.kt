package com.microsoft.excelmobile.ui.formulabar

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.microsoft.excelmobile.viewmodels.FormulaViewModel
import com.microsoft.excelmobile.models.Formula
import com.microsoft.excelmobile.utils.FormulaParser

class FormulaBarFragment : Fragment() {

    private lateinit var viewModel: FormulaViewModel
    private lateinit var formulaInput: EditText
    private lateinit var cellReferenceDisplay: TextView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_formula_bar, container, false)
        
        // Initialize the formulaInput EditText
        formulaInput = view.findViewById(R.id.formula_input)
        
        // Initialize the cellReferenceDisplay TextView
        cellReferenceDisplay = view.findViewById(R.id.cell_reference_display)
        
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Initialize the ViewModel
        viewModel = ViewModelProvider(this).get(FormulaViewModel::class.java)
        
        // Set up observers for the ViewModel's LiveData
        viewModel.currentFormula.observe(viewLifecycleOwner) { formula ->
            updateFormulaBar(formula)
        }
        
        // Set up input listeners for the formulaInput EditText
        formulaInput.setOnEditorActionListener { _, _, _ ->
            onFormulaChanged(formulaInput.text.toString())
            true
        }
    }

    private fun updateFormulaBar(formula: Formula) {
        formulaInput.setText(formula.expression)
        cellReferenceDisplay.text = formula.cellReference
    }

    private fun onFormulaChanged(newFormula: String) {
        viewModel.updateFormula(newFormula)
        // Trigger formula evaluation through the ViewModel
        viewModel.evaluateFormula()
    }

    companion object {
        fun newInstance() = FormulaBarFragment()
    }
}

// TODO: Implement error handling for invalid formulas
// TODO: Add support for formula autocomplete suggestions
// TODO: Implement undo/redo functionality for formula edits
// TODO: Optimize formula input for performance with large spreadsheets